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

export type PortalTeamInviteInput = {
  companyId: string;
  subscriptionId: string;
  name: string;
  email: string;
  role: "client_user" | "client_admin";
};

export type PortalTeamStatusUpdateInput = {
  userId: string;
  companyId: string;
  subscriptionId: string;
  action: "deactivate" | "reactivate";
};

export type PortalUserActivationResult =
  | { status: "missing" }
  | { status: "inactive" }
  | { status: "active"; userId: string }
  | { status: "activated"; userId: string };

type AuthUserRecord = {
  id: string;
  email?: string | null;
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

function normalizeEmail(value?: string | null) {
  return normalizeProvisioningValue(value).toLowerCase();
}

function buildSubscriptionId(companyId: string) {
  return companyId.startsWith("company-") ? `sub-${companyId.slice("company-".length)}` : `sub-${companyId}`;
}

async function findAuthUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const admin = getServiceSupabase();
  let page = 1;
  const perPage = 200;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw new Error(error.message);

    const users = data?.users || [];
    const matchedUser = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      return {
        id: matchedUser.id,
        email: matchedUser.email,
      };
    }

    if (users.length < perPage) break;
    page += 1;
  }

  return null;
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

export async function createPortalTeamInvite(input: PortalTeamInviteInput) {
  const admin = getServiceSupabase();
  const email = normalizeEmail(input.email);
  const name = normalizeProvisioningValue(input.name);

  if (!input.companyId || !input.subscriptionId || !email || !name) {
    throw new Error("companyId, subscriptionId, name, and email are required.");
  }

  const { data: existingUser, error: existingUserError } = await admin
    .from("portal_users")
    .select("id, company_id, status")
    .ilike("email", email)
    .maybeSingle();

  if (existingUserError) throw new Error(existingUserError.message);
  if (existingUser && existingUser.company_id === input.companyId && existingUser.status !== "inactive") {
    throw new Error("A portal user with this email already exists for the selected company.");
  }

  const { data: subscription, error: subscriptionError } = await admin
    .from("portal_subscriptions")
    .select("id, seats_purchased, seats_used")
    .eq("id", input.subscriptionId)
    .maybeSingle();

  if (subscriptionError) throw new Error(subscriptionError.message);
  if (!subscription) throw new Error("Subscription not found.");
  if (subscription.seats_used >= subscription.seats_purchased) {
    throw new Error("No seats are currently available for this account.");
  }

  const userId = existingUser?.id || slugifyUserId(email);

  const { error: userError } = await admin.from("portal_users").upsert(
    {
      id: userId,
      name,
      email,
      company_id: input.companyId,
      role: input.role,
      status: "invited",
    },
    { onConflict: "id" },
  );

  if (userError) throw new Error(userError.message);

  const seatsUsedIncrement = existingUser?.status === "inactive" || !existingUser ? 1 : 0;
  const { error: subscriptionUpdateError } = await admin
    .from("portal_subscriptions")
    .update({
      seats_used: subscription.seats_used + seatsUsedIncrement,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.subscriptionId);

  if (subscriptionUpdateError) throw new Error(subscriptionUpdateError.message);

  return { userId, email };
}

export async function updatePortalTeamMemberStatus(input: PortalTeamStatusUpdateInput) {
  const admin = getServiceSupabase();

  const { data: existingUser, error: userLookupError } = await admin
    .from("portal_users")
    .select("id, company_id, status")
    .eq("id", input.userId)
    .eq("company_id", input.companyId)
    .maybeSingle();

  if (userLookupError) throw new Error(userLookupError.message);
  if (!existingUser) throw new Error("Team member not found for this company.");

  const { data: subscription, error: subscriptionError } = await admin
    .from("portal_subscriptions")
    .select("id, seats_purchased, seats_used")
    .eq("id", input.subscriptionId)
    .maybeSingle();

  if (subscriptionError) throw new Error(subscriptionError.message);
  if (!subscription) throw new Error("Subscription not found.");

  if (input.action === "deactivate") {
    if (existingUser.status === "inactive") {
      return { status: "inactive" as const };
    }

    const { error: updateUserError } = await admin
      .from("portal_users")
      .update({
        status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.userId);

    if (updateUserError) throw new Error(updateUserError.message);

    const { error: updateSubscriptionError } = await admin
      .from("portal_subscriptions")
      .update({
        seats_used: Math.max(0, subscription.seats_used - 1),
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.subscriptionId);

    if (updateSubscriptionError) throw new Error(updateSubscriptionError.message);

    return { status: "inactive" as const };
  }

  if (existingUser.status !== "inactive") {
    return { status: existingUser.status as "active" | "invited" };
  }

  if (subscription.seats_used >= subscription.seats_purchased) {
    throw new Error("No seats are currently available for this account.");
  }

  const { error: updateUserError } = await admin
    .from("portal_users")
    .update({
      status: "invited",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.userId);

  if (updateUserError) throw new Error(updateUserError.message);

  const { error: updateSubscriptionError } = await admin
    .from("portal_subscriptions")
    .update({
      seats_used: subscription.seats_used + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.subscriptionId);

  if (updateSubscriptionError) throw new Error(updateSubscriptionError.message);

  return { status: "invited" as const };
}

export async function activatePortalUserByEmail(emailInput?: string | null): Promise<PortalUserActivationResult> {
  const admin = getServiceSupabase();
  const email = normalizeEmail(emailInput);

  if (!email) {
    return { status: "missing" };
  }

  const { data: existingUser, error } = await admin
    .from("portal_users")
    .select("id, status")
    .ilike("email", email)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!existingUser) {
    return { status: "missing" };
  }

  if (existingUser.status === "inactive") {
    return { status: "inactive" };
  }

  if (existingUser.status === "active") {
    return { status: "active", userId: existingUser.id };
  }

  const { error: updateError } = await admin
    .from("portal_users")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingUser.id);

  if (updateError) throw new Error(updateError.message);

  return { status: "activated", userId: existingUser.id };
}

export async function setPortalUserPassword(emailInput: string, password: string) {
  const admin = getServiceSupabase();
  const email = normalizeEmail(emailInput);

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const { data: portalUser, error: portalUserError } = await admin
    .from("portal_users")
    .select("id, name, email, company_id, role, status")
    .ilike("email", email)
    .maybeSingle();

  if (portalUserError) throw new Error(portalUserError.message);
  if (!portalUser) throw new Error("This email address is not set up for the EcoFocus portal.");
  if (portalUser.status === "inactive") {
    throw new Error("Portal access for this account is currently paused.");
  }

  const existingAuthUser = await findAuthUserByEmail(email);

  if (existingAuthUser) {
    const { error } = await admin.auth.admin.updateUserById(existingAuthUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        name: portalUser.name,
        portal_user_id: portalUser.id,
        portal_company_id: portalUser.company_id,
        portal_role: portalUser.role,
      },
    });

    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: portalUser.name,
        portal_user_id: portalUser.id,
        portal_company_id: portalUser.company_id,
        portal_role: portalUser.role,
      },
    });

    if (error) throw new Error(error.message);
  }

  const activation = await activatePortalUserByEmail(email);
  if (activation.status === "missing" || activation.status === "inactive") {
    throw new Error("Portal access could not be activated for this account.");
  }

  return {
    userId: portalUser.id,
    email,
  };
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
