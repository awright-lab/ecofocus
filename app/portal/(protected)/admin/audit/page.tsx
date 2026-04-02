import Link from "next/link";
import { AdminAuditActivity } from "@/components/portal/AdminAuditActivity";
import { AdminAuditFilters } from "@/components/portal/AdminAuditFilters";
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

const USAGE_SESSION_GAP_MS = 2 * 60 * 1000;

function formatTrackedDuration(totalMinutes: number) {
  const roundedMinutes = Math.max(Math.round(totalMinutes), 0);
  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function formatTimeRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);

  return `${start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function formatAdminActionLabel(action?: unknown) {
  const normalized = typeof action === "string" ? action : "admin_action";
  return normalized.replaceAll("_", " ");
}

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
        const adminActionLogs = allAuditLogs.filter((log) => log.eventType === "admin_action");
        const groupedUsageSessions = Array.from(
          usageAuditLogs
            .slice()
            .sort((a, b) => new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime())
            .reduce((sessions, log) => {
              const lastSession = sessions.at(-1);
              const logTime = new Date(log.eventAt).getTime();
              const logStartTime = logTime - log.minutesTracked * 60_000;
              const workspaceCompanyId = log.workspaceCompanyId || log.companyId;
              const sameSurface =
                lastSession &&
                lastSession.userId === log.userId &&
                lastSession.dashboardId === log.dashboardId &&
                lastSession.workspaceCompanyId === workspaceCompanyId;
              const closeEnough =
                lastSession && logStartTime - new Date(lastSession.endAt).getTime() <= USAGE_SESSION_GAP_MS;

              if (sameSurface && closeEnough) {
                lastSession.endAt = log.eventAt;
                lastSession.minutesTracked += log.minutesTracked;
                lastSession.logIds.push(log.id);
              } else {
                sessions.push({
                  id: `session-${log.id}`,
                  logIds: [log.id],
                  userId: log.userId,
                  dashboardId: log.dashboardId,
                  dashboardName: log.dashboardName,
                  workspaceCompanyId,
                  startedAt: new Date(logStartTime).toISOString(),
                  endAt: log.eventAt,
                  minutesTracked: log.minutesTracked,
                });
              }

              return sessions;
            }, [] as Array<{
              id: string;
              logIds: string[];
              userId: string;
              dashboardId: string;
              dashboardName: string;
              workspaceCompanyId: string;
              startedAt: string;
              endAt: string;
              minutesTracked: number;
            }>),
        ).sort((a, b) => new Date(b.endAt).getTime() - new Date(a.endAt).getTime());
        const totalTrackedMinutes = usageAuditLogs.reduce((sum, log) => sum + log.minutesTracked, 0);
        const totalTrackedDuration = formatTrackedDuration(totalTrackedMinutes);
        const uniqueUsageActors = new Set(usageAuditLogs.map((log) => log.userId)).size;
        const averageSessionMinutes = groupedUsageSessions.length
          ? Math.round(totalTrackedMinutes / groupedUsageSessions.length)
          : 0;
        const longestSessionMinutes = groupedUsageSessions.length
          ? Math.max(...groupedUsageSessions.map((session) => session.minutesTracked))
          : 0;
        const topDashboard = Array.from(
          usageAuditLogs.reduce((map, log) => {
            map.set(log.dashboardName, (map.get(log.dashboardName) || 0) + log.minutesTracked);
            return map;
          }, new Map<string, number>()),
        ).sort((a, b) => b[1] - a[1])[0];
        const topUser = Array.from(
          usageAuditLogs.reduce((map, log) => {
            map.set(log.userId, (map.get(log.userId) || 0) + log.minutesTracked);
            return map;
          }, new Map<string, number>()),
        )
          .sort((a, b) => b[1] - a[1])
          .map(([userId, minutes]) => ({
            name: auditUsersById.get(userId)?.name || userId,
            minutes,
          }))[0];
        const usageExportQuery = new URLSearchParams();
        usageExportQuery.set("company", selectedCompanyId);
        if (selectedUserParam) usageExportQuery.set("user", selectedUserParam);
        if (selectedStartParam) usageExportQuery.set("start", selectedStartParam);
        if (selectedEndParam) usageExportQuery.set("end", selectedEndParam);
        const rawUsageExportHref = `/api/portal/usage/export?mode=raw&${usageExportQuery.toString()}`;
        const sessionUsageExportHref = `/api/portal/usage/export?mode=sessions&${usageExportQuery.toString()}`;
        const embedExportHref = `/api/portal/displayr/audit-export?company=${encodeURIComponent(selectedCompanyId)}${
          selectedStartParam ? `&start=${encodeURIComponent(selectedStartParam)}` : ""
        }${selectedEndParam ? `&end=${encodeURIComponent(selectedEndParam)}` : ""}`;

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
        const supportOperations = adminActionLogs
          .map((log) => {
            const actor = auditUsersById.get(log.userId);
            return {
              id: log.id,
              title: log.dashboardName,
              subtitle: formatAdminActionLabel(log.metadata?.action),
              metaPrimary: actor?.name || log.userId,
              metaSecondary: formatDateTime(log.eventAt),
            };
          })
          .slice(0, 6);

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Audit"
                title="Embed and usage audit"
                description="Review dashboard token issuance, redirect activity, and tracked usage across the selected workspace from one audit view."
                actions={
                  <Link
                    href={`/portal/admin/usage${selectedCompanyId ? `?company=${encodeURIComponent(selectedCompanyId)}` : ""}`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Open usage controls
                  </Link>
                }
              />
              <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Tracked usage</p>
                  <p className="mt-2 text-3xl font-semibold">{totalTrackedDuration}</p>
                  <p className="mt-2 text-sm text-slate-300">Tracked time in the filtered window</p>
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
                <div className="rounded-[24px] bg-violet-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">Avg. session</p>
                  <p className="mt-2 text-3xl font-semibold text-violet-950">{formatTrackedDuration(averageSessionMinutes)}</p>
                  <p className="mt-2 text-sm text-violet-900/80">Average grouped session length</p>
                </div>
                <div className="rounded-[24px] bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Top dashboard</p>
                  <p className="mt-2 text-lg font-semibold text-amber-950">{topDashboard?.[0] || "No usage yet"}</p>
                  <p className="mt-2 text-sm text-amber-900/80">
                    {topDashboard ? formatTrackedDuration(topDashboard[1]) : "Waiting for tracked sessions"}
                  </p>
                </div>
                <div className="rounded-[24px] bg-rose-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">Top user</p>
                  <p className="mt-2 text-lg font-semibold text-rose-950">{topUser?.name || "No usage yet"}</p>
                  <p className="mt-2 text-sm text-rose-900/80">
                    {topUser ? formatTrackedDuration(topUser.minutes) : "Waiting for tracked sessions"}
                  </p>
                </div>
                <div className="rounded-[24px] bg-slate-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Admin actions</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{adminActionLogs.length}</p>
                  <p className="mt-2 text-sm text-slate-700">Catalog, access, ticket, and billing changes</p>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <AdminAuditFilters
                companies={companies.map((company) => ({ id: company.id, name: company.name }))}
                selectedCompanyId={selectedCompanyId}
                selectedUserId={selectedUserParam || ""}
                selectedStart={selectedStartParam || ""}
                selectedEnd={selectedEndParam || ""}
                users={selectedCompanyUsers.map((member) => ({ id: member.id, name: member.name }))}
              />
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
                        <p className="text-sm font-semibold text-slate-900">{formatTrackedDuration(point.hours * 60)}</p>
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

            <AdminAuditActivity
              embedExportHref={embedExportHref}
              embedLogs={embedAuditLogs.map((log) => {
                const phase = log.metadata?.phase === "redirect_served" ? "Redirect served" : "Token issued";
                const actor = auditUsersById.get(log.userId);
                return {
                  id: log.id,
                  title: log.dashboardName,
                  subtitle: phase,
                  metaPrimary: actor?.name || log.userId,
                  metaSecondary: formatDateTime(log.eventAt),
                };
              })}
              rawUsageExportHref={rawUsageExportHref}
              sessionExportHref={sessionUsageExportHref}
              usageSessions={groupedUsageSessions.map((session) => {
                const actor = auditUsersById.get(session.userId);
                return {
                  id: session.id,
                  title: session.dashboardName,
                  subtitle: actor?.name || session.userId,
                  metaPrimary: formatDate(session.endAt),
                  metaSecondary: formatTimeRange(session.startedAt, session.endAt),
                  value: formatTrackedDuration(session.minutesTracked),
                };
              })}
            />

            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Support operations</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Recent support-side ticket activity for the filtered workspace, including new tickets, replies, and internal notes.
                  </p>
                </div>
                <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  Longest session {formatTrackedDuration(longestSessionMinutes)}
                </p>
              </div>
              <div className="mt-5 grid gap-3 xl:grid-cols-2">
                {supportOperations.length ? (
                  supportOperations.map((event) => (
                    <div key={event.id} className="rounded-[24px] bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{event.title}</p>
                        <p className="text-sm font-medium text-slate-700">{event.subtitle}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{event.metaPrimary}</p>
                      <p className="mt-1 text-xs text-slate-500">{event.metaSecondary}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600 xl:col-span-2">
                    No recent support operations match this workspace and date range yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
