import { NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalUsageLogsForUser } from "@/lib/portal/data";

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
  const rows = [
    ["Dashboard", "Notes", "Event", "Minutes", "Timestamp"],
    ...logs.map((log) => [
      log.dashboardName,
      log.notes || "",
      log.eventType.replaceAll("_", " "),
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
