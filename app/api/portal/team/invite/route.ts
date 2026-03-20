import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalOrigin } from "@/lib/portal/host";
import { createPortalTeamInvite } from "@/lib/portal/provisioning";
import { getInviteSupabase } from "@/lib/supabase/server";

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

    let emailSent = false;
    let emailWarning: string | null = null;

    try {
      const supabase = getInviteSupabase();
      const callbackUrl = new URL("/auth/confirm", getPortalOrigin(req.url));
      callbackUrl.searchParams.set("next", "/home");

      const { error: authError } = await supabase.auth.signInWithOtp({
        email: result.email,
        options: {
          emailRedirectTo: callbackUrl.toString(),
        },
      });

      if (authError) {
        emailWarning = authError.message;
      } else {
        emailSent = true;
      }
    } catch (error) {
      emailWarning = error instanceof Error ? error.message : "Invite email could not be sent automatically.";
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
