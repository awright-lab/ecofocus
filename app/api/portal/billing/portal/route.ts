import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { createPortalBillingPortalSession } from "@/lib/portal/billing";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

export async function GET(req: NextRequest) {
  const access = await getPortalAccessContext();
  const fallbackUrl = new URL("/portal/account", req.url);

  if (!access) {
    const loginUrl = new URL("/portal/login", req.url);
    loginUrl.searchParams.set("redirect", "/portal/account");
    return NextResponse.redirect(loginUrl, { headers: NOINDEX_HEADERS });
  }

  if (access.isPreviewMode) {
    fallbackUrl.searchParams.set("billing", "preview");
    return NextResponse.redirect(fallbackUrl, { headers: NOINDEX_HEADERS });
  }

  try {
    const session = await createPortalBillingPortalSession(
      access.billingCompany.id,
      fallbackUrl.toString(),
    );
    return NextResponse.redirect(session.url, { headers: NOINDEX_HEADERS });
  } catch {
    fallbackUrl.searchParams.set("billing", "unavailable");
    return NextResponse.redirect(fallbackUrl, { headers: NOINDEX_HEADERS });
  }
}
