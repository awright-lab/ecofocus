import { NextRequest, NextResponse } from "next/server";
import { PORTAL_PREVIEW_ROLE_COOKIE, PORTAL_WORKSPACE_COOKIE } from "@/lib/portal/auth";
import { PORTAL_DEV_COOKIE, isPortalDevBypassEnabled } from "@/lib/portal/dev-auth";
import { isPortalHost } from "@/lib/portal/host";
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

  const redirectPath = isPortalHost(request.headers.get("host")) ? "/login" : "/portal/login";
  const response = NextResponse.redirect(new URL(redirectPath, request.url));

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
