import Link from "next/link";
import { ArrowRight, CircleHelp, ShieldCheck } from "lucide-react";
import { DashboardCard } from "@/components/portal/DashboardCard";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import {
  getPortalArticles,
  getPortalCompanies,
  getPortalDashboardCatalog,
  getPortalDashboardsForUser,
  getPortalTicketsForUser,
  getPortalUsageLogsForAdmin,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Portal Home",
  "Private portal landing page for dashboard access, support activity, and account actions.",
);

export default async function PortalHomePage() {
  const access = await requirePortalAccess("/portal/home");
  const dashboards = (await getPortalDashboardsForUser(access.user, access.company.id)).slice(0, 3);
  const tickets = (await getPortalTicketsForUser(access.user)).slice(0, 3);
  const articles = getPortalArticles().slice(0, 3);

  if (access.user.role === "support_admin") {
    const companies = await getPortalCompanies();
    const clientCompanies = companies.filter((company) => company.id !== access.company.id);
    const dashboardCatalog = await getPortalDashboardCatalog();
    const recentOperationalEvents = (
      await getPortalUsageLogsForAdmin({
        limit: 8,
      })
    )
      .filter((log) => log.eventType !== "viewer_session")
      .slice(0, 5);
    const openTickets = tickets.filter((ticket) => ticket.status === "open");
    const urgentTickets = tickets.filter((ticket) => ticket.priority === "urgent");

    return (
      <div className="space-y-6">
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.4)]">
          <SectionHeader
            eyebrow="Overview"
            title={`Welcome back, ${access.user.name.split(" ")[0]}`}
            description="Manage support, dashboard access, and internal operations from one admin view."
            actions={
              <>
                <Link href="/portal/admin/support" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                  Open support queue
                </Link>
                <Link href="/portal/admin/dashboards" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                  Manage dashboard access
                </Link>
              </>
            }
          />
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Client companies</p>
              <p className="mt-2 text-3xl font-semibold">{clientCompanies.length}</p>
              <p className="mt-2 text-sm text-slate-300">Accounts currently in view</p>
            </div>
            <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(135deg,#f0fdf4_0%,#ecfeff_100%)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Dashboard catalog</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{dashboardCatalog.length}</p>
              <p className="mt-2 text-sm text-slate-600">Available across the admin workspace</p>
            </div>
            <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700">Urgent tickets</p>
              <p className="mt-2 text-3xl font-semibold text-rose-900">{urgentTickets.length}</p>
              <p className="mt-2 text-sm text-rose-800">Needs escalation or same-day follow-up</p>
            </div>
            <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Open queue</p>
              <p className="mt-2 text-3xl font-semibold text-amber-900">{openTickets.length}</p>
              <p className="mt-2 text-sm text-amber-800">Live client issues across the portal</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Actions"
                title="Admin tools"
                description="Jump into queue management or dashboard access controls."
              />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Link href="/portal/admin/support" className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Queue Control</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">Support queue</h3>
                    </div>
                    <LifeBuoyBadge />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Review tickets, assignments, and allowance exceptions in one place.
                  </p>
                </Link>
                <Link href="/portal/admin/dashboards" className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Config Control</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">Dashboard access</h3>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-emerald-700" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Update Displayr URLs and review dashboard access details when needed.
                  </p>
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Client Coverage"
                title="Managed companies"
                description="Open a company’s access controls from the admin workspace."
              />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {clientCompanies.slice(0, 4).map((company) => (
                  <Link
                    key={company.id}
                    href={`/portal/admin/dashboards?company=${encodeURIComponent(company.id)}`}
                    className="rounded-[24px] bg-slate-50 p-4 transition hover:bg-slate-100"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Client workspace</p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{company.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">{company.id}</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      Open access controls
                      <ArrowRight className="h-4 w-4" />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Queue Snapshot"
                title="Recent ticket movement"
                description="A quick view of recent support activity."
              />
              <div className="mt-6 space-y-4">
                {tickets.length ? (
                  tickets.map((ticket) => (
                    <Link key={ticket.id} href={`/portal/support/tickets/${ticket.id}`} className="block rounded-[24px] bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <TicketStatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-slate-900">{ticket.subject}</h3>
                      <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-600">
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

            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Operational Audit"
                title="Recent internal events"
                description="Recent non-session events across the admin workspace."
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
      <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.4)]">
        <SectionHeader
          eyebrow="Portal Home"
          title={`Welcome back, ${access.user.name.split(" ")[0]}`}
          description="Use the portal to open licensed dashboards, manage support requests, and keep account access aligned with your organization."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(135deg,#f0fdf4_0%,#ecfeff_100%)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">What you can do here</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
              Open licensed dashboards, review support activity, submit new requests, and manage account access from one private workspace.
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Quick support</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/portal/support/new" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Submit Request
              </Link>
              <Link href="/portal/support/tickets" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                View Tickets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <SectionHeader
              eyebrow="Available Dashboards"
              title="Preview licensed workspaces"
              description="Dashboard access reflects the dashboards currently assigned to your company and account."
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
              eyebrow="Helpful Resources"
              title="Recommended help content"
              description="Product-oriented guidance for login, exports, filtering, Eco IQ interpretation, and table downloads."
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
            eyebrow="Recent Support Activity"
            title="Current ticket updates"
            description="Keep active issues, training requests, and follow-up items visible without leaving the portal."
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
              Need escalation guidance? Start in the <Link href="/portal/support" className="font-semibold text-emerald-700">Support Center</Link>.
              <CircleHelp className="ml-2 inline h-4 w-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LifeBuoyBadge() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
      <ShieldCheck className="h-5 w-5" />
    </span>
  );
}
