import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { markPortalTicketNotificationsRead } from "@/lib/portal/data";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type ReadBody = {
  ticketId?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: ReadBody = {};
  try {
    body = (await req.json()) as ReadBody;
  } catch {
    body = {};
  }

  await markPortalTicketNotificationsRead({
    user: access.effectiveUser,
    companyId: access.company.id,
    ticketId: body.ticketId ? String(body.ticketId) : undefined,
  });

  return asJson({ ok: true });
}
