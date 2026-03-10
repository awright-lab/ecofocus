import Link from "next/link";
import { ArrowRight, BookOpen, CircleHelp, CreditCard, LayoutDashboard, LifeBuoy, ReceiptText } from "lucide-react";
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

const quickActions = [
  { href: "/portal/dashboards", label: "View Dashboards", icon: LayoutDashboard },
  { href: "/portal/support/new", label: "Submit Support Request", icon: LifeBuoy },
  { href: "/portal/support/tickets", label: "View My Tickets", icon: ReceiptText },
  { href: "/portal/help", label: "Browse Help Articles", icon: BookOpen },
  { href: "/portal/account", label: "Account & Subscription", icon: CreditCard },
];

export default async function PortalHomePage() {
  const access = await requirePortalAccess("/portal/home");
  const dashboards = getPortalDashboardsForUser(access.user).slice(0, 3);
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
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{action.label}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
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
                <div key={article.id} className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{article.category}</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{article.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                </div>
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
