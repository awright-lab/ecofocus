import { NextRequest, NextResponse } from "next/server";
import { PORTAL_DEV_USAGE_COOKIE, isPortalDevBypassEnabled } from "@/lib/portal/dev-auth";

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/")) return "/portal/home";
  return next;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const mode = formData.get("mode");
  const next = getSafeNextPath(String(formData.get("redirect") || "/portal/home"));
  const response = NextResponse.redirect(new URL(next, request.url));

  if (!isPortalDevBypassEnabled()) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  if (mode === "available" || mode === "exhausted") {
    response.cookies.set({
      name: PORTAL_DEV_USAGE_COOKIE,
      value: mode,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
    });
    return response;
  }

  response.cookies.set({
    name: PORTAL_DEV_USAGE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
