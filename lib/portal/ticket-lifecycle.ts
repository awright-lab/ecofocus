import type { PortalTicket, PortalTicketMessage, PortalUser } from "@/lib/portal/types";

type LifecycleActor = Pick<PortalUser, "id" | "name" | "role">;

export type PortalTicketLifecycle = {
  firstSupportReplyAt: string | null;
  firstResponseMinutes: number | null;
  latestVisibleReplyAt: string | null;
  latestVisibleReplyAuthorName: string | null;
  latestVisibleReplyBySupport: boolean;
  awaitingLabel: "EcoFocus" | "Client" | "New" | "Closed";
};

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
