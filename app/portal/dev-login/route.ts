import { NextRequest, NextResponse } from "next/server";
import { PORTAL_DEV_COOKIE, getDevPortalUserByRole, isPortalDevBypassEnabled } from "@/lib/portal/dev-auth";
import type { PortalRole } from "@/lib/portal/types";

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/")) return "/portal/home";
  return next;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const role = formData.get("role");
  const next = getSafeNextPath(String(formData.get("redirect") || "/portal/home"));
  const redirectUrl = new URL(next, request.url);

  if (!isPortalDevBypassEnabled()) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  if (
    role !== "client_user" &&
    role !== "client_admin" &&
    role !== "agency_user" &&
    role !== "agency_admin" &&
    role !== "external_collaborator" &&
    role !== "support_admin"
  ) {
    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("redirect", next);
    loginUrl.searchParams.set("error", "invalid_dev_role");
    return NextResponse.redirect(loginUrl);
  }

  const user = getDevPortalUserByRole(role as PortalRole);
  if (!user) {
    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("redirect", next);
    loginUrl.searchParams.set("error", "invalid_dev_role");
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: PORTAL_DEV_COOKIE,
    value: user.role,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
