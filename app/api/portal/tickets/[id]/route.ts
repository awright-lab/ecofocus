import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalTeamMembersByCompany, getPortalTicketForUser, getPortalUsersByIds } from "@/lib/portal/data";
import { notifyClientOfPortalTicketUpdate } from "@/lib/portal/email";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

const validStatuses = new Set(["open", "in_progress", "waiting_on_client", "completed", "resolved", "archived"]);

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

  const rawStatus = String(body.status || "").trim();
  const ownerId = body.ownerId === null ? null : String(body.ownerId || "").trim() || null;

  if (!validStatuses.has(rawStatus)) {
    return asJson({ error: "A valid ticket status is required." }, 400);
  }
  const status = rawStatus === "resolved" ? "completed" : rawStatus;

  if (status === "archived" && ticket.status !== "completed" && ticket.status !== "archived") {
    return asJson({ error: "Mark the ticket as completed before archiving it." }, 400);
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

    const changedFields = [
      ticket.status !== status ? `status: ${ticket.status} -> ${status}` : null,
      ticket.ownerId !== ownerId
        ? `owner: ${(ticket.ownerId && "assigned") || "unassigned"} -> ${(ownerId && "assigned") || "unassigned"}`
        : null,
    ].filter(Boolean);

    await logPortalAdminAuditEvent({
      access,
      action: "ticket_updated",
      title: ticket.subject,
      companyId: ticket.companyId,
      entityId: ticket.id,
      notes: changedFields.length ? changedFields.join("; ") : "Ticket details updated.",
      metadata: {
        ticketId: ticket.id,
        nextStatus: status,
        nextOwnerId: ownerId,
      },
    });

    const [requester] = await getPortalUsersByIds([ticket.requesterId]);
    if (requester && changedFields.length) {
      try {
        await notifyClientOfPortalTicketUpdate({
          actionLabel: "Ticket updated",
          actor: access.user,
          dashboardName: ticket.dashboardName,
          message: changedFields.join("; "),
          origin: req.nextUrl.origin,
          requester,
          statusLabel: status,
          ticketId: ticket.id,
          ticketSubject: ticket.subject,
        });
      } catch (emailError) {
        console.warn("[api/portal/tickets/[id]] Client notification email failed.", {
          ticketId: ticket.id,
          error: emailError instanceof Error ? emailError.message : String(emailError),
        });
      }
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
