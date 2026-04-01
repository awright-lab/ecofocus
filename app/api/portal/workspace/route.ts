import { NextRequest, NextResponse } from "next/server";
import { PORTAL_WORKSPACE_COOKIE, getPortalAccessContext } from "@/lib/portal/auth";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: { companyId?: string };
  try {
    body = (await req.json()) as { companyId?: string };
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const companyId = String(body.companyId || "").trim();
  if (!companyId) {
    return asJson({ error: "companyId is required." }, 400);
  }

  const allowedCompany = access.accessibleCompanies.find((company) => company.id === companyId);
  if (!allowedCompany) {
    return asJson({ error: "Workspace not available for this user." }, 403);
  }

  const response = asJson({ ok: true, companyId });
  response.cookies.set({
    name: PORTAL_WORKSPACE_COOKIE,
    value: companyId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
