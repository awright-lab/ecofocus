import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { DashboardLibrary } from "@/components/portal/DashboardLibrary";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import {
  getPortalCompanies,
  getPortalDashboardCatalog,
  getPortalDashboardConfigsByCompany,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Internal Dashboard Library",
  "EcoFocus internal catalog of all portal dashboards routed through the protected viewer.",
);

export default async function AdminDashboardLibraryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/library">
      {async (access) => {
        const companies = await getPortalCompanies();
        const selectedCompany = selectedCompanyParam
          ? companies.find((company) => company.id === selectedCompanyParam) || null
          : null;
        const dashboardCatalog = await getPortalDashboardCatalog();
        const availabilityCompanyId = selectedCompany?.id || access.company.id;
        const availabilityConfigs = (await getPortalDashboardConfigsByCompany(availabilityCompanyId)).filter(
          (config) => config.isActive,
        );
        const availabilityConfigsBySlug = new Map(
          availabilityConfigs.map((config) => [config.dashboardSlug, config]),
        );
        const configuredDashboardSlugs = new Set(availabilityConfigsBySlug.keys());
        const dashboards = selectedCompany
          ? dashboardCatalog
              .filter((dashboard) => configuredDashboardSlugs.has(dashboard.slug))
              .map((dashboard) => ({
                ...dashboard,
                embedUrl: availabilityConfigsBySlug.get(dashboard.slug)?.displayrEmbedUrl || dashboard.embedUrl,
              }))
          : dashboardCatalog.map((dashboard) => ({
              ...dashboard,
              embedUrl: availabilityConfigsBySlug.get(dashboard.slug)?.displayrEmbedUrl || dashboard.embedUrl,
            }));

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="EcoFocus Library"
                title="All dashboards"
                description="Open any dashboard through the protected portal viewer without exposing or relying on a copied Displayr link. Filter by company to inspect the dashboards currently configured for that workspace, including EcoFocus internal variants."
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
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Current scope</p>
                  <p className="mt-2 text-sm font-medium text-emerald-900">
                    {selectedCompany ? `${selectedCompany.name} assigned dashboards` : "Full internal dashboard catalog"}
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

            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Filter by company</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Choose a company to view only the dashboards currently configured for that workspace. Leave this set to all dashboards to browse the full portal catalog.
                  </p>
                </div>
                <form method="get" className="flex flex-wrap items-end gap-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-800">Company</span>
                    <select
                      name="company"
                      defaultValue={selectedCompany?.id || ""}
                      className="min-w-[240px] rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">All dashboards</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                          {company.id === access.company.id ? " (EcoFocus internal)" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Apply filter
                  </button>
                  <Link
                    href="/portal/admin/library"
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Clear
                  </Link>
                </form>
              </div>
            </section>

            {dashboards.length ? (
              <DashboardLibrary dashboards={dashboards} companyId={selectedCompany?.id || access.company.id} />
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
