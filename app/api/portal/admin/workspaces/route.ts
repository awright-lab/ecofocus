import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { ensurePortalStripeCustomer } from "@/lib/portal/billing";
import { getPortalDashboardCatalog } from "@/lib/portal/data";
import { getPortalOrigin } from "@/lib/portal/host";
import {
  replacePortalDashboardEntitlements,
  upsertPortalAccountRecords,
  upsertPortalUsageAllowance,
} from "@/lib/portal/provisioning";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

function normalizeText(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value?: string | null) {
  return normalizeText(value).toLowerCase();
}

function slugifyCompanyId(companyName: string) {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `company-${slug}` : "company-client";
}

function slugifyUserId(email: string) {
  const localPart = email.split("@")[0] || "client-admin";
  const slug = localPart.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `user-${slug || "client-admin"}`;
}

function buildSubscriptionId(companyId: string) {
  return companyId.startsWith("company-") ? `sub-${companyId.slice("company-".length)}` : `sub-${companyId}`;
}

type WorkspaceProvisioningBody = {
  companyName?: string;
  subscriberType?: "brand" | "agency" | "internal";
  logoUrl?: string;
  billingContactName?: string;
  billingEmail?: string;
  adminName?: string;
  adminEmail?: string;
  planName?: string;
  seatsPurchased?: number;
  renewalDate?: string;
  annualHoursLimit?: number;
  periodStart?: string;
  periodEnd?: string;
  dashboardIds?: string[];
  createStripeCustomer?: boolean;
};

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to create workspaces." }, 403);
  }

  let body: WorkspaceProvisioningBody;
  try {
    body = (await req.json()) as WorkspaceProvisioningBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const companyName = normalizeText(body.companyName);
  const billingEmail = normalizeEmail(body.billingEmail || body.adminEmail);
  const adminEmail = normalizeEmail(body.adminEmail);
  const adminName = normalizeText(body.adminName);
  const planName = normalizeText(body.planName) || "Enterprise Insight Suite";
  const billingContactName = normalizeText(body.billingContactName || body.adminName);
  const seatsPurchased = Number(body.seatsPurchased);
  const annualHoursLimit = Number(body.annualHoursLimit);
  const renewalDate = normalizeText(body.renewalDate);
  const dashboardIds = Array.isArray(body.dashboardIds)
    ? body.dashboardIds.map((dashboardId) => normalizeText(dashboardId)).filter(Boolean)
    : [];
  const subscriberType =
    body.subscriberType === "agency" || body.subscriberType === "internal" ? body.subscriberType : "brand";

  if (!companyName || !billingEmail || !adminEmail || !adminName || !renewalDate) {
    return asJson({ error: "Company, billing contact, admin contact, and renewal date are required." }, 400);
  }

  if (!Number.isFinite(seatsPurchased) || seatsPurchased < 1) {
    return asJson({ error: "Seats purchased must be at least 1." }, 400);
  }

  if (!Number.isFinite(annualHoursLimit) || annualHoursLimit < 0) {
    return asJson({ error: "Annual hours must be zero or greater." }, 400);
  }

  const dashboardCatalog = await getPortalDashboardCatalog();
  const validDashboardIds = new Set(dashboardCatalog.map((dashboard) => dashboard.id));
  const invalidDashboardIds = dashboardIds.filter((dashboardId) => !validDashboardIds.has(dashboardId));
  if (invalidDashboardIds.length) {
    return asJson({ error: "One or more selected dashboards are invalid." }, 400);
  }

  const companyId = slugifyCompanyId(companyName);
  const subscriptionId = buildSubscriptionId(companyId);
  const adminUserId = slugifyUserId(adminEmail);
  const adminRole = subscriberType === "agency" ? "agency_admin" : "client_admin";

  let stripeCustomerId: string | null = null;

  try {
    await upsertPortalAccountRecords({
      companyId,
      companyName,
      subscriberType,
      logoUrl: normalizeText(body.logoUrl) || null,
      billingContactName,
      billingEmail,
      subscriptionId,
      planName,
      seatsPurchased,
      seatsUsed: 1,
      renewalDate,
      subscriptionStatus: "active",
      adminUserId,
      adminName,
      adminEmail,
      adminRole,
    });

    await upsertPortalUsageAllowance({
      companyId,
      annualHoursLimit,
      hoursUsed: 0,
      periodStart: normalizeText(body.periodStart) || `${renewalDate.slice(0, 4)}-01-01`,
      periodEnd: normalizeText(body.periodEnd) || `${renewalDate.slice(0, 4)}-12-31`,
    });

    await replacePortalDashboardEntitlements({
      companyId,
      dashboardIds,
      assignedByUserId: access.user.id,
    });

    if (body.createStripeCustomer !== false && billingEmail) {
      stripeCustomerId = (await ensurePortalStripeCustomer(companyId)).stripeCustomerId;
    }

    await logPortalAdminAuditEvent({
      access,
      action: "workspace_provisioned",
      title: companyName,
      companyId,
      entityId: `workspace:${companyId}`,
      notes: `Workspace provisioned with ${dashboardIds.length} assigned dashboards and ${seatsPurchased} purchased seats.`,
      metadata: {
        subscriptionId,
        subscriberType,
        annualHoursLimit,
        seatsPurchased,
        stripeCustomerId,
      },
    });

    const clientAdminSetupUrl = new URL("/set-password", getPortalOrigin(req.url));
    clientAdminSetupUrl.searchParams.set("email", adminEmail);
    clientAdminSetupUrl.searchParams.set("invite", "1");

    return asJson({
      ok: true,
      companyId,
      subscriptionId,
      stripeCustomerId,
      clientAdminSetupUrl: clientAdminSetupUrl.toString(),
    });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Workspace provisioning failed.",
      },
      500,
    );
  }
}
