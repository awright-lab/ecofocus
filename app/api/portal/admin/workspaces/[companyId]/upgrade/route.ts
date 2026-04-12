import { NextRequest, NextResponse } from "next/server";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { ensurePortalStripeCustomer } from "@/lib/portal/billing";
import { getServiceSupabase } from "@/lib/supabase/server";

const ENTERPRISE_PLAN_NAME = "Enterprise Insight Suite";
const DEMO_PLAN_NAME = "Demo Suite";
const DEFAULT_ENTERPRISE_SEATS = 12;
const DEFAULT_ENTERPRISE_ANNUAL_HOURS = 120;

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type UpgradeBody = {
  seatsPurchased?: number;
  annualHoursLimit?: number;
  createStripeCustomer?: boolean;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

function normalizePositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback;
}

function getYearFromDate(value?: string | null) {
  const match = String(value || "").match(/^(\d{4})-\d{2}-\d{2}$/);
  return match?.[1] || String(new Date().getFullYear());
}

function isStripeModeCustomerMismatch(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const stripeError = error as { code?: string; param?: string };
  return stripeError?.code === "resource_missing" && stripeError?.param === "customer" && message.includes("similar object exists");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to upgrade workspaces." }, 403);
  }

  let body: UpgradeBody;
  try {
    body = (await req.json()) as UpgradeBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const { companyId } = await params;
  const targetCompanyId = String(companyId || "").trim();
  if (!targetCompanyId) {
    return asJson({ error: "Company id is required." }, 400);
  }

  try {
    const admin = getServiceSupabase();
    const { data: company, error: companyError } = await admin
      .from("portal_companies")
      .select("id, name, subscription_id, subscriber_type, stripe_customer_id")
      .eq("id", targetCompanyId)
      .maybeSingle();

    if (companyError) return asJson({ error: companyError.message }, 500);
    if (!company) return asJson({ error: "Workspace not found." }, 404);
    if (company.subscriber_type === "internal" || company.id === access.homeCompany.id) {
      return asJson({ error: "Internal EcoFocus workspaces cannot be upgraded from this tool." }, 400);
    }

    const { data: subscription, error: subscriptionError } = await admin
      .from("portal_subscriptions")
      .select("id, plan_name, seats_purchased, seats_used, renewal_date, status, billing_status")
      .eq("id", String(company.subscription_id))
      .maybeSingle();

    if (subscriptionError) return asJson({ error: subscriptionError.message }, 500);
    if (!subscription) return asJson({ error: "Subscription record not found." }, 404);
    if (subscription.plan_name !== DEMO_PLAN_NAME) {
      return asJson({ error: `${company.name} is already on ${subscription.plan_name}.` }, 400);
    }

    const { data: allowance, error: allowanceError } = await admin
      .from("portal_usage_allowances")
      .select("annual_hours_limit, hours_used, period_start, period_end")
      .eq("company_id", targetCompanyId)
      .maybeSingle();

    if (allowanceError) return asJson({ error: allowanceError.message }, 500);

    const seatsPurchased = Math.max(
      normalizePositiveInteger(body.seatsPurchased, DEFAULT_ENTERPRISE_SEATS),
      Number(subscription.seats_used || 0),
    );
    const currentHoursUsed = Number(allowance?.hours_used || 0);
    const annualHoursLimit = Math.max(
      normalizePositiveInteger(body.annualHoursLimit, DEFAULT_ENTERPRISE_ANNUAL_HOURS),
      currentHoursUsed,
    );
    const renewalYear = getYearFromDate(subscription.renewal_date);
    const billingStatus = subscription.billing_status === "paid" ? "paid" : "not_invoiced";

    let stripeCustomerId = company.stripe_customer_id ? String(company.stripe_customer_id) : null;
    if (body.createStripeCustomer !== false) {
      try {
        stripeCustomerId = (await ensurePortalStripeCustomer(targetCompanyId)).stripeCustomerId;
      } catch (error) {
        if (isStripeModeCustomerMismatch(error)) {
          return asJson(
            {
              error:
                "The saved Stripe customer belongs to the other Stripe mode. Clear or recreate the customer from Recovery, then run the upgrade again.",
            },
            400,
          );
        }
        throw error;
      }
    }

    const subscriptionUpdate: Record<string, string | number | null> = {
      plan_name: ENTERPRISE_PLAN_NAME,
      seats_purchased: seatsPurchased,
      status: subscription.status || "active",
      billing_status: billingStatus,
    };

    if (billingStatus !== "paid") {
      subscriptionUpdate.latest_invoice_id = null;
      subscriptionUpdate.latest_invoice_status = null;
      subscriptionUpdate.latest_invoice_amount_due = null;
      subscriptionUpdate.latest_invoice_amount_paid = null;
      subscriptionUpdate.latest_invoice_currency = null;
      subscriptionUpdate.latest_invoice_due_at = null;
      subscriptionUpdate.latest_invoice_paid_at = null;
    }

    const { error: updateSubscriptionError } = await admin
      .from("portal_subscriptions")
      .update(subscriptionUpdate)
      .eq("id", String(subscription.id));

    if (updateSubscriptionError) return asJson({ error: updateSubscriptionError.message }, 500);

    const { error: allowanceUpdateError } = await admin.from("portal_usage_allowances").upsert(
      {
        company_id: targetCompanyId,
        annual_hours_limit: annualHoursLimit,
        hours_used: currentHoursUsed,
        period_start: allowance?.period_start || `${renewalYear}-01-01`,
        period_end: allowance?.period_end || `${renewalYear}-12-31`,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "company_id" },
    );

    if (allowanceUpdateError) return asJson({ error: allowanceUpdateError.message }, 500);

    await logPortalAdminAuditEvent({
      access,
      action: "workspace_upgraded_to_enterprise",
      title: company.name,
      companyId: targetCompanyId,
      entityId: `workspace-upgrade:${targetCompanyId}`,
      notes: `${company.name} upgraded from Demo Suite to Enterprise Insight Suite.`,
      metadata: {
        previousPlanName: DEMO_PLAN_NAME,
        planName: ENTERPRISE_PLAN_NAME,
        seatsPurchased,
        annualHoursLimit,
        billingStatus,
        stripeCustomerId,
      },
    });

    return asJson({
      ok: true,
      planName: ENTERPRISE_PLAN_NAME,
      seatsPurchased,
      annualHoursLimit,
      billingStatus,
      stripeCustomerId,
    });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Workspace upgrade failed.",
      },
      500,
    );
  }
}
