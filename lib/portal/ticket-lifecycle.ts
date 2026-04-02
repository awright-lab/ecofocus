import type { PortalTicket, PortalTicketMessage, PortalUser } from "@/lib/portal/types";

type LifecycleActor = Pick<PortalUser, "id" | "name" | "role">;

export type PortalTicketLifecycle = {
  firstSupportReplyAt: string | null;
  firstResponseMinutes: number | null;
  latestVisibleReplyAt: string | null;
  latestVisibleReplyAuthorName: string | null;
  latestVisibleReplyBySupport: boolean;
  awaitingLabel: "EcoFocus" | "Client" | "New" | "Closed";
  ticketAgeMinutes: number;
  minutesSinceVisibleReply: number | null;
  attentionLabel: "Response overdue" | "Needs owner" | "Stale client follow-up" | "Aging in progress" | "Closed" | "On track";
};

const FIRST_RESPONSE_TARGET_MINUTES: Record<PortalTicket["priority"], number> = {
  urgent: 30,
  high: 120,
  medium: 8 * 60,
  low: 24 * 60,
};

const STALE_CLIENT_FOLLOW_UP_MINUTES = 72 * 60;
const AGING_IN_PROGRESS_MINUTES = 48 * 60;

export function getPortalTicketLifecycle({
  ticket,
  messages,
  authorsById,
}: {
  ticket: PortalTicket;
  messages: PortalTicketMessage[];
  authorsById: Map<string, LifecycleActor>;
}): PortalTicketLifecycle {
  const visibleMessages = messages.filter((message) => !message.isInternal);
  const firstSupportReply = visibleMessages.find((message) => authorsById.get(message.authorId)?.role === "support_admin");
  const latestVisibleReply = visibleMessages.at(-1) || null;
  const latestVisibleReplyAuthor = latestVisibleReply ? authorsById.get(latestVisibleReply.authorId) : null;
  const latestVisibleReplyBySupport = latestVisibleReplyAuthor?.role === "support_admin";

  let awaitingLabel: PortalTicketLifecycle["awaitingLabel"] = "New";
  const ticketAgeMinutes = Math.max(
    Math.round((Date.now() - new Date(ticket.createdAt).getTime()) / 60_000),
    0,
  );
  const minutesSinceVisibleReply = latestVisibleReply
    ? Math.max(Math.round((Date.now() - new Date(latestVisibleReply.createdAt).getTime()) / 60_000), 0)
    : null;

  if (ticket.status === "archived") {
    awaitingLabel = "Closed";
  } else if (ticket.status === "waiting_on_client") {
    awaitingLabel = "Client";
  } else if (ticket.status === "in_progress") {
    awaitingLabel = "EcoFocus";
  } else if (ticket.status === "open") {
    awaitingLabel = latestVisibleReplyBySupport ? "Client" : "EcoFocus";
  }

  if (!visibleMessages.length) {
    awaitingLabel = ticket.status === "archived" ? "Closed" : "New";
  }

  let attentionLabel: PortalTicketLifecycle["attentionLabel"] = "On track";
  if (ticket.status === "archived") {
    attentionLabel = "Closed";
  } else if (!ticket.ownerId) {
    attentionLabel = "Needs owner";
  } else if (!firstSupportReply && ticketAgeMinutes > FIRST_RESPONSE_TARGET_MINUTES[ticket.priority]) {
    attentionLabel = "Response overdue";
  } else if (
    ticket.status === "waiting_on_client" &&
    latestVisibleReplyBySupport &&
    minutesSinceVisibleReply !== null &&
    minutesSinceVisibleReply > STALE_CLIENT_FOLLOW_UP_MINUTES
  ) {
    attentionLabel = "Stale client follow-up";
  } else if (
    ticket.status === "in_progress" &&
    minutesSinceVisibleReply !== null &&
    minutesSinceVisibleReply > AGING_IN_PROGRESS_MINUTES
  ) {
    attentionLabel = "Aging in progress";
  }

  return {
    firstSupportReplyAt: firstSupportReply?.createdAt || null,
    firstResponseMinutes: firstSupportReply
      ? Math.max(
          Math.round(
            (new Date(firstSupportReply.createdAt).getTime() - new Date(ticket.createdAt).getTime()) / 60_000,
          ),
          0,
        )
      : null,
    latestVisibleReplyAt: latestVisibleReply?.createdAt || null,
    latestVisibleReplyAuthorName: latestVisibleReplyAuthor?.name || null,
    latestVisibleReplyBySupport: Boolean(latestVisibleReplyBySupport),
    awaitingLabel,
    ticketAgeMinutes,
    minutesSinceVisibleReply,
    attentionLabel,
  };
}

export function formatResponseTime(minutes: number | null) {
  if (minutes == null) return "No support reply yet";
  if (minutes < 60) return `${minutes}m first response`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!remainder) return `${hours}h first response`;
  return `${hours}h ${remainder}m first response`;
}

export function formatTicketAge(minutes: number) {
  if (minutes < 60) return `${minutes}m old`;
  const hours = Math.floor(minutes / 60);
  const remainderMinutes = minutes % 60;
  if (hours < 24) {
    return remainderMinutes ? `${hours}h ${remainderMinutes}m old` : `${hours}h old`;
  }

  const days = Math.floor(hours / 24);
  const remainderHours = hours % 24;
  return remainderHours ? `${days}d ${remainderHours}h old` : `${days}d old`;
}
