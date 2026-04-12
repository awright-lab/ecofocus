import Link from "next/link";
import { CircleHelp, Clock3, LayoutDashboard, LifeBuoy } from "lucide-react";
import { DashboardCard } from "@/components/portal/DashboardCard";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import {
  getPortalArticles,
  getPortalActiveDashboardConfigs,
  getPortalDashboardConfigsByCompany,
  getPortalDashboardsForUser,
  getPortalTicketsForUser,
  getPortalUsageLogsForAdmin,
  getPortalUsageStatus,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Portal Home",
  "Private portal landing page for dashboard access, support activity, and account actions.",
);

export default async function PortalHomePage() {
  const access = await requirePortalAccess("/portal/home");
  const baseDashboards = await getPortalDashboardsForUser(access.effectiveUser, access.company.id);
  const activeWorkspaceConfigs =
    access.effectiveUser.role === "support_admin" && access.company.subscriberType === "internal"
      ? (await getPortalActiveDashboardConfigs()).filter((config) => !config.isHidden)
      : (await getPortalDashboardConfigsByCompany(access.company.id)).filter(
          (config) => config.isActive && !config.isHidden,
        );
  const activeWorkspaceConfigsBySlug = new Map(
    activeWorkspaceConfigs.map((config) => [config.dashboardSlug, config]),
  );
  const allDashboards = baseDashboards.map((dashboard) => ({
    ...dashboard,
    embedUrl: activeWorkspaceConfigsBySlug.get(dashboard.slug)?.displayrEmbedUrl || dashboard.embedUrl,
  }));
  const dashboards = allDashboards.slice(0, 3);
  const tickets = (await getPortalTicketsForUser(access.effectiveUser)).slice(0, 3);
  const articles = getPortalArticles().slice(0, 3);
  const usage = await getPortalUsageStatus(access.effectiveUser);
  const availableDashboardCount = allDashboards.filter((dashboard) => Boolean(dashboard.embedUrl)).length;
  const assignedDashboardCount = allDashboards.length - availableDashboardCount;
  const openTicketCount = tickets.filter((ticket) => ticket.status !== "completed" && ticket.status !== "archived").length;

  if (access.effectiveRole === "support_admin") {
    const recentOperationalEvents = (
      await getPortalUsageLogsForAdmin({
        limit: 8,
      })
    )
      .filter((log) => log.eventType !== "viewer_session")
      .slice(0, 3);
    const openTickets = tickets.filter((ticket) => ticket.status === "open");
    const urgentTickets = tickets.filter((ticket) => ticket.priority === "urgent");
    const unassignedTickets = tickets.filter((ticket) => !ticket.ownerId);

    return (
      <div className="space-y-6">
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.4)]">
          <SectionHeader
            eyebrow="Overview"
            title={`Welcome back, ${access.user.name.split(" ")[0]}`}
            description="Manage support, dashboard access, and internal operations from one admin view."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Open queue</p>
              <p className="mt-2 text-3xl font-semibold text-amber-900">{openTickets.length}</p>
              <p className="mt-2 text-sm text-amber-800">Live client issues across the portal</p>
            </div>
            <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700">Urgent tickets</p>
              <p className="mt-2 text-3xl font-semibold text-rose-900">{urgentTickets.length}</p>
              <p className="mt-2 text-sm text-rose-800">Needs escalation or same-day follow-up</p>
            </div>
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Unassigned</p>
              <p className="mt-2 text-3xl font-semibold">{unassignedTickets.length}</p>
              <p className="mt-2 text-sm text-slate-300">Tickets still waiting for an owner</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Queue Snapshot"
                title="Recent ticket movement"
                description="A quick view of recent support activity."
                actions={
                  <Link
                    href="/portal/admin/support"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    View full queue
                  </Link>
                }
              />
              <div className="mt-6 space-y-3">
                {tickets.length ? (
                  tickets.map((ticket) => (
                    <Link key={ticket.id} href={`/portal/support/tickets/${ticket.id}`} className="block rounded-[24px] bg-slate-50 p-4 transition hover:bg-slate-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <TicketStatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-slate-900">{ticket.subject}</h3>
                      <div className="mt-1 flex items-center justify-between gap-3 text-sm text-slate-600">
                        <span>{ticket.dashboardName}</span>
                        <span>Updated {formatDate(ticket.updatedAt)}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                    No support tickets are active right now.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Operational Audit"
                title="Recent audit events"
                description="Recent non-session usage and embed events across the admin workspace."
                actions={
                  <Link
                    href="/portal/admin/library"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Open dashboard library
                  </Link>
                }
              />
              <div className="mt-6 space-y-3">
                {recentOperationalEvents.length ? (
                  recentOperationalEvents.map((event) => (
                    <div key={event.id} className="rounded-[24px] bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{event.dashboardName}</p>
                      <p className="mt-2 text-sm text-slate-600">
                        {event.notes || event.eventType.replaceAll("_", " ")}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">{formatDateTime(event.eventAt)}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                    No recent operational events were recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.4)]">
        <SectionHeader
          eyebrow="Workspace Overview"
          title={`Welcome back, ${access.user.name.split(" ")[0]}`}
          description={
            access.isPreviewMode
              ? "This read-only preview shows the client workspace from the selected member role."
              : `Everything for ${access.company.name} is gathered here so your team can open dashboards, follow requests, and find help quickly.`
          }
        />
        <div className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] border border-emerald-100 bg-[linear-gradient(135deg,#f0fdf4_0%,#ecfeff_100%)] px-4 py-3.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboards</span>
              </div>
              <div className="mt-2.5 flex items-end justify-between gap-3">
                <p className="text-[1.75rem] font-semibold leading-none text-slate-950">{availableDashboardCount}</p>
                <p className="text-right text-xs text-slate-600">Ready to open</p>
              </div>
              <p className="mt-2 text-xs text-emerald-800">
                {assignedDashboardCount} assigned, pending access
              </p>
            </div>
            <div className="rounded-[20px] border border-sky-100 bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] px-4 py-3.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                <LifeBuoy className="h-3.5 w-3.5" />
                <span>Open requests</span>
              </div>
              <div className="mt-2.5 flex items-end justify-between gap-3">
                <p className="text-[1.75rem] font-semibold leading-none text-slate-950">{openTicketCount}</p>
                <p className="text-right text-xs text-slate-600">In progress or waiting</p>
              </div>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                <span>Hours remaining</span>
              </div>
              <div className="mt-2.5 flex items-end justify-between gap-3">
                <p className="text-[1.75rem] font-semibold leading-none text-slate-950">
                  {usage.annualHoursLimit ? usage.hoursRemainingDisplay : "Included"}
                </p>
                <p className="text-right text-xs text-slate-600">
                  {usage.annualHoursLimit ? "This period" : "Plan access"}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Quick actions</p>
                <p className="mt-1.5 text-sm text-slate-600">Open a dashboard or jump into support.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/portal/dashboards" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                  Open dashboards
                </Link>
                {access.isPreviewMode ? (
                  <span className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">
                    Request submission disabled
                  </span>
                ) : (
                  <Link href="/portal/support/new" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                    Start support request
                  </Link>
                )}
                <Link href="/portal/support/tickets" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                  View requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <SectionHeader
              eyebrow="Dashboards"
              title="Your dashboards"
              description="Open the dashboards assigned to your workspace and keep an eye on anything that is still being configured."
              actions={
                <Link href="/portal/dashboards" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                  View all dashboards
                </Link>
              }
            />
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {dashboards.map((dashboard) => (
                <DashboardCard key={dashboard.id} dashboard={dashboard} />
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <SectionHeader
              eyebrow="Help"
              title="Popular help articles"
              description="Quick answers for login, exports, filtering, EcoReputation™ interpretation, and table downloads."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/portal/help/${article.slug}`} className="rounded-[24px] bg-slate-50 p-4 transition hover:bg-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{article.category}</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{article.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <SectionHeader
            eyebrow="Support"
            title="Recent request updates"
            description="Keep active issues, training requests, and follow-up items visible without leaving your workspace."
          />
          <div className="mt-6 space-y-4">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/portal/support/tickets/${ticket.id}`} className="block rounded-[24px] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TicketStatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{ticket.subject}</h3>
                <p className="mt-2 text-sm text-slate-600">{ticket.dashboardName}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{ticket.issueType}</span>
                  <span>Updated {formatDate(ticket.updatedAt)}</span>
                </div>
              </Link>
            ))}
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Need more help? Start in <Link href="/portal/support" className="font-semibold text-emerald-700">Support</Link>.
              <CircleHelp className="ml-2 inline h-4 w-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
