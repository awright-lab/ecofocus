import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { sendPortalInviteEmail } from "@/lib/portal/invite-email";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await getPortalAccessContext();
  if (!access || (access.user.role !== "client_admin" && access.user.role !== "support_admin")) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  const { id } = await params;

  try {
    const admin = getServiceSupabase();
    const { data: invite, error: inviteError } = await admin
      .from("portal_team_invites")
      .select("id, company_id, invited_email")
      .eq("id", id)
      .eq("company_id", access.company.id)
      .maybeSingle();

    if (inviteError) {
      return asJson({ error: inviteError.message }, 500);
    }

    if (!invite) {
      return asJson({ error: "Invite not found." }, 404);
    }

    const { emailSent, emailWarning } = await sendPortalInviteEmail(invite.invited_email, req.url);
    const deliveryStatus = emailSent ? "sent" : "manual_only";
    const now = new Date().toISOString();

    const { error: updateError } = await admin
      .from("portal_team_invites")
      .update({
        delivery_status: deliveryStatus,
        delivery_message: emailWarning,
        last_sent_at: now,
        updated_at: now,
      })
      .eq("id", invite.id);

    if (updateError) {
      return asJson({ error: updateError.message }, 500);
    }

    return asJson({ ok: true, emailSent, emailWarning });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to resend invite.",
      },
      503,
    );
  }
}
