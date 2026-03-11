import type Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase/server";

export type PortalDashboardProvisioningInput = {
  companyId: string;
  dashboardSlug: string;
  displayrEmbedUrl: string;
  notes?: string | null;
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

  if (!companyId || !dashboardSlug || !displayrEmbedUrl) {
    return null;
  }

  const noteParts = [
    companyName ? `Provisioned for ${companyName}.` : null,
    adminEmail ? `Client admin: ${adminEmail}.` : null,
    "Provisioned automatically from Stripe checkout metadata.",
    "TODO: wire full company/user/subscription creation into this workflow.",
  ].filter(Boolean);

  return {
    companyId,
    dashboardSlug,
    displayrEmbedUrl,
    notes: noteParts.join(" "),
  };
}
