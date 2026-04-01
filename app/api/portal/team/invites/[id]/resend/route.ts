import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { isPortalWorkspaceManager } from "@/lib/portal/data";
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
      .select("id, company_id, invited_email, invite_url")
      .eq("id", id)
      .eq("company_id", access.company.id)
      .maybeSingle();

    if (inviteError) {
      return asJson({ error: inviteError.message }, 500);
    }

    if (!invite) {
      return asJson({ error: "Invite not found." }, 404);
    }

    const now = new Date().toISOString();

    const { error: updateError } = await admin
      .from("portal_team_invites")
      .update({
        delivery_status: "manual_only",
        delivery_message: "Copy and share the password setup link directly with the teammate.",
        last_sent_at: now,
        updated_at: now,
      })
      .eq("id", invite.id);

    if (updateError) {
      return asJson({ error: updateError.message }, 500);
    }

    return asJson({
      ok: true,
      emailSent: false,
      inviteUrl: invite.invite_url,
      emailWarning: "Setup links are now shared directly instead of sending a sign-in email automatically.",
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
