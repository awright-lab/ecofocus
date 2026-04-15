import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

  const markedCount = await markPortalTicketNotificationsRead({
    user: access.effectiveUser,
    companyId: access.company.id,
    ticketId: body.ticketId ? String(body.ticketId) : undefined,
  });

  if (markedCount > 0) {
    revalidatePath("/portal/home");
    revalidatePath("/portal/support");
    revalidatePath("/portal/support/tickets");
    if (body.ticketId) {
      revalidatePath(`/portal/support/tickets/${String(body.ticketId)}`);
    }
  }

  return asJson({ ok: true, markedCount });
}
