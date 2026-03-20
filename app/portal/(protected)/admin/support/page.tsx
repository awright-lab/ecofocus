import Link from "next/link";
import { AdminDashboardConfigForm } from "@/components/portal/AdminDashboardConfigForm";
import { AdminUsageAllowanceForm } from "@/components/portal/AdminUsageAllowanceForm";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import {
  getPortalCompanies,
  getPortalDashboardCatalog,
  getPortalDashboardConfigsByCompany,
  getPortalTeamMembersByCompany,
  getPortalTeamInvitesByCompany,
  getPortalTicketsForUser,
  getPortalUsageAllowanceByCompany,
  getPortalUsageLogsForAdmin,
  getPortalUsersByIds,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Admin Support Queue",
  "Internal support admin queue for the EcoFocus portal.",
);

const filterOptions = {
  status: ["open", "in_progress", "waiting_on_client", "resolved"],
  priority: ["low", "medium", "high", "urgent"],
  issueType: ["Login / Access", "Dashboard Navigation", "Chart Export", "Data Question", "Possible Bug", "Feature Request", "Training Request"],
};

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;
  const selectedUserParam = Array.isArray(params.user) ? params.user[0] : params.user;
  const selectedStartParam = Array.isArray(params.start) ? params.start[0] : params.start;
  const selectedEndParam = Array.isArray(params.end) ? params.end[0] : params.end;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/support">
      {async (access) => {
        const tickets = await getPortalTicketsForUser(access.user);
        const relatedUserIds = Array.from(new Set(tickets.flatMap((ticket) => [ticket.requesterId, ticket.ownerId].filter(Boolean) as string[])));
        const users = await getPortalUsersByIds(relatedUserIds);
        const usersById = new Map(users.map((user) => [user.id, user]));
        const companies = (await getPortalCompanies()).filter((company) => company.id !== access.company.id);
        const selectedCompanyId = selectedCompanyParam || companies[0]?.id || "";
        const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || null;
        const selectedCompanyUsers = selectedCompanyId ? await getPortalTeamMembersByCompany(selectedCompanyId) : [];
        const selectedCompanyDashboardConfigs = selectedCompanyId ? await getPortalDashboardConfigsByCompany(selectedCompanyId) : [];
        const selectedCompanyInvites = selectedCompanyId ? await getPortalTeamInvitesByCompany(selectedCompanyId) : [];
        const dashboardCatalog = await getPortalDashboardCatalog();
        const usageAllowance = selectedCompanyId
          ? await getPortalUsageAllowanceByCompany(selectedCompanyId)
          : null;
        const usageLogs = await getPortalUsageLogsForAdmin({
          companyId: selectedCompanyId || undefined,
          userId: selectedUserParam || undefined,
          startAt: selectedStartParam ? `${selectedStartParam}T00:00:00Z` : undefined,
          endAt: selectedEndParam ? `${selectedEndParam}T23:59:59Z` : undefined,
          limit: 20,
        });
        const usageLogUsers = await getPortalUsersByIds(Array.from(new Set(usageLogs.map((log) => log.userId))));
        const usageLogUsersById = new Map(usageLogUsers.map((user) => [user.id, user]));
        const openCount = tickets.filter((ticket) => ticket.status === "open").length;
        const urgentCount = tickets.filter((ticket) => ticket.priority === "urgent").length;
        const unassignedCount = tickets.filter((ticket) => !ticket.ownerId).length;
        const selectedCompanyTickets = tickets.filter((ticket) => ticket.companyId === selectedCompanyId);
        const companyDashboardEditorItems = dashboardCatalog.map((dashboard) => {
          const config = selectedCompanyDashboardConfigs.find((item) => item.dashboardSlug === dashboard.slug);
          return {
            slug: dashboard.slug,
            name: dashboard.name,
            description: dashboard.description,
            accessTag: dashboard.accessTag,
            isActive: config?.isActive ?? false,
            displayrEmbedUrl: config?.displayrEmbedUrl ?? dashboard.embedUrl ?? "",
            notes: config?.notes ?? "",
          };
        });
        const inviteActorIds = Array.from(new Set(selectedCompanyInvites.map((invite) => invite.invitedByUserId)));
        const inviteActors = await getPortalUsersByIds(inviteActorIds);
        const inviteActorsById = new Map(inviteActors.map((user) => [user.id, user]));
        const operationalUsageEvents = (
          await getPortalUsageLogsForAdmin({
            companyId: selectedCompanyId || undefined,
            limit: 50,
          })
        ).filter((log) => log.eventType !== "viewer_session" && log.eventType !== "viewer_opened");
        const auditTimeline = [
          ...selectedCompanyInvites.map((invite) => ({
            id: `invite-${invite.id}`,
            eventAt: invite.lastSentAt || invite.createdAt,
            title: `${invite.invitedName} invited to the portal`,
            detail: `${invite.invitedRole.replace("_", " ")} access prepared. Delivery status: ${invite.deliveryStatus.replaceAll("_", " ")}.`,
            actor: inviteActorsById.get(invite.invitedByUserId)?.name || "EcoFocus Team",
            surface: "Team access",
          })),
          ...selectedCompanyDashboardConfigs.map((config) => {
            const dashboard = dashboardCatalog.find((item) => item.slug === config.dashboardSlug);
            return {
              id: `dashboard-${config.id}`,
              eventAt: config.updatedAt,
              title: `${dashboard?.name || config.dashboardSlug} access updated`,
              detail: config.isActive
                ? "Dashboard access is active for this company."
                : "Dashboard access is currently paused for this company.",
              actor: "EcoFocus Support",
              surface: "Dashboard access",
            };
          }),
          ...selectedCompanyTickets.map((ticket) => ({
            id: `ticket-${ticket.id}`,
            eventAt: ticket.updatedAt,
            title: `${ticket.id} updated`,
            detail: `${ticket.subject} is currently ${ticket.status.replaceAll("_", " ")}.`,
            actor: ticket.ownerId ? usersById.get(ticket.ownerId)?.name || "EcoFocus Team" : "Unassigned",
            surface: "Support",
          })),
          ...operationalUsageEvents.map((log) => ({
            id: `usage-${log.id}`,
            eventAt: log.eventAt,
            title: `${log.dashboardName} usage review event`,
            detail: log.notes || log.eventType.replaceAll("_", " "),
            actor: usageLogUsersById.get(log.userId)?.name || log.userId,
            surface: "Usage",
          })),
        ]
          .sort((a, b) => b.eventAt.localeCompare(a.eventAt))
          .slice(0, 12);

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Support queue"
                description="Protected internal view for ticket operations, assignment, prioritization, internal notes, and escalation handling."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {Object.entries(filterOptions).map(([key, values]) => (
                  <div key={key} className="rounded-[24px] bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{key}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {values.map((value) => (
                        <span key={value} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Usage allowance controls</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Review the current dashboard hour allowance for a client company and adjust the tracked total or access period when support review requires it.
                </p>

                <form method="get" className="mt-5 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-800">Client company</span>
                    <select
                      name="company"
                      defaultValue={selectedCompanyId}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="w-fit rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Load company
                  </button>
                </form>

                {selectedCompany && usageAllowance ? (
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.name}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Current period: {formatDate(usageAllowance.periodStart)} to {formatDate(usageAllowance.periodEnd)}
                    </p>
                    <div className="mt-4">
                      <AdminUsageAllowanceForm
                        companyId={selectedCompany.id}
                        annualHoursLimit={usageAllowance.annualHoursLimit}
                        hoursUsed={usageAllowance.hoursUsed}
                        periodStart={usageAllowance.periodStart}
                        periodEnd={usageAllowance.periodEnd}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                    Select a client company to review or seed an allowance record before making updates.
                  </div>
                )}
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">Usage review</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Filter recent dashboard usage by company, user, and date range when investigating allowance disputes or client access questions.
                    </p>
                  </div>
                  <Link href="/api/portal/usage/export" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                    Export current user log
                  </Link>
                </div>

                <form method="get" className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-800">Company</span>
                    <select
                      name="company"
                      defaultValue={selectedCompanyId}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-800">User</span>
                    <select
                      name="user"
                      defaultValue={selectedUserParam || ""}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">All users</option>
                      {selectedCompanyUsers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-800">Start date</span>
                    <input
                      type="date"
                      name="start"
                      defaultValue={selectedStartParam || ""}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-800">End date</span>
                    <input
                      type="date"
                      name="end"
                      defaultValue={selectedEndParam || ""}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Apply usage filters
                    </button>
                  </div>
                </form>

                <div className="mt-6 space-y-3">
                  {usageLogs.length ? (
                    usageLogs.map((log) => (
                      <div key={log.id} className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[1.1fr_1fr_0.55fr_0.85fr] md:items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{log.dashboardName}</p>
                          <p className="mt-1 text-sm text-slate-600">{log.notes || log.eventType.replaceAll("_", " ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {usageLogUsersById.get(log.userId)?.name || "EcoFocus portal user"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {usageLogUsersById.get(log.userId)?.email || log.userId}
                          </p>
                        </div>
                        <div className="text-sm text-slate-700">{log.minutesTracked} min</div>
                        <div className="text-sm text-slate-500">{formatDateTime(log.eventAt)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                      No usage events match the current filter set.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 xl:col-span-3">
                <h3 className="text-lg font-semibold text-slate-950">Company dashboard access</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Turn dashboards on or off for a client company and keep each private dashboard link stored on the server instead of in deployment settings.
                </p>

                {selectedCompany ? (
                  <div className="mt-6">
                    <AdminDashboardConfigForm
                      companyId={selectedCompany.id}
                      companyName={selectedCompany.name}
                      dashboards={companyDashboardEditorItems}
                    />
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                    Select a client company above to manage dashboard access.
                  </div>
                )}
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 xl:col-span-3">
                <h3 className="text-lg font-semibold text-slate-950">Account timeline</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Review recent operational activity for the selected company across invites, dashboard access changes, support work, and allowance-related usage events.
                </p>

                <div className="mt-5 space-y-3">
                  {auditTimeline.length ? (
                    auditTimeline.map((event) => (
                      <div key={event.id} className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[0.9fr_1.4fr_0.9fr_0.8fr] md:items-center">
                        <div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{event.surface}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{event.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
                        </div>
                        <div className="text-sm text-slate-700">{event.actor}</div>
                        <div className="text-sm text-slate-500">{formatDateTime(event.eventAt)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                      No account timeline events are available for the selected company yet.
                    </div>
                  )}
                </div>
              </div>

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
