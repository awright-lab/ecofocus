import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { isPortalWorkspaceManager } from "@/lib/portal/data";
import { sendPortalTeamInviteEmail } from "@/lib/portal/email";
import { getPortalOrigin } from "@/lib/portal/host";
import { createPortalPasswordSetupToken } from "@/lib/portal/provisioning";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
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
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to resend invites." }, 403);
  }

  const { id } = await params;

  try {
    const admin = getServiceSupabase();
    const { data: invite, error: inviteError } = await admin
      .from("portal_team_invites")
      .select("id, company_id, invited_user_id, invited_name, invited_email, invited_role")
      .eq("id", id)
      .eq("company_id", access.company.id)
      .maybeSingle();

    if (inviteError) {
      return asJson({ error: inviteError.message }, 500);
    }

    if (!invite) {
      return asJson({ error: "Invite not found." }, 404);
    }

    if (!invite.invited_user_id) {
      return asJson({ error: "Invite is missing its invited user record." }, 400);
    }

    const now = new Date().toISOString();
    const inviteUrl = new URL("/set-password", getPortalOrigin(req.url));
    inviteUrl.searchParams.set("email", String(invite.invited_email));
    inviteUrl.searchParams.set("invite", "1");
    const setupToken = await createPortalPasswordSetupToken({
      createdByUserId: access.user.id,
      email: String(invite.invited_email),
      userId: String(invite.invited_user_id),
    });
    inviteUrl.searchParams.set("token", setupToken.token);
    const emailDelivery = await sendPortalTeamInviteEmail({
      companyName: access.company.name,
      deliveryKind: "resend",
      inviteUrl: inviteUrl.toString(),
      invitedByName: access.user.name,
      recipientName: String(invite.invited_name),
      roleLabel: String(invite.invited_role || "team member").replace("_", " "),
      to: String(invite.invited_email),
    });
    const emailSent = emailDelivery.emailSent;
    const emailWarning = emailDelivery.emailWarning;

    const { error: updateError } = await admin
      .from("portal_team_invites")
      .update({
        invite_url: inviteUrl.toString(),
        delivery_status: emailSent ? "sent" : "manual_only",
        delivery_message: emailWarning,
        last_sent_at: emailSent ? now : null,
        updated_at: now,
      })
      .eq("id", invite.id);

    if (updateError) {
      return asJson({ error: updateError.message }, 500);
    }

    return asJson({
      ok: true,
      emailSent,
      inviteUrl: inviteUrl.toString(),
      emailWarning,
    });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to resend invite.",
      },
      503,
    );
  }
}
