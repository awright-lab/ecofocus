import Link from "next/link";
import { AdminDashboardConfigForm } from "@/components/portal/AdminDashboardConfigForm";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import {
  getPortalCompanies,
  getPortalDashboardCatalog,
  getPortalDashboardConfigsByCompany,
  getPortalUsageLogsForAdmin,
  getPortalUsersByIds,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDateTime } from "@/lib/utils";

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
  const selectedStartParam = Array.isArray(params.start) ? params.start[0] : params.start;
  const selectedEndParam = Array.isArray(params.end) ? params.end[0] : params.end;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/dashboards">
      {async (access) => {
        const companies = await getPortalCompanies();
        const selectedCompanyId = selectedCompanyParam || access.company.id || companies[0]?.id || "";
        const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || null;
        const dashboardCatalog = await getPortalDashboardCatalog();
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
            isActive: config?.isActive ?? false,
            displayrEmbedUrl: config?.displayrEmbedUrl ?? "",
            notes: config?.notes ?? "",
          };
        });

        const configuredCount = companyDashboardEditorItems.filter((item) => item.isActive && item.displayrEmbedUrl).length;
        const embedAuditLogs = selectedCompanyId
          ? (await getPortalUsageLogsForAdmin({
              companyId: selectedCompanyId,
              startAt: selectedStartParam ? `${selectedStartParam}T00:00:00Z` : undefined,
              endAt: selectedEndParam ? `${selectedEndParam}T23:59:59Z` : undefined,
              limit: 100,
            })).filter(
              (log) =>
                log.eventType === "viewer_opened" &&
                (log.metadata?.phase === "token_issued" || log.metadata?.phase === "redirect_served"),
            )
          : [];
        const auditUsers = await getPortalUsersByIds(Array.from(new Set(embedAuditLogs.map((log) => log.userId))));
        const auditUsersById = new Map(auditUsers.map((user) => [user.id, user]));

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Dashboard access and URL management"
                description="Review company dashboard mappings, replace Displayr URLs, and keep public-link exposure limited to server-side portal configuration."
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
                <div className="rounded-[24px] bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Recommended practice</p>
                  <p className="mt-2 text-sm font-medium text-amber-900">Use one Displayr publish URL per company and rotate it if exposure is suspected.</p>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Companies</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Choose any company workspace, including EcoFocus, to review current dashboard assignments and replace Displayr URLs from one place.
                </p>
                <div className="mt-5 space-y-3">
                  {companies.map((company) => {
                    const isSelected = company.id === selectedCompanyId;
                    return (
                      <Link
                        key={company.id}
                        href={`/portal/admin/dashboards?company=${encodeURIComponent(company.id)}`}
                        className={`block rounded-[24px] border px-4 py-4 transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{company.name}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {company.id === access.company.id ? "EcoFocus internal workspace" : "Client workspace"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{company.id}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-950">Selected company</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {selectedCompany
                      ? `${selectedCompany.name} is currently selected for dashboard URL management.`
                      : "Choose a company from the left to manage dashboard URLs."}
                  </p>
                </div>

                {selectedCompany ? (
                  <AdminDashboardConfigForm
                    companyId={selectedCompany.id}
                    companyName={selectedCompany.name}
                    dashboards={companyDashboardEditorItems}
                    introTitle="Manage which dashboards are live for this company, replace Displayr URLs quickly, and keep public-link handling limited to this protected admin workspace."
                  />
                ) : (
                  <div className="rounded-[32px] border border-slate-200 bg-white p-6 text-sm text-slate-600">
                    No client companies are available yet.
                  </div>
                )}

                {selectedCompany ? (
                  <section className="rounded-[32px] border border-slate-200 bg-white p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">Embed audit</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Review who requested portal embed tokens and who was served redirect access for this company&apos;s Displayr dashboards.
                        </p>
                      </div>
                      <Link
                        href={`/api/portal/displayr/audit-export?company=${encodeURIComponent(selectedCompany.id)}${
                          selectedStartParam ? `&start=${encodeURIComponent(selectedStartParam)}` : ""
                        }${selectedEndParam ? `&end=${encodeURIComponent(selectedEndParam)}` : ""}`}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                      >
                        Export CSV
                      </Link>
                    </div>

                    <form method="get" className="mt-5 grid gap-4 md:grid-cols-3">
                      <input type="hidden" name="company" value={selectedCompany.id} />
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-800">Start date</span>
                        <input
                          type="date"
                          name="start"
                          defaultValue={selectedStartParam || ""}
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-800">End date</span>
                        <input
                          type="date"
                          name="end"
                          defaultValue={selectedEndParam || ""}
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </label>
                      <div className="flex items-end gap-3">
                        <button
                          type="submit"
                          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Apply dates
                        </button>
                        <Link
                          href={`/portal/admin/dashboards?company=${encodeURIComponent(selectedCompany.id)}`}
                          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                        >
                          Clear
                        </Link>
                      </div>
                    </form>

                    <div className="mt-5 space-y-3">
                      {embedAuditLogs.length ? (
                        embedAuditLogs.slice(0, 25).map((log) => {
                          const phase = log.metadata?.phase === "redirect_served" ? "Redirect served" : "Token issued";
                          const actor = auditUsersById.get(log.userId);
                          return (
                            <div key={log.id} className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[1fr_1fr_0.9fr_0.8fr] md:items-center">
                              <div>
                                <p className="font-semibold text-slate-900">{log.dashboardName}</p>
                                <p className="mt-1 text-sm text-slate-600">{phase}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{actor?.name || log.userId}</p>
                                <p className="mt-1 text-sm text-slate-600">{actor?.email || "Portal user"}</p>
                              </div>
                              <div className="text-sm text-slate-700">
                                {typeof log.metadata?.userAgent === "string" && log.metadata.userAgent
                                  ? log.metadata.userAgent
                                  : typeof log.metadata?.configSource === "string"
                                    ? `Source: ${log.metadata.configSource}`
                                    : "Portal audit event"}
                              </div>
                              <div className="text-sm text-slate-500">{formatDateTime(log.eventAt)}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                          No embed audit events are available for this company yet.
                        </div>
                      )}
                    </div>
                  </section>
                ) : null}
              </div>
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
