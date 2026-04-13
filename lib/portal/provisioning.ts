import type Stripe from "stripe";
import { createHash, randomBytes } from "crypto";
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
  subscriberType?: "brand" | "agency" | "internal";
  logoUrl?: string | null;
  billingContactName?: string | null;
  billingEmail?: string | null;
  stripeCustomerId?: string | null;
  subscriptionId: string;
  planName: string;
  seatsPurchased: number;
  seatsUsed: number;
  renewalDate: string | null;
  subscriptionStatus: "active" | "trialing" | "past_due";
  stripeSubscriptionId?: string | null;
  adminUserId: string;
  adminName: string;
  adminEmail: string;
  adminRole: "client_admin" | "agency_admin";
};

export type PortalTeamInviteInput = {
  companyId: string;
  subscriptionId: string;
  name: string;
  email: string;
  role: "client_user" | "client_admin" | "agency_user" | "agency_admin";
};

export type PortalTeamStatusUpdateInput = {
  userId: string;
  companyId: string;
  subscriptionId: string;
  action: "deactivate" | "reactivate" | "remove";
};

export type PortalUsageAllowanceProvisioningInput = {
  companyId: string;
  annualHoursLimit: number;
  hoursUsed?: number;
  periodStart?: string | null;
  periodEnd?: string | null;
};

export type PortalDashboardEntitlementProvisioningInput = {
  companyId: string;
  dashboardIds: string[];
  assignedByUserId?: string | null;
};

export type PortalUserActivationResult =
  | { status: "missing" }
  | { status: "inactive" }
  | { status: "active"; userId: string }
  | { status: "activated"; userId: string };

export type PortalPasswordSetupTokenInput = {
  email: string;
  userId: string;
  createdByUserId?: string | null;
  expiresInHours?: number;
};

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

