import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import {
  getPortalDashboardsForUser,
  getPortalUsageAllowanceByCompany,
  getPortalUsageLogsForAdmin,
  getPortalTeamMembersByCompany,
} from "@/lib/portal/data";
import { sendPortalUsageLimitWarningEmail } from "@/lib/portal/email";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { PortalUsageLogEvent } from "@/lib/portal/types";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};
const USAGE_WARNING_THRESHOLD = 85;

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
  if (access.isPreviewMode) {
    return asJson({ ok: true, persisted: false, preview: true, message: "Preview sessions do not create usage events." });
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

  const allowedDashboard = (await getPortalDashboardsForUser(access.effectiveUser, access.company.id)).find((dashboard) => dashboard.id === dashboardId);
  if (!allowedDashboard) {
    return asJson({ error: "Dashboard not available for this user." }, 403);
  }

  const payload = {
    user_id: access.user.id,
    company_id: access.billingCompany.id,
    workspace_company_id: access.company.id,
    billing_company_id: access.billingCompany.id,
    user_home_company_id: access.homeCompany.id,
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

    try {
      const allowance = await getPortalUsageAllowanceByCompany(access.billingCompany.id);
      if (allowance && allowance.annualHoursLimit > 0) {
        const hasAllowanceWindow = Boolean(allowance.periodStart && allowance.periodEnd);
        const loggedUsage = await getPortalUsageLogsForAdmin({
          companyId: access.billingCompany.id,
          ...(hasAllowanceWindow
            ? {
                startAt: `${allowance.periodStart}T00:00:00Z`,
                endAt: `${allowance.periodEnd}T23:59:59Z`,
              }
            : {}),
          limit: 500,
        });
        const loggedMinutes = loggedUsage.reduce((total, log) => total + log.minutesTracked, 0);
        const hoursUsed = Number(((allowance.hoursUsed * 60 + loggedMinutes) / 60).toFixed(1));
        const utilizationPct = Math.min(
          100,
          Math.round((hoursUsed / Math.max(allowance.annualHoursLimit, 1)) * 100),
        );

        if (utilizationPct >= USAGE_WARNING_THRESHOLD) {
          const warningLogs = await getPortalUsageLogsForAdmin({
            companyId: access.billingCompany.id,
            dashboardId: `usage-limit-warning:${access.billingCompany.id}`,
            ...(hasAllowanceWindow
              ? {
                  startAt: `${allowance.periodStart}T00:00:00Z`,
                  endAt: `${allowance.periodEnd}T23:59:59Z`,
                }
              : {}),
            limit: 1,
          });

          if (!warningLogs.length) {
            const teamMembers = await getPortalTeamMembersByCompany(access.billingCompany.id);
            const adminRecipients = teamMembers
              .filter(
                (member) =>
                  (member.role === "client_admin" || member.role === "agency_admin") &&
                  member.status === "active",
              )
              .map((member) => member.email);

            if (adminRecipients.length) {
              const hoursRemaining = Math.max(allowance.annualHoursLimit - hoursUsed, 0);
              const periodLabel =
                allowance.periodStart && allowance.periodEnd
                  ? `${allowance.periodStart} to ${allowance.periodEnd}`
                  : null;

              await sendPortalUsageLimitWarningEmail({
                to: adminRecipients,
                companyName: access.billingCompany.name,
                hoursRemainingDisplay: `${hoursRemaining} hours`,
                annualHoursLimit: allowance.annualHoursLimit,
                utilizationPct,
                periodLabel,
              });

              await admin.from("portal_usage_logs").insert({
                user_id: access.user.id,
                company_id: access.billingCompany.id,
                workspace_company_id: access.company.id,
                billing_company_id: access.billingCompany.id,
                user_home_company_id: access.homeCompany.id,
                dashboard_id: `usage-limit-warning:${access.billingCompany.id}`,
                dashboard_name: "Usage limit warning",
                event_type: "allowance_warning",
                event_at: new Date().toISOString(),
                minutes_tracked: 0,
                source: "portal_runtime",
                notes: "Automated usage warning sent to client admins.",
                metadata: {
                  utilizationPct,
                  annualHoursLimit: allowance.annualHoursLimit,
                },
              });
            }
          }
        }
      }
    } catch (warningError) {
      console.warn("[api/portal/usage] Usage warning email failed.", {
        error: warningError instanceof Error ? warningError.message : String(warningError),
      });
    }

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
