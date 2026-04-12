import { NextRequest, NextResponse } from "next/server";
import { PORTAL_PREVIEW_ROLE_COOKIE, PORTAL_WORKSPACE_COOKIE } from "@/lib/portal/auth";
import { PORTAL_DEV_COOKIE, isPortalDevBypassEnabled } from "@/lib/portal/dev-auth";
import { getPortalOrigin, getRequestHost, isPortalHost } from "@/lib/portal/host";
import { PORTAL_REMEMBER_COOKIE, getPortalCookieDomain } from "@/lib/portal/session";
import { getServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabase();
    await supabase.auth.signOut();
  } catch (error) {
    console.warn("[api/portal/logout] Supabase sign-out failed.", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const requestHost = getRequestHost(request.headers);
  const portalRequest = isPortalHost(requestHost);
  const redirectUrl = portalRequest
    ? new URL("/login", getPortalOrigin(request.url))
    : new URL("/portal/login", request.url);
  const response = NextResponse.redirect(redirectUrl);
  const cookieDomain = getPortalCookieDomain(requestHost || request.url);

  if (isPortalDevBypassEnabled()) {
    response.cookies.set({
      name: PORTAL_DEV_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
      domain: cookieDomain,
    });
  }

  response.cookies.set({
    name: PORTAL_WORKSPACE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    domain: cookieDomain,
  });
  response.cookies.set({
    name: PORTAL_PREVIEW_ROLE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    domain: cookieDomain,
  });
  response.cookies.set({
    name: PORTAL_REMEMBER_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    domain: cookieDomain,
  });

  return response;
}
