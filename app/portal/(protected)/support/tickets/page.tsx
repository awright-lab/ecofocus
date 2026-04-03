import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalTicketMessages, getPortalTicketsForUser, getPortalUsersByIds } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatResponseTime, getPortalTicketLifecycle } from "@/lib/portal/ticket-lifecycle";
import { formatDate } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Support Requests",
  "Private support ticket list for the EcoFocus portal.",
);

export default async function TicketsPage() {
  const access = await requirePortalAccess("/portal/support/tickets");
  const tickets = await getPortalTicketsForUser(access.effectiveUser);
  const messagesByTicket = new Map(
    await Promise.all(
      tickets.map(async (ticket) => [
        ticket.id,
        await getPortalTicketMessages(ticket.id, access.effectiveRole === "support_admin"),
      ] as const),
    ),
  );
  const authorIds = Array.from(
    new Set(
      tickets.flatMap((ticket) => [
        ticket.requesterId,
        ticket.ownerId || "",
        ...(messagesByTicket.get(ticket.id) || []).map((message) => message.authorId),
      ]),
    ),
  ).filter(Boolean);
  const authors = await getPortalUsersByIds(authorIds);
  const authorsById = new Map(authors.map((author) => [author.id, author]));

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Support"
          title="Your support requests"
          description={
            access.isPreviewMode
              ? "This read-only preview shows the ticket list available to the simulated workspace role."
              : "View request status, priority, and recent activity. Workspace admins can see requests across their workspace, while individual users only see their own."
          }
        />
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
        <div className="hidden grid-cols-[1.35fr_0.85fr_0.7fr_0.95fr_1.1fr_0.8fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
          <span>Ticket</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Waiting on</span>
          <span>Updated</span>
          <span>Open</span>
        </div>
        {tickets.map((ticket) => {
          const lifecycle = getPortalTicketLifecycle({
            ticket,
            messages: messagesByTicket.get(ticket.id) || [],
            authorsById,
          });

          return (
            <div
              key={ticket.id}
              className="border-b border-slate-100 px-6 py-5 text-sm last:border-b-0"
            >
              <div className="grid gap-4 md:grid-cols-[1.35fr_0.85fr_0.7fr_0.95fr_1.1fr_0.8fr] md:gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{ticket.subject}</p>
                  <p className="mt-1 text-slate-600">{ticket.dashboardName}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatResponseTime(lifecycle.firstResponseMinutes)}</p>
                </div>
                <div className="self-center">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:hidden">
                    Status
                  </p>
                  <TicketStatusBadge status={ticket.status} />
                </div>
                <div className="self-center">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:hidden">
                    Priority
                  </p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="self-center">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:hidden">
                    Waiting on
                  </p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {lifecycle.awaitingLabel}
                  </span>
                  {access.effectiveRole === "support_admin" ? (
                    <p className="mt-2 text-xs font-medium text-slate-600">{lifecycle.escalationLabel}</p>
                  ) : null}
                </div>
                <div className="self-center text-slate-600">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:hidden">
                    Updated
                  </p>
                  <p>{formatDate(ticket.updatedAt)}</p>
                  {lifecycle.latestVisibleReplyAuthorName ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Last reply by {lifecycle.latestVisibleReplyAuthorName}
                    </p>
                  ) : null}
                  {access.effectiveRole === "support_admin" ? (
                    <p className="mt-1 text-xs text-slate-500">{lifecycle.attentionLabel}</p>
                  ) : null}
                </div>
                <div className="self-center">
                  <Link
                    href={`/portal/support/tickets/${ticket.id}`}
                    className="inline-flex items-center gap-2 font-semibold text-emerald-700"
                  >
                    <MessageSquareText className="h-4 w-4" />
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
