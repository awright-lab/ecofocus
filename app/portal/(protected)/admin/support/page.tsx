import Link from "next/link";
import { AdminDashboardConfigForm } from "@/components/portal/AdminDashboardConfigForm";
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
  getPortalUsersByIds,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Admin Support Queue",
  "Internal support admin queue for the EcoFocus portal.",
);

const filterOptions = {
  status: ["open", "in_progress", "waiting_on_client", "archived"],
  priority: ["low", "medium", "high", "urgent"],
  issueType: ["Login / Access", "Dashboard Navigation", "Chart Export", "Data Question", "Possible Bug", "Feature Request", "Training Request"],
};

const timelineFilterOptions = [
  { value: "all", label: "All activity" },
  { value: "team", label: "Invites" },
  { value: "dashboard", label: "Dashboard access" },
  { value: "support", label: "Support" },
] as const;

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;
  const selectedTimelineParam = Array.isArray(params.timeline) ? params.timeline[0] : params.timeline;
  const timelineFilter =
    timelineFilterOptions.some((option) => option.value === selectedTimelineParam) ? selectedTimelineParam || "all" : "all";

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
        const selectedCompanyDashboardConfigs = selectedCompanyId ? await getPortalDashboardConfigsByCompany(selectedCompanyId) : [];
        const selectedCompanyInvites = selectedCompanyId ? await getPortalTeamInvitesByCompany(selectedCompanyId) : [];
        const dashboardCatalog = await getPortalDashboardCatalog();
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
        const auditTimeline = [
          ...selectedCompanyInvites.map((invite) => ({
            id: `invite-${invite.id}`,
            eventAt: invite.lastSentAt || invite.createdAt,
            title: `${invite.invitedName} invited to the portal`,
            detail: `${invite.invitedRole.replace("_", " ")} access prepared. Delivery status: ${invite.deliveryStatus.replaceAll("_", " ")}.`,
            actor: inviteActorsById.get(invite.invitedByUserId)?.name || "EcoFocus Team",
            surface: "Team access",
            surfaceKey: "team",
            href: "/portal/team",
            linkLabel: "Open team access",
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
              surfaceKey: "dashboard",
              href: `/portal/admin/support?company=${encodeURIComponent(selectedCompanyId)}#dashboard-access`,
              linkLabel: "Open dashboard access",
            };
          }),
          ...selectedCompanyTickets.map((ticket) => ({
            id: `ticket-${ticket.id}`,
            eventAt: ticket.updatedAt,
            title: `${ticket.id} updated`,
            detail: `${ticket.subject} is currently ${ticket.status.replaceAll("_", " ")}.`,
            actor: ticket.ownerId ? usersById.get(ticket.ownerId)?.name || "EcoFocus Team" : "Unassigned",
            surface: "Support",
            surfaceKey: "support",
            href: `/portal/support/tickets/${ticket.id}`,
            linkLabel: "Open ticket",
          })),
        ]
          .filter((event) => timelineFilter === "all" || event.surfaceKey === timelineFilter)
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

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Usage and subscription controls</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Allowance changes, seat capacity updates, and other subscription controls now live on their own admin page so the support queue stays focused on ticket operations.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/portal/admin/usage${selectedCompanyId ? `?company=${encodeURIComponent(selectedCompanyId)}` : ""}`}
                    className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open usage controls
                  </Link>
                  <Link
                    href={`/portal/admin/audit${selectedCompanyId ? `?company=${encodeURIComponent(selectedCompanyId)}` : ""}`}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Review usage audit
                  </Link>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Operational scope</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  The support queue is now scoped to tickets, dashboard access, company operations, and recent account activity. Use Audit for usage investigation and Usage Controls for contract or allowance updates.
                </p>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div id="dashboard-access" className="rounded-[32px] border border-slate-200 bg-white p-6 xl:col-span-3">
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
                  Review recent operational activity for the selected company across invites, dashboard access changes, and support work.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {timelineFilterOptions.map((option) => {
                    const href = new URLSearchParams();
                    if (selectedCompanyId) href.set("company", selectedCompanyId);
                    if (option.value !== "all") href.set("timeline", option.value);

                    return (
                      <Link
                        key={option.value}
                        href={`/portal/admin/support${href.toString() ? `?${href.toString()}` : ""}#account-timeline`}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          timelineFilter === option.value
                            ? "bg-slate-950 text-white"
                            : "border border-slate-300 text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
                        }`}
                      >
                        {option.label}
                      </Link>
                    );
                  })}
                </div>

                <div id="account-timeline" className="mt-5 space-y-3">
                  {auditTimeline.length ? (
                    auditTimeline.map((event) => (
                      <div key={event.id} className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[0.8fr_1.45fr_0.85fr_0.8fr_0.75fr] md:items-center">
                        <div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{event.surface}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{event.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
                        </div>
                        <div className="text-sm text-slate-700">{event.actor}</div>
                        <div className="text-sm text-slate-500">{formatDateTime(event.eventAt)}</div>
                        <div>
                          <Link
                            href={event.href}
                            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                          >
                            {event.linkLabel}
                          </Link>
                        </div>
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
