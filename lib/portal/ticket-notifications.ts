import { getPortalTeamMembersByCompany, getPortalUsersByIds } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { PortalTicket, PortalTicketNotification } from "@/lib/portal/types";

type TicketNotificationType = PortalTicketNotification["notificationType"];

function getStatusLabel(status: PortalTicket["status"]) {
  switch (status) {
    case "in_progress":
      return "In progress";
    case "waiting_on_client":
      return "Waiting on your response";
    case "completed":
      return "Completed";
    case "archived":
      return "Archived";
    default:
      return "Open";
  }
}

async function getClientNotificationRecipients(ticket: PortalTicket) {
  const [requester] = await getPortalUsersByIds([ticket.requesterId]);
  const teamMembers = await getPortalTeamMembersByCompany(ticket.companyId);
  const recipients = new Map<string, string>();

  if (requester && requester.status !== "inactive") {
    recipients.set(requester.id, requester.email);
  }

  teamMembers
    .filter(
      (member) =>
        (member.role === "client_admin" || member.role === "agency_admin") &&
        member.status !== "inactive",
    )
    .forEach((member) => recipients.set(member.id, member.email));

  return Array.from(recipients.keys());
}

export async function createPortalTicketNotifications({
  ticket,
  notificationType,
  title,
  body,
}: {
  ticket: PortalTicket;
  notificationType: TicketNotificationType;
  title: string;
  body: string;
}) {
  const recipientIds = await getClientNotificationRecipients(ticket);
  if (!recipientIds.length) return;

  try {
    const admin = getServiceSupabase();
    const now = new Date().toISOString();
    const { error } = await admin.from("portal_ticket_notifications").insert(
      recipientIds.map((userId) => ({
        ticket_id: ticket.id,
        company_id: ticket.companyId,
        user_id: userId,
        notification_type: notificationType,
        title,
        body,
        created_at: now,
      })),
    );

    if (error) {
      console.warn("[portal/ticket-notifications] Unable to store ticket notifications.", {
        ticketId: ticket.id,
        error: error.message,
      });
    }
  } catch (error) {
    console.warn("[portal/ticket-notifications] Ticket notification storage unavailable.", {
      ticketId: ticket.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export function buildTicketUpdateNotification({
  nextOwnerId,
  previousOwnerId,
  nextStatus,
  previousStatus,
}: {
  previousStatus: PortalTicket["status"];
  nextStatus: PortalTicket["status"];
  previousOwnerId: string | null;
  nextOwnerId: string | null;
}) {
  const ownerAssigned = !previousOwnerId && Boolean(nextOwnerId);
  const ownerChanged = previousOwnerId !== nextOwnerId;
  const statusChanged = previousStatus !== nextStatus;

  if (nextStatus === "waiting_on_client" && statusChanged) {
    return {
      notificationType: "waiting_on_client" as const,
      title: "EcoFocus is waiting for your response",
      body: "Your support request needs a reply from your team before EcoFocus can continue.",
    };
  }

  if (ownerAssigned) {
    return {
      notificationType: "assigned" as const,
      title: "Your support request has been assigned",
      body: "An EcoFocus team member is now assigned to your request.",
    };
  }

  if (statusChanged) {
    return {
      notificationType: "status_changed" as const,
      title: "Support request status updated",
      body: `Your request is now ${getStatusLabel(nextStatus).toLowerCase()}.`,
    };
  }

  if (ownerChanged) {
    return {
      notificationType: "assigned" as const,
      title: "Support request assignment updated",
      body: nextOwnerId
        ? "A different EcoFocus team member is now assigned to your request."
        : "Your support request is waiting for a new EcoFocus owner.",
    };
  }

  return null;
}
