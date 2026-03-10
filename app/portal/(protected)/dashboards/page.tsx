import { DashboardCard } from "@/components/portal/DashboardCard";
import { EmptyState } from "@/components/portal/EmptyState";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalDashboardsForUser } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { LayoutDashboard } from "lucide-react";

export const metadata = buildPortalMetadata(
  "My Dashboards",
  "Licensed dashboard list for the private EcoFocus portal.",
);

export default async function PortalDashboardsPage() {
  const access = await requirePortalAccess("/portal/dashboards");
  const dashboards = getPortalDashboardsForUser(access.user);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="My Dashboards"
          title="Licensed dashboard access"
          description="This MVP uses mock entitlement data shaped for future company-level licensing, user-level seat grants, and dashboard embed configuration."
        />
      </section>

      {dashboards.length ? (
        <section className="grid gap-5 xl:grid-cols-2">
          {dashboards.map((dashboard) => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} />
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
