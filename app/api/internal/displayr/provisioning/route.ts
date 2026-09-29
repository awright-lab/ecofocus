import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import {
  ensureProvisioning,
  openProvisioningCredential,
  provisioningEligible,
  provisioningEnabled,
} from "@/lib/portal/displayr-provisioning-store";
import {
  getDisplayrPermissionPlan,
  getDisplayrPermissionState,
} from "@/lib/portal/displayr-permission-store";
import { permissionStatus } from "@/lib/portal/displayr-permissions";
import { getProvisioningMailboxReader } from "@/lib/portal/displayr-mailbox-reader";
const headers = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};
const json = (value: unknown, status = 200) =>
  NextResponse.json(value, { status, headers });
export async function POST(req: NextRequest) {
  const secret = process.env.DISPLAYR_PERMISSION_SYNC_SECRET || "",
    actual = Buffer.from(req.headers.get("authorization") || ""),
    expected = Buffer.from(`Bearer ${secret}`);
  if (
    req.headers.has("origin") ||
    secret.length < 32 ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  )
    return json({ error: "Denied" }, 401);
  if (!provisioningEnabled())
    return json({ error: "Provisioning disabled" }, 503);
  try {
    const raw = await req.text();
    if (raw.length > 64000) return json({ error: "Invalid request" }, 413);
    const body = JSON.parse(raw),
      db = getServiceSupabase();
    if (body.operation === "credentials") {
      const records = [];
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await db
          .from("portal_displayr_provisioning")
          .select("user_id,email,credential_ciphertext,displayr_user_id")
          .in("stage", ["credentials_verified", "ready"])
          .order("user_id")
          .range(offset, offset + 499);
        if (error) throw Error();
        for (const row of data || []) {
          if (!row.displayr_user_id) throw Error();
          records.push({
            userId: row.user_id,
            ...openProvisioningCredential(row),
            displayrUserId: row.displayr_user_id,
          });
        }
        if ((data || []).length < 500) break;
      }
      return json({ records });
    }
    if (body.operation === "claim") {
      if (
        !Array.isArray(body.existingUserIds) ||
        body.existingUserIds.length > 5000 ||
        body.existingUserIds.some((id: unknown) => typeof id !== "string")
      )
        return json({ error: "Invalid request" }, 400);
      const excluded = new Set(body.existingUserIds);
      for (let offset = 0; ; offset += 100) {
        const { data, error } = await db
          .from("portal_users")
          .select("id,name")
          .eq("status", "active")
          .neq("role", "support_admin")
          .order("id")
          .range(offset, offset + 99);
        if (error) throw Error();
        for (const user of data || []) {
          // Startup-configured viewers already exist and must never be recreated.
          if (excluded.has(user.id) || !(await provisioningEligible(user.id)))
            continue;
          await ensureProvisioning(user.id);
          const claim = await db.rpc("portal_displayr_claim_provisioning", {
            p_user_id: user.id,
          });
          if (claim.error) throw Error();
          if (!claim.data) continue;
          const { data: row, error: readError } = await db
            .from("portal_displayr_provisioning")
            .select("*")
            .eq("user_id", user.id)
            .eq("lease_id", claim.data)
            .single();
          if (readError || !row) throw Error();
          return json({
            job: {
              userId: user.id,
              fullName:
                typeof user.name === "string" && user.name.trim()
                  ? user.name.trim().slice(0, 200)
                  : "EcoFocus portal viewer",
              leaseId: claim.data,
              stage: row.stage,
              createdAt: row.created_at,
              credential: openProvisioningCredential(row),
            },
          });
        }
        if ((data || []).length < 100) break;
      }
      return json({ job: null });
    }
    if (
      typeof body.userId !== "string" ||
      typeof body.leaseId !== "string" ||
      !/^[a-f0-9-]{36}$/.test(body.leaseId)
    )
      return json({ error: "Invalid job" }, 400);
    const { data: row, error } = await db
      .from("portal_displayr_provisioning")
      .select("*")
      .eq("user_id", body.userId)
      .eq("lease_id", body.leaseId)
      .gt("lease_until", new Date().toISOString())
      .maybeSingle();
    if (error) throw Error();
    if (!row) return json({ error: "Lease unavailable" }, 409);
    const args = { p_user_id: body.userId, p_lease_id: body.leaseId };
    const rpc = async (name: string, extra: Record<string, unknown> = {}) => {
      const result = await db.rpc(name, { ...args, ...extra });
      if (result.error) throw Error();
      return json({ accepted: result.data === true });
    };
    if (body.operation === "release")
      return rpc("portal_displayr_release_provisioning");
    if (body.operation === "eligible")
      return json({ eligible: await provisioningEligible(body.userId) });
    if (!(await provisioningEligible(body.userId)))
      return json({ error: "Eligibility changed" }, 409);
    if (
      body.operation === "identity" &&
      (typeof body.displayrUserId !== "string" ||
        !/^[1-9][0-9]{0,15}$/.test(body.displayrUserId))
    )
      return json({ error: "Invalid identity" }, 400);
    if (body.operation === "identity")
      return rpc("portal_displayr_provisioning_identity", {
        p_displayr_user_id: body.displayrUserId,
      });
    if (body.operation === "permit")
      return rpc("portal_displayr_provisioning_permit", {
        p_operation: body.kind,
      });
    if (body.operation === "invitation") {
      if (row.stage !== "invitation_pending")
        return json({ error: "Invalid stage" }, 409);
      const mailbox = await getProvisioningMailboxReader(),
        since = new Date(row.created_at);
      const found = await mailbox.findInvitationCandidates(body.userId, since);
      if (!found.complete || found.candidates.length > 1)
        return json({ status: "ambiguous" });
      if (!found.candidates.length) return json({ status: "none" });
      const companyId = process.env.DISPLAYR_SYNC_COMPANY_ID || "";
      const link = await mailbox.readVerifiedInvitation(
        found.candidates[0].messageId,
        body.userId,
        since,
        companyId,
      );
      return json({ status: "verified", link });
    }
    if (body.operation === "transition") {
      const reasons = new Set([
        "account_lookup_ambiguous",
        "existing_account_credentials",
        "invitation_not_verified",
        "activation_requires_review",
      ]);
      if (body.stage === "ready") {
        const plan = await getDisplayrPermissionPlan(body.userId),
          state = await getDisplayrPermissionState(body.userId);
        if (
          permissionStatus(plan, state).status !== "verified" ||
          state?.viewer_key !==
            createHash("sha256")
              .update(row.email.trim().toLowerCase())
              .digest("hex")
        )
          return json({ accepted: false });
      }
      return rpc("portal_displayr_advance_provisioning", {
        p_expected_stage: row.stage,
        p_stage: body.stage,
        p_reason: reasons.has(body.reason) ? body.reason : null,
      });
    }
    return json({ error: "Invalid operation" }, 400);
  } catch {
    return json({ error: "Provisioning unavailable" }, 503);
  }
}
