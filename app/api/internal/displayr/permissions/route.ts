import { isDisplayrManagedUser } from "@/lib/portal/displayr-gateway-config";
import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { getDisplayrPermissionPlan } from "@/lib/portal/displayr-permission-store";
const headers = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers });
export async function POST(req: NextRequest) {
  const secret = process.env.DISPLAYR_PERMISSION_SYNC_SECRET || "";
  const actual = Buffer.from(req.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (
    req.headers.has("origin") ||
    secret.length < 32 ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  )
    return json({ error: "Denied" }, 401);
  const userIds = [
    process.env.DISPLAYR_GATEWAY_MANAGED_USER_IDS,
    process.env.DISPLAYR_PROVISIONING_ENABLED === "true"
      ? process.env.DISPLAYR_PROVISIONING_USER_IDS
      : "",
  ]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const db = getServiceSupabase();
  try {
    if (body.operation === "claim") {
      // Keep reconciling previously managed identities after allowlist removal,
      // including portal deletion, so access removal is not silently abandoned.
      const prior: { user_id: string; next_attempt_at: string }[] = [];
      for (let offset = 0; ; offset += 1000) {
        const page = await db
          .from("portal_displayr_permission_sync")
          .select("user_id,next_attempt_at")
          .order("user_id")
          .range(offset, offset + 999);
        if (page.error) throw new Error();
        prior.push(...page.data);
        if (page.data.length < 1000) break;
      }
      let enrolled = userIds;
      if (userIds.includes("*")) {
        enrolled = [];
        for (let offset = 0; ; offset += 1000) {
          const page = await db
            .from("portal_users")
            .select("id")
            .order("id")
            .range(offset, offset + 999);
          if (page.error) throw new Error();
          enrolled.push(...page.data.map((user) => user.id));
          if (page.data.length < 1000) break;
        }
      }
      enrolled = enrolled.filter(isDisplayrManagedUser);
      const due = new Map(
        prior.map((state) => [
          state.user_id,
          Date.parse(state.next_attempt_at),
        ]),
      );
      const candidates = [
        ...new Set([...enrolled, ...prior.map((state) => state.user_id)]),
      ].sort((a, b) => (due.get(a) || 0) - (due.get(b) || 0));
      for (const userId of candidates) {
        const plan = await getDisplayrPermissionPlan(userId);
        const claim = await db.rpc("portal_displayr_claim_permissions", {
          p_user_id: userId,
          p_revision: plan.revision,
          p_viewer_key:
            typeof body.viewerKeys?.[userId] === "string" &&
            /^[a-f0-9]{64}$/.test(body.viewerKeys[userId])
              ? body.viewerKeys[userId]
              : null,
        });
        if (claim.error) throw new Error();
        if (claim.data)
          return json({
            job: {
              userId,
              revision: plan.revision,
              groupIds: plan.groupIds,
              blocked: plan.blocked,
              leaseId: claim.data,
            },
          });
      }
      return json({ job: null });
    }
    if (
      body.operation === "complete" &&
      typeof body.userId === "string" &&
      /^[a-f0-9]{64}$/.test(body.revision) &&
      /^[a-f0-9-]{36}$/.test(body.leaseId)
    ) {
      const plan = await getDisplayrPermissionPlan(body.userId);
      const reasons = new Set([
        "viewer_missing",
        "administrator_unavailable",
        "group_update_failed",
        "group_readback_failed",
        "mapping_required",
      ]);
      const stages = new Set([
        "administrator_login",
        "browser_setup",
        "account_page",
        "viewer_lookup",
        "edit_page",
        "edit_form",
        "group_submission",
        "group_readback",
      ]);
      const stale = plan.revision !== body.revision;
      const verified = !stale && !plan.blocked && body.verified === true;
      const result = await db.rpc("portal_displayr_finish_permissions", {
        p_user_id: body.userId,
        p_revision: body.revision,
        p_lease_id: body.leaseId,
        p_status: stale ? "pending" : verified ? "verified" : "needs_attention",
        p_reason: stale
          ? "assignments_changed"
          : plan.blocked
            ? "mapping_required"
            : verified
              ? null
              : reasons.has(body.reason)
                ? body.reason === "group_update_failed" &&
                  stages.has(body.stage)
                  ? `${body.reason}:${body.stage}`
                  : body.reason
                : "group_update_failed",
      });
      if (result.error) throw new Error();
      return json({ accepted: result.data === true });
    }
    return json({ error: "Invalid operation" }, 400);
  } catch {
    return json({ error: "Permission synchronization unavailable" }, 503);
  }
}
