import { NextRequest, NextResponse } from "next/server";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalCompanies, getPortalSubscriptionByCompany } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type RecoveryBody = {
  companyId?: string;
  planName?: string;
  subscriptionStatus?: "active" | "trialing" | "past_due";
  billingStatus?:
    | "not_invoiced"
    | "invoice_draft"
    | "invoice_sent"
    | "payment_pending"
    | "paid"
    | "past_due"
    | "payment_failed";
  renewalDate?: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  billingContactName?: string | null;
  billingEmail?: string | null;
};

const subscriptionStatuses = new Set(["active", "trialing", "past_due"]);
const billingStatuses = new Set([
  "not_invoiced",
  "invoice_draft",
  "invoice_sent",
  "payment_pending",
  "paid",
  "past_due",
  "payment_failed",
]);

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

function normalizeNullableText(value?: string | null) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to change billing recovery fields." }, 403);
  }

  let body: RecoveryBody;
  try {
    body = (await req.json()) as RecoveryBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const companyId = String(body.companyId || "").trim();
  const planName = String(body.planName || "").trim();
  const subscriptionStatus = String(body.subscriptionStatus || "").trim();
  const billingStatus = String(body.billingStatus || "").trim();
  const renewalDate = String(body.renewalDate || "").trim();
  const isDemoSuite = planName === "Demo Suite";

  if (!companyId || !planName || !subscriptionStatus || !billingStatus || (!isDemoSuite && !renewalDate)) {
    return asJson({ error: "companyId, planName, subscriptionStatus, billingStatus, and renewalDate are required." }, 400);
  }

  if (!subscriptionStatuses.has(subscriptionStatus)) {
    return asJson({ error: "Invalid subscription status." }, 400);
  }

  if (!billingStatuses.has(billingStatus)) {
    return asJson({ error: "Invalid billing status." }, 400);
  }

  if (renewalDate && !isValidDate(renewalDate)) {
    return asJson({ error: "Renewal date must use YYYY-MM-DD format." }, 400);
  }

  const companies = await getPortalCompanies();
  const company = companies.find((item) => item.id === companyId);
  if (!company) {
    return asJson({ error: "Company not found." }, 404);
  }

  const subscription = await getPortalSubscriptionByCompany(companyId);
  if (!subscription) {
    return asJson({ error: "Subscription not found for this company." }, 404);
  }

  try {
    const admin = getServiceSupabase();
    const { error: subscriptionError } = await admin
      .from("portal_subscriptions")
      .update({
        plan_name: planName,
        status: subscriptionStatus,
        billing_status: billingStatus,
        renewal_date: renewalDate || null,
        stripe_subscription_id: normalizeNullableText(body.stripeSubscriptionId),
      })
      .eq("id", subscription.id);

    if (subscriptionError) {
      return asJson({ error: subscriptionError.message }, 500);
    }

    const { error: companyError } = await admin
      .from("portal_companies")
      .update({
        stripe_customer_id: normalizeNullableText(body.stripeCustomerId),
        billing_contact_name: normalizeNullableText(body.billingContactName),
        billing_email: normalizeNullableText(body.billingEmail),
      })
      .eq("id", companyId);

    if (companyError) {
      return asJson({ error: companyError.message }, 500);
    }

    await logPortalAdminAuditEvent({
      access,
      action: "subscription_recovery_updated",
      title: company.name,
      companyId,
      entityId: `subscription:${subscription.id}`,
      notes: `Billing recovery fields updated: ${subscriptionStatus} subscription, ${billingStatus} billing.`,
      metadata: {
        subscriptionId: subscription.id,
        subscriptionStatus,
        billingStatus,
        renewalDate: renewalDate || null,
        stripeCustomerId: normalizeNullableText(body.stripeCustomerId),
        stripeSubscriptionId: normalizeNullableText(body.stripeSubscriptionId),
      },
    });

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Subscription recovery storage unavailable.",
      },
      503,
    );
  }
}
