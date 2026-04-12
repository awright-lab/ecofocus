import { AdminDashboardManagementCard } from "@/components/portal/AdminDashboardManagementCard";
import { AdminWorkspacePicker } from "@/components/portal/AdminWorkspacePicker";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import {
  getPortalCompanies,
  getPortalDashboardCatalog,
  isPortalDashboardCatalogStorageReady,
  getPortalActiveDashboardConfigs,
  getPortalDashboardConfigsByCompany,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Dashboard Access Admin",
  "Internal dashboard access management for company-specific Displayr URLs.",
);

export default async function AdminDashboardsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/dashboards">
      {async (access) => {
        const companies = await getPortalCompanies();
        const selectedCompanyId = selectedCompanyParam || access.company.id || companies[0]?.id || "";
        const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || null;
        const dashboardCatalog = await getPortalDashboardCatalog();
        const isCatalogStorageReady = await isPortalDashboardCatalogStorageReady();
        const activeDashboardConfigs = await getPortalActiveDashboardConfigs();
        const activeConfigsBySlug = new Map(
          activeDashboardConfigs.map((config) => [config.dashboardSlug, config]),
        );
        const selectedCompanyDashboardConfigs = selectedCompanyId
          ? await getPortalDashboardConfigsByCompany(selectedCompanyId)
          : [];

        const companyDashboardEditorItems = dashboardCatalog.map((dashboard) => {
          const config = selectedCompanyDashboardConfigs.find((item) => item.dashboardSlug === dashboard.slug);
          return {
            slug: dashboard.slug,
            name: dashboard.name,
            description: dashboard.description,
            accessTag: dashboard.accessTag,
            embedAccess: dashboard.embedAccess,
            availableToAll: dashboard.availableToAll ?? false,
            isActive: config?.isActive ?? false,
            displayrEmbedUrl:
              config?.displayrEmbedUrl ??
              (dashboard.availableToAll ? activeConfigsBySlug.get(dashboard.slug)?.displayrEmbedUrl ?? "" : ""),
            notes: config?.notes ?? "",
          };
        });
        const visibleDashboardEditorItems =
          selectedCompany?.subscriberType === "internal"
            ? companyDashboardEditorItems
            : companyDashboardEditorItems.filter((item) => item.availableToAll || (item.isActive && item.displayrEmbedUrl));

        const configuredCount = companyDashboardEditorItems.filter((item) => item.isActive && item.displayrEmbedUrl).length;
        const workspaceOptions = companies.map((company) => ({
          id: company.id,
          name: company.name,
          subtitle: company.id === access.company.id ? "EcoFocus internal workspace" : "Client workspace",
        }));

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Dashboard access and catalog management"
                description="Search workspaces, manage company-specific Displayr URLs, and keep the shared dashboard catalog organized without relying on a tiny static company list."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Managed companies</p>
                  <p className="mt-2 text-3xl font-semibold">{companies.length}</p>
                </div>
                <div className="rounded-[24px] bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Configured for selected company</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-900">{configuredCount}</p>
                </div>
                <div className="rounded-[24px] bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Catalog size</p>
                  <p className="mt-2 text-3xl font-semibold text-sky-900">{dashboardCatalog.length}</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <AdminWorkspacePicker
                companies={workspaceOptions}
                selectedCompanyId={selectedCompanyId}
              />
              {selectedCompany ? (
                <AdminDashboardManagementCard
                  companyId={selectedCompany.id}
                  companyName={selectedCompany.name}
                  companies={companies.map((company) => ({
                    id: company.id,
                    name: company.name,
                  }))}
                  dashboards={visibleDashboardEditorItems}
                  storageReady={isCatalogStorageReady}
                />
              ) : (
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 text-sm text-slate-600">
                  No client companies are available yet.
                </div>
              )}
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
