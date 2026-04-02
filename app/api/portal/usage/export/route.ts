import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalCompanies, getPortalTeamMembers, getPortalUsageLogsForAdmin, getPortalUsageLogsForUser, getPortalUsersByIds } from "@/lib/portal/data";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};
const USAGE_SESSION_GAP_MS = 2 * 60 * 1000;

function escapeCsv(value: string | number | null | undefined) {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function formatTrackedDuration(totalMinutes: number) {
  const roundedMinutes = Math.max(Math.round(totalMinutes), 0);
  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function formatTimeRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);

  return `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export async function GET(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NOINDEX_HEADERS });
  }

  const searchParams = req.nextUrl.searchParams;
  const exportMode = searchParams.get("mode") === "sessions" ? "sessions" : "raw";
  const selectedCompanyId = searchParams.get("company") || "";
  const selectedUserId = searchParams.get("user") || "";
  const selectedStart = searchParams.get("start") || "";
  const selectedEnd = searchParams.get("end") || "";

  const logs =
    access.user.role === "support_admin"
      ? await getPortalUsageLogsForAdmin({
          companyId: selectedCompanyId || access.company.id,
          userId: selectedUserId || undefined,
          startAt: selectedStart ? `${selectedStart}T00:00:00Z` : undefined,
          endAt: selectedEnd ? `${selectedEnd}T23:59:59Z` : undefined,
          limit: 500,
        })
      : await getPortalUsageLogsForUser(access.user);

  const companies = access.user.role === "support_admin" ? await getPortalCompanies() : [];
  const companiesById = new Map(companies.map((company) => [company.id, company.name]));
  const actorUsers =
    access.user.role === "support_admin"
      ? await getPortalUsersByIds(Array.from(new Set(logs.map((log) => log.userId))))
      : await getPortalTeamMembers(access.user);
  const teamMembersById = new Map(actorUsers.map((member) => [member.id, member]));

  const getUsageActor = (userId: string) => {
    const actor = teamMembersById.get(userId);
    if (actor) return actor.name;
    if (userId === access.user.id) return access.user.name;
    return "EcoFocus portal user";
  };

  const getUsageActorEmail = (userId: string) => {
    const actor = teamMembersById.get(userId);
    if (actor) return actor.email;
    if (userId === access.user.id) return access.user.email;
    return "";
  };

  const getUsageEventLabel = (eventType: string) => {
    if (eventType === "viewer_session") return "Dashboard session";
    if (eventType === "viewer_opened") return "Dashboard opened";
    if (eventType === "allowance_override") return "Allowance override";
    if (eventType === "support_review_requested") return "Support review";
    if (eventType === "allowance_exhausted") return "Allowance exhausted";
    return eventType.replaceAll("_", " ");
  };

  const usageLogs = logs.filter((log) => log.eventType === "viewer_session");

  const rows =
    exportMode === "sessions"
      ? [
          ["Workspace", "Dashboard", "User", "Email", "Duration", "Minutes", "Date", "Time Range", "Start", "End", "Event Rows"],
          ...Array.from(
            usageLogs
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
                  lastSession.eventRows += 1;
                } else {
                  sessions.push({
                    userId: log.userId,
                    dashboardId: log.dashboardId,
                    dashboardName: log.dashboardName,
                    workspaceCompanyId,
                    startedAt: new Date(logStartTime).toISOString(),
                    endAt: log.eventAt,
                    minutesTracked: log.minutesTracked,
                    eventRows: 1,
                  });
                }

                return sessions;
              }, [] as Array<{
                userId: string;
                dashboardId: string;
                dashboardName: string;
                workspaceCompanyId: string;
                startedAt: string;
                endAt: string;
                minutesTracked: number;
                eventRows: number;
              }>),
          )
            .sort((a, b) => new Date(b.endAt).getTime() - new Date(a.endAt).getTime())
            .map((session) => [
              companiesById.get(session.workspaceCompanyId) || session.workspaceCompanyId,
              session.dashboardName,
              getUsageActor(session.userId),
              getUsageActorEmail(session.userId),
              formatTrackedDuration(session.minutesTracked),
              session.minutesTracked,
              session.endAt.slice(0, 10),
              formatTimeRange(session.startedAt, session.endAt),
              session.startedAt,
              session.endAt,
              session.eventRows,
            ]),
        ]
      : [
          ["Workspace", "Dashboard", "User", "Email", "Notes", "Event", "Minutes", "Timestamp"],
          ...logs.map((log) => [
            companiesById.get(log.workspaceCompanyId || log.companyId) || log.workspaceCompanyId || log.companyId,
            log.dashboardName,
            getUsageActor(log.userId),
            getUsageActorEmail(log.userId),
            log.notes || "",
            getUsageEventLabel(log.eventType),
            log.minutesTracked,
            log.eventAt,
          ]),
        ];

  const csv = rows.map((row) => row.map((value) => escapeCsv(value)).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      ...NOINDEX_HEADERS,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${selectedCompanyId || access.company.id}-usage-${exportMode}.csv"`,
    },
  });
}
