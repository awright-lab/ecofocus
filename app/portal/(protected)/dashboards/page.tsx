import { DashboardLibrary } from "@/components/portal/DashboardLibrary";
import { EmptyState } from "@/components/portal/EmptyState";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import {
  getPortalActiveDashboardConfigs,
  getPortalDashboardConfigsByCompany,
  getPortalDashboardsForUser,
  getPortalUsageStatus,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { LayoutDashboard } from "lucide-react";

export const metadata = buildPortalMetadata(
  "Dashboards",
  "Licensed dashboard list for the private EcoFocus portal.",
);

export default async function PortalDashboardsPage() {
  const access = await requirePortalAccess("/portal/dashboards");
  const [baseDashboards, rawConfigs, usage] = await Promise.all([
    getPortalDashboardsForUser(access.effectiveUser, access.company.id),
    access.effectiveUser.role === "support_admin" && access.company.subscriberType === "internal"
      ? getPortalActiveDashboardConfigs()
      : getPortalDashboardConfigsByCompany(access.company.id),
    getPortalUsageStatus(access.effectiveUser),
  ]);
  const activeWorkspaceConfigs =
    access.effectiveUser.role === "support_admin" && access.company.subscriberType === "internal"
      ? rawConfigs.filter((config) => !config.isHidden)
      : rawConfigs.filter((config) => config.isActive && !config.isHidden);
  const activeWorkspaceConfigsBySlug = new Map(
    activeWorkspaceConfigs.map((config) => [config.dashboardSlug, config]),
  );
  const dashboards = baseDashboards.map((dashboard) => ({
    ...dashboard,
    embedUrl: activeWorkspaceConfigsBySlug.get(dashboard.slug)?.displayrEmbedUrl || dashboard.embedUrl,
  }));
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Dashboards"
          title="Your dashboard access"
          description={
            access.isPreviewMode
              ? "This read-only preview shows the dashboards and allowance messaging a workspace member would see."
              : "Open the dashboards assigned to your workspace and keep track of shared usage for the current access period."
          }
        />
        {usage.annualHoursLimit ? (
          <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Dashboard usage allowance</p>
                <p className="mt-1 text-sm text-slate-600">
                  {usage.hoursUsedDisplay} of {usage.annualHoursLimit} hours used. {usage.hoursRemainingDisplay} remaining this period.
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
              Usage is tracked at the workspace level. If you need additional hours or believe the total is incorrect, contact EcoFocus Support for review.
            </p>
          </div>
        ) : null}
      </section>

      {dashboards.length ? (
        <DashboardLibrary dashboards={dashboards} usageLocked={usage.isLocked} />
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
