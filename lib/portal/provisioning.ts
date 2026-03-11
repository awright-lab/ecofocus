import type Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase/server";

export type PortalDashboardProvisioningInput = {
  companyId: string;
  dashboardSlug: string;
  displayrEmbedUrl: string;
  notes?: string | null;
};

export type PortalAccountProvisioningInput = {
  companyId: string;
  companyName: string;
  subscriptionId: string;
  planName: string;
  seatsPurchased: number;
  seatsUsed: number;
  renewalDate: string;
  subscriptionStatus: "active" | "trialing" | "past_due";
  adminUserId: string;
  adminName: string;
  adminEmail: string;
  adminRole: "client_admin";
};

function normalizeProvisioningValue(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDisplayrUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;

  try {
    return new URL(rawUrl).toString();
  } catch {
    return null;
  }
}

function normalizePositiveInt(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
}

function normalizeDate(value?: string | null, fallback = "2026-12-31") {
  const raw = normalizeProvisioningValue(value);
  if (!raw) return fallback;
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : fallback;
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

export async function upsertPortalDashboardConfig(input: PortalDashboardProvisioningInput) {
  const companyId = normalizeProvisioningValue(input.companyId);
  const dashboardSlug = normalizeProvisioningValue(input.dashboardSlug);
  const displayrEmbedUrl = normalizeDisplayrUrl(input.displayrEmbedUrl);

  if (!companyId || !dashboardSlug || !displayrEmbedUrl) {
    throw new Error("companyId, dashboardSlug, and a valid displayrEmbedUrl are required.");
  }

  const admin = getServiceSupabase();
  const { error } = await admin.from("portal_dashboard_configs").upsert(
    {
      company_id: companyId,
      dashboard_slug: dashboardSlug,
      displayr_embed_url: displayrEmbedUrl,
      is_active: true,
      notes: normalizeProvisioningValue(input.notes) || null,
    },
    {
      onConflict: "company_id,dashboard_slug",
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertPortalAccountRecords(input: PortalAccountProvisioningInput) {
  const admin = getServiceSupabase();

  const { error: subscriptionError } = await admin.from("portal_subscriptions").upsert(
    {
      id: input.subscriptionId,
      plan_name: input.planName,
      seats_purchased: input.seatsPurchased,
      seats_used: input.seatsUsed,
      renewal_date: input.renewalDate,
      status: input.subscriptionStatus,
    },
    { onConflict: "id" },
  );

  if (subscriptionError) throw new Error(subscriptionError.message);

  const { error: companyError } = await admin.from("portal_companies").upsert(
    {
      id: input.companyId,
      name: input.companyName,
      subscription_id: input.subscriptionId,
    },
    { onConflict: "id" },
  );

  if (companyError) throw new Error(companyError.message);

  const { error: userError } = await admin.from("portal_users").upsert(
    {
      id: input.adminUserId,
      name: input.adminName,
      email: input.adminEmail,
      company_id: input.companyId,
      role: input.adminRole,
      status: "active",
    },
    { onConflict: "id" },
  );

  if (userError) throw new Error(userError.message);
}

export function getPortalProvisioningMetadata(
  session: Pick<Stripe.Checkout.Session, "metadata" | "customer_details" | "customer_email">,
) {
  const metadata = session.metadata ?? {};
  const companyId = normalizeProvisioningValue(metadata.portalCompanyId || metadata.companyId);
  const dashboardSlug = normalizeProvisioningValue(metadata.portalDashboardSlug || metadata.dashboardSlug);
  const displayrEmbedUrl = normalizeProvisioningValue(metadata.displayrEmbedUrl || metadata.portalDisplayrEmbedUrl);
  const companyName = normalizeProvisioningValue(metadata.portalCompanyName || metadata.companyName);
  const adminEmail = normalizeProvisioningValue(
    metadata.portalAdminEmail || session.customer_email || session.customer_details?.email,
  );
  const adminName = normalizeProvisioningValue(metadata.portalAdminName || session.customer_details?.name) || "Client Admin";
  const normalizedCompanyId = companyId || (companyName ? slugifyCompanyId(companyName) : "");
  const subscriptionId = normalizeProvisioningValue(metadata.portalSubscriptionId) || (normalizedCompanyId ? buildSubscriptionId(normalizedCompanyId) : "");
  const planName = normalizeProvisioningValue(metadata.portalPlanName) || "Client Portal Access";
  const seatsPurchased = normalizePositiveInt(metadata.portalSeatsPurchased, 1);
  const seatsUsed = normalizePositiveInt(metadata.portalSeatsUsed, 1);
  const renewalDate = normalizeDate(metadata.portalRenewalDate);
  const statusValue = normalizeProvisioningValue(metadata.portalSubscriptionStatus || "active");
  const subscriptionStatus: PortalAccountProvisioningInput["subscriptionStatus"] =
    statusValue === "trialing" || statusValue === "past_due" ? statusValue : "active";
  const adminUserId = normalizeProvisioningValue(metadata.portalAdminUserId) || (adminEmail ? slugifyUserId(adminEmail) : "");

  if (!normalizedCompanyId || !dashboardSlug || !displayrEmbedUrl || !adminEmail || !subscriptionId || !adminUserId) {
    return null;
  }

  const noteParts = [
    companyName ? `Provisioned for ${companyName}.` : null,
    adminEmail ? `Client admin: ${adminEmail}.` : null,
    "Provisioned automatically from Stripe checkout metadata.",
  ].filter(Boolean);

  return {
    account: {
      companyId: normalizedCompanyId,
      companyName: companyName || normalizedCompanyId,
      subscriptionId,
      planName,
      seatsPurchased,
      seatsUsed,
      renewalDate,
      subscriptionStatus,
      adminUserId,
      adminName,
      adminEmail,
      adminRole: "client_admin" as const,
    },
    companyId: normalizedCompanyId,
    dashboardSlug,
    displayrEmbedUrl,
    notes: noteParts.join(" "),
  };
}
