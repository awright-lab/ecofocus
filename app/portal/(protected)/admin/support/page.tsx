import Link from "next/link";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { getPortalTicketsForUser, getPortalUsersByIds } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Admin Support Queue",
  "Internal support admin queue for the EcoFocus portal.",
);

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const _selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/support">
      {async (access) => {
        const tickets = await getPortalTicketsForUser(access.user);
        const relatedUserIds = Array.from(new Set(tickets.flatMap((ticket) => [ticket.requesterId, ticket.ownerId].filter(Boolean) as string[])));
        const users = await getPortalUsersByIds(relatedUserIds);
        const usersById = new Map(users.map((user) => [user.id, user]));
        const openCount = tickets.filter((ticket) => ticket.status === "open").length;
        const urgentCount = tickets.filter((ticket) => ticket.priority === "urgent").length;
        const unassignedCount = tickets.filter((ticket) => !ticket.ownerId).length;

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Support queue"
                description="Protected internal view for ticket operations, assignment, prioritization, internal notes, and escalation handling."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Open queue</p>
                  <p className="mt-2 text-3xl font-semibold">{openCount}</p>
                </div>
                <div className="rounded-[24px] bg-rose-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">Urgent tickets</p>
                  <p className="mt-2 text-3xl font-semibold text-rose-900">{urgentCount}</p>
                </div>
                <div className="rounded-[24px] bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Unassigned</p>
                  <p className="mt-2 text-3xl font-semibold text-amber-900">{unassignedCount}</p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
              <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr_0.9fr_0.8fr_1fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span>Ticket</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Issue Type</span>
                <span>Owner</span>
                <span>Updated</span>
              </div>
              {tickets.map((ticket) => (
                <div key={ticket.id} className="grid grid-cols-[1.4fr_0.9fr_0.8fr_0.9fr_0.8fr_1fr] gap-4 border-b border-slate-100 px-6 py-5 text-sm last:border-b-0">
                  <div>
                    <Link href={`/portal/support/tickets/${ticket.id}`} className="font-semibold text-slate-900 transition hover:text-emerald-700">
                      {ticket.subject}
                    </Link>
                    <p className="mt-1 text-slate-600">{ticket.id}</p>
                  </div>
                  <div className="self-center">
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <div className="self-center">
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <div className="self-center text-slate-700">{ticket.issueType}</div>
                  <div className="self-center text-slate-700">
                    {ticket.ownerId ? usersById.get(ticket.ownerId)?.name || "EcoFocus Team" : "Unassigned"}
                  </div>
                  <div className="self-center text-slate-600">{formatDate(ticket.updatedAt)}</div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Assignment coverage</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Use the queue above to identify unassigned tickets and confirm an owner is attached before handing work across the team.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Internal note handling</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Internal notes are available from each ticket detail page and stay hidden from client users in the shared conversation thread.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Escalation guidance</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Escalate delivery blockers, data integrity concerns, and vendor-side embed issues as soon as timing or client impact is confirmed.
                </p>
              </div>
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
