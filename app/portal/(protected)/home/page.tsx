import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { DashboardCard } from "@/components/portal/DashboardCard";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalArticles, getPortalDashboardsForUser, getPortalTicketsForUser } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Portal Home",
  "Private portal landing page for dashboard access, support activity, and account actions.",
);

export default async function PortalHomePage() {
  const access = await requirePortalAccess("/portal/home");
  const dashboards = (await getPortalDashboardsForUser(access.user)).slice(0, 3);
  const tickets = getPortalTicketsForUser(access.user).slice(0, 3);
  const articles = getPortalArticles().slice(0, 3);

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
              description="Dashboard access is driven by company and user entitlements so seat licensing and project-level permissions can be wired in later."
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
