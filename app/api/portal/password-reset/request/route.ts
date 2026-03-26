import { NextRequest, NextResponse } from "next/server";
import { sendPortalPasswordResetEmail } from "@/lib/portal/email";
import { buildPortalPasswordResetUrl, getPortalResettableUser } from "@/lib/portal/password-reset";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  let body: { email?: string };

  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return asJson({ error: "Invalid request body." }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email) {
    return asJson({ error: "Email is required." }, 400);
  }

  const portalUser = await getPortalResettableUser(email);
  if (!portalUser) {
    return asJson({
      ok: true,
      emailSent: true,
      emailWarning: null,
    });
  }

  const resetUrl = buildPortalPasswordResetUrl(portalUser.email, req.url);
  const delivery = await sendPortalPasswordResetEmail({
    to: portalUser.email,
    recipientName: portalUser.name,
    resetUrl,
  });

  return asJson({
    ok: true,
    emailSent: delivery.emailSent,
    emailWarning: delivery.emailWarning,
    resetUrl: delivery.emailSent ? null : resetUrl,
  });
}
