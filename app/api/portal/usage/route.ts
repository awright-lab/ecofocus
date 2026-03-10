import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalDashboardsForUser } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { PortalUsageLogEvent } from "@/lib/portal/types";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type UsageBody = {
  dashboardId?: string;
  dashboardName?: string;
  eventType?: PortalUsageLogEvent;
  minutesTracked?: number;
  notes?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: UsageBody;
  try {
    body = (await req.json()) as UsageBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const dashboardId = String(body.dashboardId || "").trim();
  const eventType = body.eventType;
  const minutesTracked = Number(body.minutesTracked || 0);

  if (!dashboardId || !eventType) {
    return asJson({ error: "dashboardId and eventType are required." }, 400);
  }

  const allowedDashboard = getPortalDashboardsForUser(access.user).find((dashboard) => dashboard.id === dashboardId);
  if (!allowedDashboard) {
    return asJson({ error: "Dashboard not available for this user." }, 403);
  }

  const payload = {
    user_id: access.user.id,
    company_id: access.company.id,
    dashboard_id: allowedDashboard.id,
    dashboard_name: allowedDashboard.name,
    event_type: eventType,
    event_at: new Date().toISOString(),
    minutes_tracked: Number.isFinite(minutesTracked) ? minutesTracked : 0,
    source: "portal_runtime",
    notes: typeof body.notes === "string" ? body.notes : null,
  };

  try {
    const admin = getServiceSupabase();
    await admin.from("portal_usage_logs").insert(payload);
    return asJson({ ok: true, persisted: true });
  } catch (error) {
    console.warn("[api/portal/usage] Usage log persistence not configured.", {
      error: error instanceof Error ? error.message : String(error),
      payload,
    });
    return asJson({
      ok: true,
      persisted: false,
      message: "Usage log accepted but not persisted. Configure portal_usage_logs storage next.",
    });
  }
}
