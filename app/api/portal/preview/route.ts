import { NextRequest, NextResponse } from "next/server";
import {
  PORTAL_PREVIEW_ROLE_COOKIE,
  getPortalAccessContext,
} from "@/lib/portal/auth";
import type { PortalPreviewRole } from "@/lib/portal/types";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: { role?: PortalPreviewRole | "off" };
  try {
    body = (await req.json()) as { role?: PortalPreviewRole | "off" };
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const role = String(body.role || "").trim();
  const response = asJson({ ok: true, role });

  if (!role || role === "off") {
    response.cookies.set({
      name: PORTAL_PREVIEW_ROLE_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    return response;
  }

  const allowedRole = access.previewableRoles.find((item) => item === role);
  if (!allowedRole) {
    return asJson({ error: "Preview role not available for this workspace." }, 403);
  }

  response.cookies.set({
    name: PORTAL_PREVIEW_ROLE_COOKIE,
    value: allowedRole,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
