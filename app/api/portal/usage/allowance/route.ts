import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalCompanies } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type AllowanceBody = {
  companyId?: string;
  annualHoursLimit?: number;
  hoursUsed?: number;
  periodStart?: string;
  periodEnd?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to change allowance data." }, 403);
  }

  let body: AllowanceBody;
  try {
    body = (await req.json()) as AllowanceBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const companyId = String(body.companyId || "").trim();
  const annualHoursLimit = Number(body.annualHoursLimit);
  const hoursUsed = Number(body.hoursUsed);
  const periodStart = String(body.periodStart || "").trim();
  const periodEnd = String(body.periodEnd || "").trim();

  if (!companyId || !Number.isFinite(annualHoursLimit) || !Number.isFinite(hoursUsed) || !periodStart || !periodEnd) {
    return asJson({ error: "companyId, annualHoursLimit, hoursUsed, periodStart, and periodEnd are required." }, 400);
  }

  const companies = await getPortalCompanies();
  if (!companies.find((company) => company.id === companyId)) {
    return asJson({ error: "Company not found." }, 404);
  }

  try {
    const admin = getServiceSupabase();
    const { error } = await admin.from("portal_usage_allowances").upsert({
      company_id: companyId,
      annual_hours_limit: annualHoursLimit,
      hours_used: hoursUsed,
      period_start: periodStart,
      period_end: periodEnd,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    await logPortalAdminAuditEvent({
      access,
      action: "usage_allowance_updated",
      title: companies.find((company) => company.id === companyId)?.name || companyId,
      companyId,
      entityId: `allowance:${companyId}`,
      notes: `Usage allowance updated to ${annualHoursLimit} hours with ${hoursUsed} hours tracked.`,
      metadata: {
        annualHoursLimit,
        hoursUsed,
        periodStart,
        periodEnd,
      },
    });

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Allowance storage unavailable.",
      },
      503,
    );
  }
}
