import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import {
  logDisplayrEmbedRedirectEvent,
  resolveDisplayrEmbedUrl,
  verifyDisplayrEmbedToken,
} from "@/lib/portal/displayr";
import { getPortalDashboardForUser } from "@/lib/portal/data";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
};

export async function GET(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NOINDEX_HEADERS });
  }

  const token = req.nextUrl.searchParams.get("token") || "";
  const payload = verifyDisplayrEmbedToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired embed token." }, { status: 400, headers: NOINDEX_HEADERS });
  }

  if (payload.viewerCompanyId !== access.company.id || payload.userId !== access.user.id) {
    return NextResponse.json({ error: "Embed token does not match this portal session." }, { status: 403, headers: NOINDEX_HEADERS });
  }

  const displayrUrl = await resolveDisplayrEmbedUrl(payload.targetCompanyId, payload.dashboardSlug);
  if (!displayrUrl) {
    return NextResponse.json({ error: "Dashboard mapping not available." }, { status: 404, headers: NOINDEX_HEADERS });
  }

  const dashboard = await getPortalDashboardForUser(access.user, payload.dashboardSlug, access.company.id);
  if (dashboard) {
    await logDisplayrEmbedRedirectEvent({
      userId: access.user.id,
      companyId: access.company.id,
      targetCompanyId: payload.targetCompanyId,
      dashboardId: dashboard.id,
      dashboardName: dashboard.name,
      dashboardSlug: dashboard.slug,
      userAgent: req.headers.get("user-agent"),
    });
  }

  return NextResponse.redirect(displayrUrl, {
    status: 307,
    headers: NOINDEX_HEADERS,
  });
}
