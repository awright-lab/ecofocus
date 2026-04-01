import { NextRequest, NextResponse } from "next/server";
import { PORTAL_PREVIEW_ROLE_COOKIE, PORTAL_WORKSPACE_COOKIE } from "@/lib/portal/auth";
import { PORTAL_DEV_COOKIE, isPortalDevBypassEnabled } from "@/lib/portal/dev-auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/portal/login", request.url));
  if (isPortalDevBypassEnabled()) {
    response.cookies.set({
      name: PORTAL_DEV_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
    });
  }
  response.cookies.set({
    name: PORTAL_WORKSPACE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: PORTAL_PREVIEW_ROLE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
