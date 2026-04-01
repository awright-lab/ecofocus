import Link from "next/link";
import { Clock3, CreditCard, LayoutDashboard, Users } from "lucide-react";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalDashboardsForUser, getPortalTeamMembers, getPortalUsageLogsForUser, getPortalUsageStatus } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Account and Subscription",
  "Private account and subscription summary for the EcoFocus portal.",
);

export default async function AccountPage() {
  const access = await requirePortalAccess("/portal/account");
  const dashboards = await getPortalDashboardsForUser(access.user, access.company.id);
  const teamMembers = await getPortalTeamMembers(access.user, access.company.id);
  const usage = await getPortalUsageStatus(access.user);
  const usageLogs = (await getPortalUsageLogsForUser(access.user)).slice(0, 5);
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

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Account"
          title="Account and subscription"
          description="Review your account details, company plan, seat usage, dashboard access, and recent activity in one place."
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
              <dd className="font-medium text-slate-900">{access.user.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Email</dt>
              <dd className="font-medium text-slate-900">{access.user.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Role</dt>
              <dd className="font-medium text-slate-900">{access.user.role.replace("_", " ")}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
            <CreditCard className="h-5 w-5 text-emerald-700" />
            Company and subscription
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
          <Link href="/portal/team" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
            Manage team access
          </Link>
        </div>
      </section>

      {usage.annualHoursLimit ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                <Clock3 className="h-5 w-5 text-emerald-700" />
                Company dashboard hour allowance
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {usage.hoursUsed} of {usage.annualHoursLimit} annual hours have been used across this company for embedded dashboard access.
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${usage.isLocked ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
              {usage.isLocked ? "Allowance exhausted" : `${usage.hoursRemaining} hours remaining`}
            </span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full rounded-full ${usage.isLocked ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${usage.utilizationPct}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/portal/support/new" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Request additional hours
            </Link>
            <Link href="/portal/support" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Review support options
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Accessible dashboard entitlements</h3>
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
          <h3 className="text-lg font-semibold text-slate-950">Billing management</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Use this area to keep your plan details visible and route billing-related requests to the EcoFocus team.
          </p>
          <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
            Renewal date, plan status, and seat usage shown above reflect the current account record on file for your company.
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/portal/support/new" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Contact billing support
            </Link>
            <Link href="/portal/team" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Review team access
            </Link>
          </div>
          <div className="mt-6 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{teamMembers.length}</span> team members are currently modeled for this account.
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Usage activity log</h3>
            <p className="mt-2 text-sm text-slate-600">
              Recent company-level usage events that support reviews and allowance disputes can be checked against.
            </p>
          </div>
          <Link href="/api/portal/usage/export" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Download CSV
          </Link>
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
