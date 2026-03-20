import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { sendPortalInviteEmail } from "@/lib/portal/invite-email";
import { getPortalOrigin } from "@/lib/portal/host";
import { createPortalTeamInvite } from "@/lib/portal/provisioning";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type InviteBody = {
  name?: string;
  email?: string;
  role?: "client_user" | "client_admin";
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || (access.user.role !== "client_admin" && access.user.role !== "support_admin")) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: InviteBody;
  try {
    body = (await req.json()) as InviteBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const role = body.role === "client_admin" ? "client_admin" : "client_user";

  if (!name || !email) {
    return asJson({ error: "Name and email are required." }, 400);
  }

  try {
    const result = await createPortalTeamInvite({
      companyId: access.company.id,
      subscriptionId: access.subscription.id,
      name,
      email,
      role,
    });

    const inviteUrl = new URL("/login", getPortalOrigin(req.url));
    inviteUrl.searchParams.set("email", result.email);
    inviteUrl.searchParams.set("invite", "1");
    const { emailSent, emailWarning } = await sendPortalInviteEmail(result.email, req.url).catch((error: unknown) => ({
      emailSent: false,
      emailWarning: error instanceof Error ? error.message : "Invite email could not be sent automatically.",
    }));
    const deliveryStatus = emailSent ? "sent" : "manual_only";
    const now = new Date().toISOString();

    try {
      const admin = getServiceSupabase();
      await admin.from("portal_team_invites").insert({
        company_id: access.company.id,
        invited_user_id: result.userId,
        invited_name: name,
        invited_email: result.email,
        invited_role: role,
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
        email: result.email,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return asJson(
      {
        ok: true,
        invitedUserId: result.userId,
        email: result.email,
        inviteUrl: inviteUrl.toString(),
        emailSent,
        emailWarning,
      },
      201,
    );
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to create the team invite.",
      },
      400,
    );
  }
}
