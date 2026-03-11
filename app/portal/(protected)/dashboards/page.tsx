import { DashboardCard } from "@/components/portal/DashboardCard";
import { EmptyState } from "@/components/portal/EmptyState";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalDashboardsForUser, getPortalUsageStatus } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { LayoutDashboard } from "lucide-react";

export const metadata = buildPortalMetadata(
  "My Dashboards",
  "Licensed dashboard list for the private EcoFocus portal.",
);

export default async function PortalDashboardsPage() {
  const access = await requirePortalAccess("/portal/dashboards");
  const dashboards = await getPortalDashboardsForUser(access.user);
  const usage = await getPortalUsageStatus(access.user);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="My Dashboards"
          title="Licensed dashboard access"
          description="This MVP uses mock entitlement data shaped for future company-level licensing, user-level seat grants, and dashboard embed configuration."
        />
        {usage.annualHoursLimit ? (
          <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Annual dashboard usage allowance</p>
                <p className="mt-1 text-sm text-slate-600">
                  {usage.hoursUsed} of {usage.annualHoursLimit} hours used. {usage.hoursRemaining} hours remaining this period.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${usage.isLocked ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                {usage.isLocked ? "Access paused" : `${usage.utilizationPct}% used`}
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full ${usage.isLocked ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${usage.utilizationPct}%` }} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              TODO: replace mock allowance tracking with persisted EcoFocus usage logs, purchasable resets, and support review workflows.
            </p>
          </div>
        ) : null}
      </section>

      {dashboards.length ? (
        <section className="grid gap-5 xl:grid-cols-2">
          {dashboards.map((dashboard) => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} usageLocked={usage.isLocked} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={LayoutDashboard}
          title="No dashboards assigned"
          description="Assign a company entitlement or seat-based dashboard grant to populate this view."
        />
      )}
    </div>
  );
}
