import { NextRequest, NextResponse } from "next/server";
import { setPortalUserPassword } from "@/lib/portal/provisioning";
import { verifyPortalPasswordResetToken } from "@/lib/portal/password-reset";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  let body: {
    token?: string;
    password?: string;
    confirmPassword?: string;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return asJson({ error: "Invalid request body." }, 400);
  }

  const token = String(body.token || "");
  const password = String(body.password || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!token || !password || !confirmPassword) {
    return asJson({ error: "Reset token, password, and password confirmation are required." }, 400);
  }

  if (password !== confirmPassword) {
    return asJson({ error: "Passwords do not match." }, 400);
  }

  const payload = verifyPortalPasswordResetToken(token);
  if (!payload) {
    return asJson({ error: "This password reset link is invalid or has expired." }, 400);
  }

  try {
    await setPortalUserPassword(payload.email, password);
    return asJson({ ok: true, email: payload.email }, 201);
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "We couldn't reset this portal password.",
      },
      400,
    );
  }
}