function normalizeOptionalUrl(rawUrl?: string | null) {
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

function normalizeOptionalDate(value?: string | null) {
  const raw = normalizeProvisioningValue(value);
  if (!raw) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}

function normalizeIsoDateTime(value?: string | null) {
  const raw = normalizeProvisioningValue(value);
  if (!raw) return new Date().toISOString();

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
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

function hashPortalSetupToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeSubscriberType(value?: string | null) {
  return value === "agency" || value === "internal" ? value : "brand";
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
  const subscriberType = normalizeSubscriberType(input.subscriberType);

  const { error: subscriptionError } = await admin.from("portal_subscriptions").upsert(
    {
      id: input.subscriptionId,
      plan_name: input.planName,
      seats_purchased: input.seatsPurchased,
      seats_used: input.seatsUsed,
      renewal_date: normalizeOptionalDate(input.renewalDate),
      status: input.subscriptionStatus,
      stripe_subscription_id: normalizeProvisioningValue(input.stripeSubscriptionId) || null,
    },
    { onConflict: "id" },
  );

  if (subscriptionError) throw new Error(subscriptionError.message);

  const { error: companyError } = await admin.from("portal_companies").upsert(
    {
      id: input.companyId,
      name: input.companyName,
      subscription_id: input.subscriptionId,
      subscriber_type: subscriberType,
      logo_url: normalizeOptionalUrl(input.logoUrl),
      billing_contact_name: normalizeProvisioningValue(input.billingContactName) || null,
      billing_email: normalizeEmail(input.billingEmail) || null,
      stripe_customer_id: normalizeProvisioningValue(input.stripeCustomerId) || null,
      allow_external_collaborators: subscriberType === "internal",
      external_access_policy: subscriberType === "internal" ? "support_admin_only" : null,
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
      home_company_id: input.companyId,
      role: input.adminRole,
      status: "active",
    },
    { onConflict: "id" },
  );

  if (userError) throw new Error(userError.message);

  const membershipRole = input.adminRole === "agency_admin" ? "workspace_admin" : "workspace_admin";
  const { error: membershipError } = await admin.from("portal_workspace_memberships").upsert(
    {
      workspace_company_id: input.companyId,
      user_id: input.adminUserId,
      membership_role: membershipRole,
      visibility_scope: "full",
    },
    { onConflict: "workspace_company_id,user_id" },
  );

  if (membershipError) throw new Error(membershipError.message);
}

export async function upsertPortalUsageAllowance(input: PortalUsageAllowanceProvisioningInput) {
  const admin = getServiceSupabase();
  const { error } = await admin.from("portal_usage_allowances").upsert(
    {
      company_id: input.companyId,
      annual_hours_limit: normalizePositiveInt(input.annualHoursLimit, 0),
      hours_used: normalizePositiveInt(input.hoursUsed ?? 0, 0),
      period_start: normalizeOptionalDate(input.periodStart),
      period_end: normalizeOptionalDate(input.periodEnd),
    },
    { onConflict: "company_id" },
  );

  if (error) throw new Error(error.message);
}

export async function replacePortalDashboardEntitlements(input: PortalDashboardEntitlementProvisioningInput) {
  const admin = getServiceSupabase();
  const companyId = normalizeProvisioningValue(input.companyId);
  const dashboardIds = Array.from(
    new Set(input.dashboardIds.map((dashboardId) => normalizeProvisioningValue(dashboardId)).filter(Boolean)),
  );

  if (!companyId) {
    throw new Error("companyId is required.");
  }

  const { error: deleteError } = await admin
    .from("portal_dashboard_entitlements")
    .delete()
    .eq("company_id", companyId)
    .not("dashboard_id", "in", `(${dashboardIds.map((id) => `"${id}"`).join(",") || '""'})`);

  if (deleteError) throw new Error(deleteError.message);

  if (!dashboardIds.length) {
    return;
  }

  const assignedAt = normalizeIsoDateTime();
  const { error: upsertError } = await admin.from("portal_dashboard_entitlements").upsert(
    dashboardIds.map((dashboardId) => ({
      company_id: companyId,
      dashboard_id: dashboardId,
      assigned_at: assignedAt,
      assigned_by_user_id: normalizeProvisioningValue(input.assignedByUserId) || null,
    })),
    { onConflict: "company_id,dashboard_id" },
  );

  if (upsertError) throw new Error(upsertError.message);
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
    .select("id, company_id, home_company_id, status")
    .ilike("email", email)
    .maybeSingle();

  if (existingUserError) throw new Error(existingUserError.message);
  const existingHomeCompanyId = existingUser?.home_company_id || existingUser?.company_id || null;
  const isCrossAccount = Boolean(existingUser && existingHomeCompanyId && existingHomeCompanyId !== input.companyId);
  if (existingUser && existingUser.company_id === input.companyId && existingUser.status !== "inactive") {
    throw new Error("A portal user with this email already exists for the selected company.");
  }

  const { data: subscription, error: subscriptionError } = await admin
    .from("portal_subscriptions")
    .select("id, seats_purchased, seats_used")
    .eq("id", input.subscriptionId)
    .maybeSingle();

  const userId = existingUser?.id || slugifyUserId(email);
  const { data: existingMembership, error: membershipLookupError } = await admin
    .from("portal_workspace_memberships")
    .select("id")
    .eq("workspace_company_id", input.companyId)
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipLookupError) throw new Error(membershipLookupError.message);

  if (subscriptionError) throw new Error(subscriptionError.message);
  if (!subscription) throw new Error("Subscription not found.");
  if (subscription.seats_used >= subscription.seats_purchased && !existingMembership) {
    throw new Error("No seats are currently available for this account.");
  }

  if (!existingUser || !isCrossAccount) {
    const { error: userError } = await admin.from("portal_users").upsert(
      {
        id: userId,
        name,
        email,
        company_id: input.companyId,
        home_company_id: input.companyId,
        role: input.role,
        status: "invited",
      },
      { onConflict: "id" },
    );

    if (userError) throw new Error(userError.message);
  }

  const { error: membershipError } = await admin.from("portal_workspace_memberships").upsert(
    {
      workspace_company_id: input.companyId,
      user_id: userId,
      membership_role: input.role === "client_admin" || input.role === "agency_admin" ? "workspace_admin" : "workspace_member",
      visibility_scope: "full",
    },
    { onConflict: "workspace_company_id,user_id" },
  );

  if (membershipError) throw new Error(membershipError.message);

  const seatsUsedIncrement = existingMembership ? 0 : 1;
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

  if (input.action === "remove") {
    if (existingUser.status !== "inactive") {
      throw new Error("Deactivate this teammate before removing them from the list.");
    }

    const { error: deleteMembershipError } = await admin
      .from("portal_workspace_memberships")
      .delete()
      .eq("workspace_company_id", input.companyId)
      .eq("user_id", input.userId);

    if (deleteMembershipError) throw new Error(deleteMembershipError.message);

    const { error: deleteUserError } = await admin
      .from("portal_users")
      .delete()
      .eq("id", input.userId)
      .eq("company_id", input.companyId);

    if (deleteUserError) throw new Error(deleteUserError.message);

    return { status: "removed" as const };
  }

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

export async function createPortalPasswordSetupToken(input: PortalPasswordSetupTokenInput) {
  const admin = getServiceSupabase();
  const email = normalizeEmail(input.email);
  const userId = normalizeProvisioningValue(input.userId);
  const createdByUserId = normalizeProvisioningValue(input.createdByUserId) || null;
  const expiresInHours = Number.isFinite(input.expiresInHours) ? Number(input.expiresInHours) : 168;
  const expiresAt = new Date(Date.now() + Math.max(expiresInHours, 1) * 60 * 60 * 1000).toISOString();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashPortalSetupToken(token);
  const now = new Date().toISOString();

  if (!email || !userId) {
    throw new Error("Email and user id are required to create a password setup token.");
  }

  const { error: expirePreviousError } = await admin
    .from("portal_password_setup_tokens")
    .update({
      consumed_at: now,
    })
    .eq("email", email)
    .eq("user_id", userId)
    .is("consumed_at", null);

  if (expirePreviousError) throw new Error(expirePreviousError.message);

  const { error: insertError } = await admin.from("portal_password_setup_tokens").insert({
    user_id: userId,
    email,
    token_hash: tokenHash,
    created_by_user_id: createdByUserId,
    expires_at: expiresAt,
  });

  if (insertError) throw new Error(insertError.message);

  return {
    token,
    expiresAt,
  };
}

async function validatePortalPasswordSetupToken({
  email,
  token,
  userId,
}: {
  email: string;
  token: string;
  userId: string;
}) {
  const admin = getServiceSupabase();
  const normalizedEmail = normalizeEmail(email);
  const normalizedToken = normalizeProvisioningValue(token);
  const normalizedUserId = normalizeProvisioningValue(userId);

  if (!normalizedEmail || !normalizedToken || !normalizedUserId) {
    throw new Error("This password setup link is missing its secure token.");
  }

  const { data: setupToken, error: tokenError } = await admin
    .from("portal_password_setup_tokens")
    .select("id, user_id, email, expires_at, consumed_at")
    .eq("token_hash", hashPortalSetupToken(normalizedToken))
    .maybeSingle();

  if (tokenError) throw new Error(tokenError.message);
  if (!setupToken) throw new Error("This password setup link is invalid or has expired.");
  if (String(setupToken.email).toLowerCase() !== normalizedEmail || String(setupToken.user_id) !== normalizedUserId) {
    throw new Error("This password setup link does not match the requested portal account.");
  }
  if (setupToken.consumed_at) {
    throw new Error("This password setup link has already been used. Ask EcoFocus for a new setup email.");
  }

  const expiresAt = new Date(String(setupToken.expires_at));
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
    throw new Error("This password setup link has expired. Ask EcoFocus for a new setup email.");
  }

  return String(setupToken.id);
}

async function consumePortalPasswordSetupToken(tokenId: string) {
  const admin = getServiceSupabase();
  const { data, error: consumeError } = await admin
    .from("portal_password_setup_tokens")
    .update({
      consumed_at: new Date().toISOString(),
    })
    .eq("id", tokenId)
    .is("consumed_at", null)
    .select("id")
    .maybeSingle();

  if (consumeError) throw new Error(consumeError.message);
  if (!data) throw new Error("This password setup link has already been used. Ask EcoFocus for a new setup email.");
}

export async function setPortalUserPassword(emailInput: string, password: string, setupTokenInput?: string | null) {
  const admin = getServiceSupabase();
  const email = normalizeEmail(emailInput);
  const setupToken = normalizeProvisioningValue(setupTokenInput);

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (!setupToken) {
    throw new Error("Use the secure password setup link from your EcoFocus access email.");
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

  const setupTokenId = await validatePortalPasswordSetupToken({
    email,
    token: setupToken,
    userId: portalUser.id,
  });

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

  await consumePortalPasswordSetupToken(setupTokenId);

  return {
    userId: portalUser.id,
    email,
  };
}

export async function setPortalUserPasswordFromReset(emailInput: string, password: string) {
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
  session: Pick<Stripe.Checkout.Session, "metadata" | "customer" | "customer_details" | "customer_email" | "subscription">,
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
  const stripeCustomerId = normalizeProvisioningValue(
    metadata.portalStripeCustomerId || (typeof session.customer === "string" ? session.customer : session.customer?.id),
  );
  const stripeSubscriptionId = normalizeProvisioningValue(
    metadata.portalStripeSubscriptionId ||
      (typeof session.subscription === "string" ? session.subscription : session.subscription?.id),
  );
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
      billingContactName: normalizeProvisioningValue(metadata.portalBillingContactName) || adminName,
      billingEmail: normalizeEmail(metadata.portalBillingEmail) || adminEmail,
      stripeCustomerId: stripeCustomerId || null,
      stripeSubscriptionId: stripeSubscriptionId || null,
      adminRole: "client_admin" as const,
    },
    companyId: normalizedCompanyId,
    dashboardSlug,
    displayrEmbedUrl,
    notes: noteParts.join(" "),
  };
}
