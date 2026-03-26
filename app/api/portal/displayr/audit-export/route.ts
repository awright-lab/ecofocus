import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalUsageLogsForAdmin, getPortalUsersByIds } from "@/lib/portal/data";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
};

function escapeCsv(value: string | number | null | undefined) {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function GET(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NOINDEX_HEADERS });
  }

  const companyId = req.nextUrl.searchParams.get("company") || "";
  const start = req.nextUrl.searchParams.get("start") || "";
  const end = req.nextUrl.searchParams.get("end") || "";

  if (!companyId) {
    return NextResponse.json({ error: "company is required." }, { status: 400, headers: NOINDEX_HEADERS });
  }

  const logs = (await getPortalUsageLogsForAdmin({
    companyId,
    startAt: start ? `${start}T00:00:00Z` : undefined,
    endAt: end ? `${end}T23:59:59Z` : undefined,
    limit: 500,
  })).filter(
    (log) =>
      log.eventType === "viewer_opened" &&
      (log.metadata?.phase === "token_issued" || log.metadata?.phase === "redirect_served"),
  );

  const users = await getPortalUsersByIds(Array.from(new Set(logs.map((log) => log.userId))));
  const usersById = new Map(users.map((user) => [user.id, user]));

  const rows = [
    ["Dashboard", "Phase", "User", "Email", "User Agent", "Config Source", "Timestamp"],
    ...logs.map((log) => {
      const actor = usersById.get(log.userId);
      return [
        log.dashboardName,
        log.metadata?.phase === "redirect_served" ? "redirect_served" : "token_issued",
        actor?.name || log.userId,
        actor?.email || "",
        typeof log.metadata?.userAgent === "string" ? log.metadata.userAgent : "",
        typeof log.metadata?.configSource === "string" ? log.metadata.configSource : "",
        log.eventAt,
      ];
    }),
  ];

  const csv = rows.map((row) => row.map((value) => escapeCsv(value)).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      ...NOINDEX_HEADERS,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${companyId}-displayr-embed-audit.csv"`,
    },
  });
}
