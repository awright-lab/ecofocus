import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { isPortalWorkspaceManager } from "@/lib/portal/data";
import { sendPortalTeamInviteEmail } from "@/lib/portal/email";
import { getPortalOrigin } from "@/lib/portal/host";
import { createPortalPasswordSetupToken, updatePortalTeamMemberStatus } from "@/lib/portal/provisioning";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type StatusBody = {
  action?: "deactivate" | "reactivate" | "remove";
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await getPortalAccessContext();
  if (!access || !isPortalWorkspaceManager(access.user.role)) {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to change teammate status." }, 403);
  }

  const { id } = await params;
  if (id === access.user.id) {
    return asJson({ error: "You cannot change your own access from the team page." }, 400);
  }

  let body: StatusBody;
  try {
    body = (await req.json()) as StatusBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const action = body.action;
  if (action !== "deactivate" && action !== "reactivate" && action !== "remove") {
    return asJson({ error: "A valid action is required." }, 400);
  }

  try {
    const result = await updatePortalTeamMemberStatus({
      userId: id,
      companyId: access.company.id,
      subscriptionId: access.subscription.id,
      action,
    });

    if (action === "reactivate" && result.status === "invited") {
      const admin = getServiceSupabase();
      const { data: userRecord, error: userError } = await admin
        .from("portal_users")
        .select("id, name, email, role")
        .eq("id", id)
        .eq("company_id", access.company.id)
        .maybeSingle();

      if (!userError && userRecord?.email) {
        const inviteUrl = new URL("/set-password", getPortalOrigin(req.url));
        inviteUrl.searchParams.set("email", userRecord.email);
        inviteUrl.searchParams.set("invite", "1");
        const setupToken = await createPortalPasswordSetupToken({
          createdByUserId: access.user.id,
          email: userRecord.email,
          userId: userRecord.id,
        });
        inviteUrl.searchParams.set("setup", setupToken.token);
        inviteUrl.searchParams.set("token", setupToken.token);
        const emailDelivery = await sendPortalTeamInviteEmail({
          companyName: access.company.name,
          inviteUrl: inviteUrl.toString(),
          invitedByName: access.user.name,
          recipientName: userRecord.name || userRecord.email,
          roleLabel: String(userRecord.role || "client_user").replace("_", " "),
          to: userRecord.email,
          deliveryKind: "resend",
        });

        const emailSent = emailDelivery.emailSent;
        const emailWarning = emailDelivery.emailWarning;
        const deliveryStatus = emailSent ? "sent" : "manual_only";
        const now = new Date().toISOString();

        try {
          await admin.from("portal_team_invites").insert({
            company_id: access.company.id,
            invited_user_id: userRecord.id,
            invited_name: userRecord.name || userRecord.email,
            invited_email: userRecord.email,
            invited_role: userRecord.role,
            invited_by_user_id: access.user.id,
            invite_url: inviteUrl.toString(),
            delivery_status: deliveryStatus,
            delivery_message: emailWarning,
            created_at: now,
            updated_at: now,
            last_sent_at: emailSent ? now : null,
          });
        } catch (error) {
          console.warn("[portal/team/invite] Unable to store invite activity.", {
            email: userRecord.email,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    return asJson({ ok: true, status: result.status });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to update teammate status.",
      },
      400,
    );
  }
}
