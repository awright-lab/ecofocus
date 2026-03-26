import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalTicketForUser } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type MessageBody = {
  body?: string;
  isInternal?: boolean;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  const { id } = await params;
  const ticket = await getPortalTicketForUser(access.user, id);
  if (!ticket) {
    return asJson({ error: "Ticket not found." }, 404);
  }

  let payload: MessageBody;
  try {
    payload = (await req.json()) as MessageBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const body = String(payload.body || "").trim();
  const isInternal = access.user.role === "support_admin" ? Boolean(payload.isInternal) : false;

  if (!body) {
    return asJson({ error: "Reply body is required." }, 400);
  }

  try {
    const admin = getServiceSupabase();
    const now = new Date().toISOString();
    const { error } = await admin.from("portal_ticket_messages").insert({
      ticket_id: ticket.id,
      author_id: access.user.id,
      body,
      is_internal: isInternal,
      created_at: now,
    });

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    if (access.user.role === "support_admin") {
      await admin
        .from("portal_tickets")
        .update({
          status: isInternal ? ticket.status : "in_progress",
          owner_id: ticket.ownerId || access.user.id,
          updated_at: now,
        })
        .eq("id", ticket.id);
    } else {
      await admin
        .from("portal_tickets")
        .update({
          status: "open",
          updated_at: now,
        })
        .eq("id", ticket.id);
    }

    return asJson({ ok: true }, 201);
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Ticket message storage unavailable.",
      },
      503,
    );
  }
}
