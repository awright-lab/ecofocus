import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalTeamMembersByCompany, getPortalTicketsForUser, getPortalUsersByIds } from "@/lib/portal/data";
import { notifyClientOfPortalTicketUpdate } from "@/lib/portal/email";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

const validStatuses = new Set(["open", "in_progress", "waiting_on_client", "completed"]);

type BulkBody = {
  ticketIds?: string[];
  status?: string;
  ownerId?: string | null;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to change tickets." }, 403);
  }

  let body: BulkBody;
  try {
    body = (await req.json()) as BulkBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const ticketIds = Array.isArray(body.ticketIds)
    ? body.ticketIds.map((value) => String(value).trim()).filter(Boolean)
    : [];
  const nextStatus = typeof body.status === "string" && body.status.trim() ? body.status.trim() : null;
  const nextOwnerId =
    body.ownerId === null ? null : typeof body.ownerId === "string" && body.ownerId.trim() ? body.ownerId.trim() : undefined;

  if (!ticketIds.length) {
    return asJson({ error: "Select at least one ticket." }, 400);
  }

  if (!nextStatus && nextOwnerId === undefined) {
    return asJson({ error: "Choose a status, owner, or both." }, 400);
  }

  if (nextStatus && !validStatuses.has(nextStatus)) {
    return asJson({ error: "Select a valid ticket status." }, 400);
  }

  if (typeof nextOwnerId === "string") {
    const supportTeam = await getPortalTeamMembersByCompany(access.company.id);
    const owner = supportTeam.find((member) => member.id === nextOwnerId && member.role === "support_admin" && member.status !== "inactive");
    if (!owner) {
      return asJson({ error: "Owner must be an active EcoFocus support admin." }, 400);
    }
  }

  const availableTickets = await getPortalTicketsForUser(access.user);
  const selectedTickets = availableTickets.filter((ticket) => ticketIds.includes(ticket.id));
  if (!selectedTickets.length) {
    return asJson({ error: "No matching tickets were found." }, 404);
  }

  if (selectedTickets.some((ticket) => ticket.status === "archived")) {
    return asJson({ error: "Archived tickets are read-only." }, 400);
  }

  try {
    const admin = getServiceSupabase();
    const now = new Date().toISOString();

    for (const ticket of selectedTickets) {
      const payload: Record<string, unknown> = { updated_at: now };
      if (nextStatus) {
        payload.status = nextStatus;
        if (nextStatus === "completed" && ticket.status !== "completed") {
          payload.completed_at = now;
          payload.client_reviewed_completed_at = null;
        } else if (ticket.status === "completed" && nextStatus !== "completed") {
          payload.completed_at = null;
          payload.client_reviewed_completed_at = null;
        }
      }
      if (nextOwnerId !== undefined) payload.owner_id = nextOwnerId;

      const { error } = await admin.from("portal_tickets").update(payload).eq("id", ticket.id);
      if (error) {
        return asJson({ error: error.message }, 500);
      }

      await logPortalAdminAuditEvent({
        access,
        action: "ticket_bulk_updated",
        title: ticket.subject,
        companyId: ticket.companyId,
        entityId: ticket.id,
        notes: "Bulk ticket update applied from the support queue.",
        metadata: {
          ticketId: ticket.id,
          nextStatus: nextStatus || ticket.status,
          nextOwnerId: nextOwnerId === undefined ? ticket.ownerId : nextOwnerId,
        },
      });

      const [requester] = await getPortalUsersByIds([ticket.requesterId]);
      if (requester) {
        const nextOwnerState = nextOwnerId === undefined ? ticket.ownerId : nextOwnerId;
        const changedSummary = [
          nextStatus ? `Status changed to ${nextStatus}.` : null,
          nextOwnerId !== undefined ? `Owner ${nextOwnerState ? "assigned" : "cleared"}.` : null,
        ]
          .filter(Boolean)
          .join(" ");

        try {
          await notifyClientOfPortalTicketUpdate({
            actionLabel: "Ticket updated",
            actor: access.user,
            dashboardName: ticket.dashboardName,
            message: changedSummary || "EcoFocus Support updated your ticket.",
            origin: req.nextUrl.origin,
            requester,
            statusLabel: nextStatus || ticket.status,
            ticketId: ticket.id,
            ticketSubject: ticket.subject,
          });
        } catch (emailError) {
          console.warn("[api/portal/tickets/bulk] Client notification email failed.", {
            ticketId: ticket.id,
            error: emailError instanceof Error ? emailError.message : String(emailError),
          });
        }
      }
    }

    return asJson({ ok: true, updatedCount: selectedTickets.length });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Ticket bulk update unavailable.",
      },
      503,
    );
  }
}
