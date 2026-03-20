import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalTicketsForUser } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "My Tickets",
  "Private support ticket list for the EcoFocus portal.",
);

export default async function TicketsPage() {
  const access = await requirePortalAccess("/portal/support/tickets");
  const tickets = await getPortalTicketsForUser(access.user);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="My Tickets"
          title="Track support requests"
          description="View request status, priority, and last activity. Client users only see their own tickets; support admins can see the full queue in the admin view."
        />
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span>Ticket</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Updated</span>
          <span>Open</span>
        </div>
        {tickets.map((ticket) => (
          <div key={ticket.id} className="grid grid-cols-[1.5fr_1fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-slate-100 px-6 py-5 text-sm last:border-b-0">
            <div>
              <p className="font-semibold text-slate-900">{ticket.subject}</p>
              <p className="mt-1 text-slate-600">{ticket.dashboardName}</p>
            </div>
            <div className="self-center">
              <TicketStatusBadge status={ticket.status} />
            </div>
            <div className="self-center">
              <PriorityBadge priority={ticket.priority} />
            </div>
            <div className="self-center text-slate-600">{formatDate(ticket.updatedAt)}</div>
            <div className="self-center">
              <Link href={`/portal/support/tickets/${ticket.id}`} className="inline-flex items-center gap-2 font-semibold text-emerald-700">
                <MessageSquareText className="h-4 w-4" />
                View
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
