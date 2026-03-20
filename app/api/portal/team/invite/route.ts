import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { createPortalTeamInvite } from "@/lib/portal/provisioning";

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

    return asJson({ ok: true, invitedUserId: result.userId, email: result.email }, 201);
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to create the team invite.",
      },
      400,
    );
  }
}
