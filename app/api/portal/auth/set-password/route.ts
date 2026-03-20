import { NextRequest, NextResponse } from "next/server";
import { setPortalUserPassword } from "@/lib/portal/provisioning";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return asJson({ error: "Invalid request body." }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!email || !password || !confirmPassword) {
    return asJson({ error: "Email, password, and password confirmation are required." }, 400);
  }

  if (password !== confirmPassword) {
    return asJson({ error: "Passwords do not match." }, 400);
  }

  try {
    await setPortalUserPassword(email, password);
    return asJson({ ok: true }, 201);
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "We couldn't set a password for this portal account.",
      },
      400,
    );
  }
}
