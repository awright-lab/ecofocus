import { NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalTeamMembers, getPortalUsageLogsForUser } from "@/lib/portal/data";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function escapeCsv(value: string | number | null | undefined) {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function GET() {
  const access = await getPortalAccessContext();
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NOINDEX_HEADERS });
  }

  const logs = await getPortalUsageLogsForUser(access.user);
  const teamMembers = await getPortalTeamMembers(access.user);
  const teamMembersById = new Map(teamMembers.map((member) => [member.id, member]));

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

  const rows = [
    ["Dashboard", "User", "Email", "Notes", "Event", "Minutes", "Timestamp"],
    ...logs.map((log) => [
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
      "Content-Disposition": `attachment; filename="${access.company.id}-usage-log.csv"`,
    },
  });
}
