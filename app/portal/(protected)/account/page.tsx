import Link from "next/link";
import { Clock3, CreditCard, LayoutDashboard, Users } from "lucide-react";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { listPortalInvoicesByCompany } from "@/lib/portal/billing";
import { getPortalDashboardsForUser, getPortalTeamMembers, getPortalUsageLogsForUser, getPortalUsageStatus } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Account",
  "Private account and subscription summary for the EcoFocus portal.",
);

export default async function AccountPage() {
  const access = await requirePortalAccess("/portal/account");
  const dashboards = await getPortalDashboardsForUser(access.effectiveUser, access.company.id);
  const teamMembers = await getPortalTeamMembers(access.effectiveUser, access.company.id);
  const usage = await getPortalUsageStatus(access.effectiveUser);
  const usageLogs = (await getPortalUsageLogsForUser(access.effectiveUser)).slice(0, 5);
  const invoices = await listPortalInvoicesByCompany(access.billingCompany.id, 8);
  const teamMembersById = new Map(teamMembers.map((member) => [member.id, member]));

  function getUsageActor(userId: string) {
    const actor = teamMembersById.get(userId);
    if (actor) return `${actor.name} (${actor.email})`;
    if (userId === access.user.id) return `${access.user.name} (${access.user.email})`;
    return "EcoFocus portal user";
  }

  function getUsageEventLabel(eventType: string) {
    if (eventType === "viewer_session") return "Dashboard session";
    if (eventType === "viewer_opened") return "Dashboard opened";
    if (eventType === "allowance_override") return "Allowance override";
    if (eventType === "support_review_requested") return "Support review";
    if (eventType === "allowance_exhausted") return "Allowance exhausted";
    return eventType.replaceAll("_", " ");
  }

  function formatUsdFromCents(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  }

  function getBillingStatusLabel(status?: string | null) {
    switch (status) {
      case "invoice_draft":
        return "Draft invoice";
      case "invoice_sent":
        return "Invoice sent";
      case "payment_pending":
        return "Payment pending";
      case "paid":
        return "Paid";
      case "past_due":
        return "Past due";
      case "payment_failed":
        return "Payment failed";
      default:
        return "Not invoiced";
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Account"
          title="Workspace and access"
          description={
            access.isPreviewMode
              ? "This read-only preview shows how account, seat, and usage details appear to the simulated workspace role."
              : "Review your workspace details, plan, team access, dashboard access, and recent activity in one place."
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
            <Users className="h-5 w-5 text-emerald-700" />
            User info
          </div>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between gap-4">
              <dt>Name</dt>
              <dd className="font-medium text-slate-900">{access.effectiveUser.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Email</dt>
              <dd className="font-medium text-slate-900">{access.effectiveUser.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Role</dt>
              <dd className="font-medium text-slate-900">{access.effectiveRole.replace("_", " ")}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
            <CreditCard className="h-5 w-5 text-emerald-700" />
            Workspace and subscription
          </div>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between gap-4">
              <dt>Company</dt>
              <dd className="font-medium text-slate-900">{access.company.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Plan</dt>
              <dd className="font-medium text-slate-900">{access.subscription.planName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Status</dt>
              <dd className="font-medium capitalize text-slate-900">{access.subscription.status}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Billing</dt>
              <dd className="font-medium text-slate-900">{getBillingStatusLabel(access.subscription.billingStatus)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Renewal</dt>
              <dd className="font-medium text-slate-900">{formatDate(access.subscription.renewalDate)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <LayoutDashboard className="h-5 w-5 text-emerald-300" />
            Seat usage
          </div>
          <p className="mt-4 text-4xl font-semibold">{access.subscription.seatsUsed}<span className="text-lg text-slate-400">/{access.subscription.seatsPurchased}</span></p>
          <p className="mt-2 text-sm text-slate-300">Seats used versus seats purchased across the organization.</p>
          {access.effectiveRole === "client_admin" || access.effectiveRole === "agency_admin" ? (
            <Link href="/portal/team" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
              Manage team access
            </Link>
          ) : null}
        </div>
      </section>

      {usage.annualHoursLimit ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                <Clock3 className="h-5 w-5 text-emerald-700" />
                Dashboard hour allowance
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {usage.hoursUsedDisplay} of {usage.annualHoursLimit} annual hours have been used across this workspace for embedded dashboard access.
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${usage.isLocked ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
              {usage.isLocked ? "Allowance exhausted" : `${usage.hoursRemainingDisplay} remaining`}
            </span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full rounded-full ${usage.isLocked ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${usage.utilizationPct}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {!access.isPreviewMode ? (
              <Link href="/portal/support/new" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Request additional hours
              </Link>
            ) : null}
            <Link href="/portal/support" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Contact support
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Assigned dashboards</h3>
          <div className="mt-4 space-y-3">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-900">{dashboard.name}</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {dashboard.accessTag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Billing and plan support</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Keep your plan details visible and route billing-related questions to the EcoFocus team.
          </p>
          <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
            Renewal date, plan status, seat usage, and invoice state shown above reflect the current account record on file for your company.
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {!access.isPreviewMode ? (
              <Link href="/portal/support/new" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Contact billing support
              </Link>
            ) : null}
            {!access.isPreviewMode && access.billingCompany.stripeCustomerId ? (
              <a
                href="/api/portal/billing/portal"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Open billing portal
              </a>
            ) : null}
            {access.effectiveRole === "client_admin" || access.effectiveRole === "agency_admin" ? (
              <Link href="/portal/team" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                Review team access
              </Link>
            ) : null}
          </div>
          <div className="mt-6 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{teamMembers.length}</span> team members are currently modeled for this account.
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Invoices</h3>
            <p className="mt-2 text-sm text-slate-600">
              View recent invoices for your workspace and open the hosted Stripe invoice when you need payment details.
            </p>
          </div>
          {access.billingCompany.stripeCustomerId && !access.isPreviewMode ? (
            <a
              href="/api/portal/billing/portal"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Manage billing
            </a>
          ) : null}
        </div>
        <div className="mt-5 space-y-3">
          {invoices.length ? (
            invoices.map((invoice) => (
              <div key={invoice.id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{invoice.description || invoice.number || invoice.id}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatUsdFromCents(invoice.amountDue)} · {invoice.status}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Created {formatDate(invoice.createdAt)}
                      {invoice.dueAt ? ` · Due ${formatDate(invoice.dueAt)}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                    {invoice.status === "paid"
                      ? "Paid"
                      : invoice.status === "open"
                        ? "Awaiting payment"
                        : invoice.status === "draft"
                          ? "Draft"
                          : invoice.status}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {invoice.hostedInvoiceUrl ? (
                      <a
                        href={invoice.hostedInvoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        Open invoice
                      </a>
                    ) : null}
                    {invoice.invoicePdf ? (
                      <a
                        href={invoice.invoicePdf}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        PDF
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
              No invoices are available for this workspace yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Usage activity</h3>
            <p className="mt-2 text-sm text-slate-600">
              Recent workspace-level usage events that support reviews and allowance questions can be checked against.
            </p>
          </div>
          {!access.isPreviewMode ? (
            <Link href="/api/portal/usage/export" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Download CSV
            </Link>
          ) : null}
        </div>
        <div className="mt-5 space-y-3">
          {usageLogs.map((log) => (
            <div key={log.id} className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[1.15fr_1fr_0.6fr_0.9fr] md:items-center">
              <div>
                <p className="font-semibold text-slate-900">{log.dashboardName}</p>
                <p className="mt-1 text-sm text-slate-600">{log.notes || log.eventType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{getUsageActor(log.userId)}</p>
                <p className="mt-1 text-sm text-slate-600">{getUsageEventLabel(log.eventType)}</p>
              </div>
              <div className="text-sm text-slate-700">{log.minutesTracked} min</div>
              <div className="text-sm text-slate-500">{formatDateTime(log.eventAt)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          Need a usage review? Export the log above or contact EcoFocus Support with the dates, dashboards, and activity you want reviewed.
        </div>
      </section>
    </div>
  );
}
