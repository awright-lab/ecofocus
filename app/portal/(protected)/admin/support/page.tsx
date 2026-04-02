import Link from "next/link";
import { AdminSupportQueueTable } from "@/components/portal/AdminSupportQueueTable";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { getPortalCompanies, getPortalTicketMessages, getPortalTicketsForUser, getPortalUsersByIds } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { getPortalTicketLifecycle } from "@/lib/portal/ticket-lifecycle";
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
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;
  const selectedStatusParam = Array.isArray(params.status) ? params.status[0] : params.status;
  const selectedPriorityParam = Array.isArray(params.priority) ? params.priority[0] : params.priority;
  const selectedOwnerParam = Array.isArray(params.owner) ? params.owner[0] : params.owner;
  const selectedSearchParam = Array.isArray(params.search) ? params.search[0] : params.search;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/support">
      {async (access) => {
        const tickets = await getPortalTicketsForUser(access.user);
        const messagesByTicket = new Map(
          await Promise.all(
            tickets.map(async (ticket) => [ticket.id, await getPortalTicketMessages(ticket.id, true)] as const),
          ),
        );
        const relatedUserIds = Array.from(
          new Set(
            tickets.flatMap((ticket) => [
              ...([ticket.requesterId, ticket.ownerId].filter(Boolean) as string[]),
              ...(messagesByTicket.get(ticket.id) || []).map((message) => message.authorId),
            ]),
          ),
        );
        const users = await getPortalUsersByIds(relatedUserIds);
        const usersById = new Map(users.map((user) => [user.id, user]));
        const companies = await getPortalCompanies();
        const companiesById = new Map(companies.map((company) => [company.id, company.name]));

        const selectedCompanyId = selectedCompanyParam || "";
        const selectedStatus = selectedStatusParam || "";
        const selectedPriority = selectedPriorityParam || "";
        const selectedOwner = selectedOwnerParam || "";
        const searchQuery = (selectedSearchParam || "").trim().toLowerCase();

        const filteredTickets = tickets.filter((ticket) => {
          if (selectedCompanyId && ticket.companyId !== selectedCompanyId) return false;
          if (selectedStatus && ticket.status !== selectedStatus) return false;
          if (selectedPriority && ticket.priority !== selectedPriority) return false;
          if (selectedOwner === "unassigned" && ticket.ownerId) return false;
          if (selectedOwner && selectedOwner !== "unassigned" && ticket.ownerId !== selectedOwner) return false;
          if (!searchQuery) return true;

          const ownerName = ticket.ownerId ? usersById.get(ticket.ownerId)?.name || "" : "";
          const companyName = companiesById.get(ticket.companyId) || "";
          return [ticket.subject, ticket.id, ticket.dashboardName, ticket.issueType, ownerName, companyName]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery);
        });

        const openCount = filteredTickets.filter((ticket) => ticket.status === "open").length;
        const urgentCount = filteredTickets.filter((ticket) => ticket.priority === "urgent").length;
        const unassignedCount = filteredTickets.filter((ticket) => !ticket.ownerId).length;
        const ownedByCurrentAdminCount = filteredTickets.filter((ticket) => ticket.ownerId === access.user.id).length;
        const lifecycleByTicketId = new Map(
          filteredTickets.map((ticket) => [
            ticket.id,
            getPortalTicketLifecycle({
              ticket,
              messages: messagesByTicket.get(ticket.id) || [],
              authorsById: usersById,
            }),
          ]),
        );
        const overdueCount = filteredTickets.filter(
          (ticket) => lifecycleByTicketId.get(ticket.id)?.attentionLabel === "Response overdue",
        ).length;
        const staleQueueCount = filteredTickets.filter((ticket) => {
          const attentionLabel = lifecycleByTicketId.get(ticket.id)?.attentionLabel;
          return attentionLabel === "Stale client follow-up" || attentionLabel === "Aging in progress";
        }).length;
        const ownerOptions = users
          .filter((user) => user.role === "support_admin")
          .sort((a, b) => a.name.localeCompare(b.name));
        const quickScopeLinkClass =
          "rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700";
        const selectedQuickScopeLinkClass =
          "rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800";

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Support queue"
                description="Protected internal view for ticket operations, assignment, prioritization, internal notes, and escalation handling."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-5">
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
                <div className="rounded-[24px] bg-orange-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Response overdue</p>
                  <p className="mt-2 text-3xl font-semibold text-orange-900">{overdueCount}</p>
                </div>
                <div className="rounded-[24px] bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Stale follow-up</p>
                  <p className="mt-2 text-3xl font-semibold text-sky-900">{staleQueueCount}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/portal/admin/support?owner=${encodeURIComponent(access.user.id)}`}
                  className={selectedOwner === access.user.id ? selectedQuickScopeLinkClass : quickScopeLinkClass}
                >
                  My tickets {ownedByCurrentAdminCount ? `(${ownedByCurrentAdminCount})` : ""}
                </Link>
                <Link
                  href="/portal/admin/support?owner=unassigned"
                  className={selectedOwner === "unassigned" ? selectedQuickScopeLinkClass : quickScopeLinkClass}
                >
                  Unassigned only {unassignedCount ? `(${unassignedCount})` : ""}
                </Link>
                <Link
                  href="/portal/admin/support?priority=urgent"
                  className={selectedPriority === "urgent" ? selectedQuickScopeLinkClass : quickScopeLinkClass}
                >
                  Urgent only {urgentCount ? `(${urgentCount})` : ""}
                </Link>
                <Link href="/portal/admin/support" className={quickScopeLinkClass}>
                  Reset queue view
                </Link>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <form method="get" className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,0.8fr))_auto] xl:items-end">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Search</span>
                  <input
                    type="search"
                    name="search"
                    defaultValue={selectedSearchParam || ""}
                    placeholder="Search ticket, dashboard, company, or owner"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Workspace</span>
                  <select
                    name="company"
                    defaultValue={selectedCompanyId}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">All workspaces</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Status</span>
                  <select
                    name="status"
                    defaultValue={selectedStatus}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">All statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="waiting_on_client">Waiting on client</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Priority</span>
                  <select
                    name="priority"
                    defaultValue={selectedPriority}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">All priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Owner</span>
                  <select
                    name="owner"
                    defaultValue={selectedOwner}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">All owners</option>
                    <option value="unassigned">Unassigned</option>
                    {ownerOptions.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-end gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Apply
                  </button>
                  <Link
                    href="/portal/admin/support"
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Clear
                  </Link>
                </div>
              </form>
            </section>

            {filteredTickets.length ? (
              <AdminSupportQueueTable
                ownerOptions={ownerOptions}
                tickets={filteredTickets.map((ticket) => ({
                  ...(lifecycleByTicketId.get(ticket.id) || {
                    awaitingLabel: "New",
                    firstResponseMinutes: null,
                    attentionLabel: "On track",
                    ticketAgeMinutes: 0,
                  }),
                  id: ticket.id,
                  subject: ticket.subject,
                  companyId: ticket.companyId,
                  companyName: companiesById.get(ticket.companyId) || ticket.companyId,
                  status: ticket.status,
                  priority: ticket.priority,
                  ownerId: ticket.ownerId,
                  ownerName: ticket.ownerId ? usersById.get(ticket.ownerId)?.name || "EcoFocus Team" : "Unassigned",
                  updatedLabel: formatDate(ticket.updatedAt),
                }))}
              />
            ) : (
              <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
                <div className="px-6 py-8 text-sm text-slate-600">
                  No tickets match the current filters.
                </div>
              </section>
            )}

            <section className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Fast triage</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Use the inline queue actions to grab ownership, move tickets into progress, or archive completed work without leaving the table.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Internal notes</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Internal notes are available from each ticket detail page and stay hidden from client users in the shared conversation thread.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Escalation path</h3>
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
