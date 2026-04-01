import Link from "next/link";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import {
  getPortalCompanies,
  getPortalTeamMembersByCompany,
  getPortalUsageLogsForAdmin,
  getPortalUsersByIds,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Portal Audit",
  "Internal audit view for embed and usage activity across the EcoFocus portal.",
);

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;
  const selectedUserParam = Array.isArray(params.user) ? params.user[0] : params.user;
  const selectedStartParam = Array.isArray(params.start) ? params.start[0] : params.start;
  const selectedEndParam = Array.isArray(params.end) ? params.end[0] : params.end;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/audit">
      {async (access) => {
        const companies = await getPortalCompanies();
        const selectedCompanyId = selectedCompanyParam || access.company.id || companies[0]?.id || "";
        const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || null;
        const selectedCompanyUsers = selectedCompanyId ? await getPortalTeamMembersByCompany(selectedCompanyId) : [];

        const allAuditLogs = await getPortalUsageLogsForAdmin({
          companyId: selectedCompanyId || undefined,
          userId: selectedUserParam || undefined,
          startAt: selectedStartParam ? `${selectedStartParam}T00:00:00Z` : undefined,
          endAt: selectedEndParam ? `${selectedEndParam}T23:59:59Z` : undefined,
          limit: 200,
        });
        const auditUsers = await getPortalUsersByIds(Array.from(new Set(allAuditLogs.map((log) => log.userId))));
        const auditUsersById = new Map(auditUsers.map((user) => [user.id, user]));

        const embedAuditLogs = allAuditLogs.filter(
          (log) =>
            log.eventType === "viewer_opened" &&
            (log.metadata?.phase === "token_issued" || log.metadata?.phase === "redirect_served"),
        );
        const usageAuditLogs = allAuditLogs.filter((log) => log.eventType === "viewer_session");
        const totalTrackedHours = Number(
          (usageAuditLogs.reduce((sum, log) => sum + log.minutesTracked, 0) / 60).toFixed(1),
        );
        const uniqueUsageActors = new Set(usageAuditLogs.map((log) => log.userId)).size;

        const usageByDate = Array.from(
          usageAuditLogs.reduce((map, log) => {
            const date = log.eventAt.slice(0, 10);
            map.set(date, (map.get(date) || 0) + log.minutesTracked);
            return map;
          }, new Map<string, number>()),
        )
          .map(([date, minutes]) => ({
            date,
            hours: Number((minutes / 60).toFixed(1)),
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7);
        const maxUsageHours = Math.max(...usageByDate.map((point) => point.hours), 1);

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Audit"
                title="Embed and usage audit"
                description="Review dashboard token issuance, redirect activity, and tracked usage across the selected workspace from one audit view."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Tracked usage</p>
                  <p className="mt-2 text-3xl font-semibold">{totalTrackedHours}</p>
                  <p className="mt-2 text-sm text-slate-300">Hours in the filtered window</p>
                </div>
                <div className="rounded-[24px] bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Embed events</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-900">{embedAuditLogs.length}</p>
                  <p className="mt-2 text-sm text-emerald-800">Token or redirect events recorded</p>
                </div>
                <div className="rounded-[24px] bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Active users</p>
                  <p className="mt-2 text-3xl font-semibold text-sky-900">{uniqueUsageActors}</p>
                  <p className="mt-2 text-sm text-sky-800">Unique users in tracked sessions</p>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <form method="get" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Workspace</span>
                  <select
                    name="company"
                    defaultValue={selectedCompanyId}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">User</span>
                  <select
                    name="user"
                    defaultValue={selectedUserParam || ""}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">All users</option>
                    {selectedCompanyUsers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
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
                    Apply filters
                  </button>
                  <Link
                    href="/portal/admin/audit"
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Clear
                  </Link>
                </div>
              </form>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Usage trend</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A quick visual of tracked dashboard session hours across the filtered time window.
                  </p>
                </div>
                <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {selectedCompany?.name || "All workspaces"}
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-7">
                {usageByDate.length ? (
                  usageByDate.map((point) => (
                    <div key={point.date} className="flex flex-col gap-3 rounded-[24px] bg-slate-50 p-4">
                      <div className="flex h-40 items-end">
                        <div
                          className="w-full rounded-t-[18px] bg-emerald-500"
                          style={{ height: `${Math.max((point.hours / maxUsageHours) * 100, 8)}%` }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{point.hours}h</p>
                        <p className="mt-1 text-xs text-slate-500">{formatDate(point.date)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600 md:col-span-7">
                    No tracked usage sessions match this filter yet.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">Embed audit</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Review token issuance and redirect events for the selected workspace.
                    </p>
                  </div>
                  <Link
                    href={`/api/portal/displayr/audit-export?company=${encodeURIComponent(selectedCompanyId)}${
                      selectedStartParam ? `&start=${encodeURIComponent(selectedStartParam)}` : ""
                    }${selectedEndParam ? `&end=${encodeURIComponent(selectedEndParam)}` : ""}`}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Export embed CSV
                  </Link>
                </div>

                <div className="mt-5 space-y-3">
                  {embedAuditLogs.length ? (
                    embedAuditLogs.slice(0, 25).map((log) => {
                      const phase = log.metadata?.phase === "redirect_served" ? "Redirect served" : "Token issued";
                      const actor = auditUsersById.get(log.userId);
                      return (
                        <div key={log.id} className="rounded-[24px] bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">{log.dashboardName}</p>
                          <p className="mt-1 text-sm text-slate-600">{phase}</p>
                          <p className="mt-2 text-sm text-slate-700">{actor?.name || log.userId}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatDateTime(log.eventAt)}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                      No embed audit events are available for this filter yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">Usage audit</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Inspect tracked dashboard sessions and the users responsible for them.
                    </p>
                  </div>
                  <Link
                    href="/api/portal/usage/export"
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Export usage CSV
                  </Link>
                </div>

                <div className="mt-5 space-y-3">
                  {usageAuditLogs.length ? (
                    usageAuditLogs.slice(0, 25).map((log) => {
                      const actor = auditUsersById.get(log.userId);
                      return (
                        <div key={log.id} className="rounded-[24px] bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-slate-900">{log.dashboardName}</p>
                            <p className="text-sm font-medium text-slate-700">{Number((log.minutesTracked / 60).toFixed(1))}h</p>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{actor?.name || log.userId}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatDateTime(log.eventAt)}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                      No tracked usage sessions are available for this filter yet.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
