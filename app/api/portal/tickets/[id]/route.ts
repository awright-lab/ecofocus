import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalTeamMembersByCompany, getPortalTicketForUser } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

const validStatuses = new Set(["open", "in_progress", "waiting_on_client", "resolved"]);

type UpdateBody = {
  status?: string;
  ownerId?: string | null;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to change ticket status." }, 403);
  }

  const { id } = await params;
  const ticket = await getPortalTicketForUser(access.user, id);
  if (!ticket) {
    return asJson({ error: "Ticket not found." }, 404);
  }

  let body: UpdateBody;
  try {
    body = (await req.json()) as UpdateBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const status = String(body.status || "").trim();
  const ownerId = body.ownerId === null ? null : String(body.ownerId || "").trim() || null;

  if (!validStatuses.has(status)) {
    return asJson({ error: "A valid ticket status is required." }, 400);
  }

  if (ownerId) {
    const supportTeam = await getPortalTeamMembersByCompany(access.company.id);
    const owner = supportTeam.find((member) => member.id === ownerId && member.role === "support_admin" && member.status !== "inactive");
    if (!owner) {
      return asJson({ error: "Owner must be an active EcoFocus support admin." }, 400);
    }
  }

  try {
    const admin = getServiceSupabase();
    const { error } = await admin
      .from("portal_tickets")
      .update({
        status,
        owner_id: ownerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticket.id);

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Ticket storage unavailable.",
      },
      503,
    );
  }
}
