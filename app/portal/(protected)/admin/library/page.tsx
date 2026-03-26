import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { DashboardLibrary } from "@/components/portal/DashboardLibrary";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { getPortalDashboardCatalog } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Internal Dashboard Library",
  "EcoFocus internal catalog of all portal dashboards routed through the protected viewer.",
);

export default async function AdminDashboardLibraryPage() {
  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/library">
      {async () => {
        const dashboards = await getPortalDashboardCatalog();

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="EcoFocus Library"
                title="All dashboards"
                description="Open any dashboard through the protected portal viewer without exposing or relying on a copied Displayr link. This internal catalog is separate from client-specific dashboard assignments."
                actions={
                  <Link href="/portal/admin/dashboards" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                    Manage dashboard access
                  </Link>
                }
              />
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Catalog size</p>
                  <p className="mt-2 text-3xl font-semibold">{dashboards.length}</p>
                </div>
                <div className="rounded-[24px] bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Access path</p>
                  <p className="mt-2 text-sm font-medium text-emerald-900">
                    Every launch stays inside `/portal/dashboards/[slug]`.
                  </p>
                </div>
                <div className="rounded-[24px] bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Internal use</p>
                  <p className="mt-2 text-sm font-medium text-sky-900">
                    Support-admin session minutes are not posted to the standard client usage tracker.
                  </p>
                </div>
              </div>
            </section>

            {dashboards.length ? (
              <DashboardLibrary dashboards={dashboards} />
            ) : (
              <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-slate-400" />
                <h2 className="mt-4 text-xl font-semibold text-slate-950">No dashboards available</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Add dashboards to the internal catalog to make them available from this workspace.
                </p>
              </div>
            )}
          </div>
        );
      }}
    </RoleGuard>
  );
}
