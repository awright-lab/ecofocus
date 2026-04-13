import {
  portalCompanies,
  portalDashboardEntitlements,
  portalDashboards,
  portalHelpArticles,
  portalSubscriptions,
  portalTeamMembers,
  portalTeamInvites,
  portalTicketMessages,
  portalTickets,
  portalUsageAllowances,
  portalUsageLogs,
  portalUsers,
} from "@/lib/portal/mock-data";
import { getPortalDevUsageOverrideFromCookies } from "@/lib/portal/dev-auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import type {
  PortalCompany,
  PortalDashboard,
  PortalDashboardConfig,
  PortalHelpArticle,
  PortalRole,
  PortalSubscriberType,
  PortalSubscription,
  PortalTeamInvite,
  PortalTicket,
  PortalTicketMessage,
  PortalTeamMember,
  PortalUsageAllocation,
  PortalUsageAllowance,
  PortalUsageLogFilters,
  PortalUsageLog,
  PortalUser,
  PortalWorkspaceMembership,
  PortalWorkspaceMembershipRole,
  PortalWorkspaceVisibilityScope,
} from "@/lib/portal/types";

const roleRank: Record<PortalRole, number> = {
  client_user: 1,
  agency_user: 1,
  external_collaborator: 1,
  client_admin: 2,
  agency_admin: 2,
  support_admin: 3,
};

export function normalizePortalRole(input?: string | null): PortalRole {
  if (
    input === "support_admin" ||
    input === "client_admin" ||
    input === "client_user" ||
    input === "agency_admin" ||
    input === "agency_user" ||
    input === "external_collaborator"
  ) {
    return input;
  }
  return "client_user";
}

function normalizePortalTicketStatus(input?: string | null): PortalTicket["status"] {
  if (
    input === "open" ||
    input === "in_progress" ||
    input === "waiting_on_client" ||
    input === "completed" ||
    input === "archived"
  ) {
    return input;
  }

  if (input === "resolved") {
    return "completed";
  }

  return "open";
}

export function normalizePortalSubscriberType(input?: string | null): PortalSubscriberType {
  if (input === "agency" || input === "brand" || input === "internal") {
    return input;
  }
  return "brand";
}

function normalizePortalBillingStatus(
  input?: string | null,
): NonNullable<PortalSubscription["billingStatus"]> {
  if (
    input === "invoice_draft" ||
    input === "invoice_sent" ||
    input === "payment_pending" ||
    input === "paid" ||
    input === "past_due" ||
    input === "payment_failed"
  ) {
    return input;
  }

  return "not_invoiced";
}

export function normalizeWorkspaceMembershipRole(input?: string | null): PortalWorkspaceMembershipRole {
  if (
    input === "workspace_member" ||
    input === "workspace_admin" ||
    input === "external_collaborator" ||
    input === "support_admin"
  ) {
    return input;
  }
  return "workspace_member";
}

export function normalizeWorkspaceVisibilityScope(input?: string | null): PortalWorkspaceVisibilityScope {
  return input === "limited" ? "limited" : "full";
}

export function hasRequiredRole(userRole: PortalRole, requiredRole: PortalRole) {
  return roleRank[userRole] >= roleRank[requiredRole];
}

export function isPortalWorkspaceManager(role: PortalRole) {
  return role === "client_admin" || role === "agency_admin" || role === "support_admin";
}

function formatPortalUsageDuration(totalMinutes: number) {
  const normalizedMinutes = Math.max(Math.round(totalMinutes), 0);
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${hours}h ${minutes}m`;
}

const PORTAL_TICKET_AUTO_ARCHIVE_AFTER_REVIEW_MS = 24 * 60 * 60 * 1000;
const PORTAL_TICKET_AUTO_ARCHIVE_AFTER_COMPLETION_MS = 7 * 24 * 60 * 60 * 1000;

export function getPortalTicketAutoArchiveAt(ticket: PortalTicket) {
  if (ticket.status !== "completed" || !ticket.completedAt) return null;

  const reviewedAtMs = ticket.clientReviewedCompletedAt ? new Date(ticket.clientReviewedCompletedAt).getTime() : null;
  const completedAtMs = new Date(ticket.completedAt).getTime();
  if (reviewedAtMs) {
    return new Date(reviewedAtMs + PORTAL_TICKET_AUTO_ARCHIVE_AFTER_REVIEW_MS).toISOString();
  }

  return new Date(completedAtMs + PORTAL_TICKET_AUTO_ARCHIVE_AFTER_COMPLETION_MS).toISOString();
}

function isPortalTicketReadyForAutoArchive(ticket: PortalTicket) {
  const autoArchiveAt = getPortalTicketAutoArchiveAt(ticket);
  return Boolean(autoArchiveAt && Date.now() >= new Date(autoArchiveAt).getTime());
}

async function syncPortalAutoArchivedTickets(tickets: PortalTicket[]) {
  const eligibleTickets = tickets.filter((ticket) => isPortalTicketReadyForAutoArchive(ticket));
  if (!eligibleTickets.length) return tickets;

  const now = new Date().toISOString();

  try {
    const admin = getServiceSupabase();
    const { error } = await admin
      .from("portal_tickets")
      .update({
        status: "archived",
        updated_at: now,
      })
      .in(
        "id",
        eligibleTickets.map((ticket) => ticket.id),
      );

    if (error) {
      console.warn("[portal/data] automatic ticket archival failed.", { error: error.message });
      return tickets;
    }

    const archivedIds = new Set(eligibleTickets.map((ticket) => ticket.id));
    return tickets.map((ticket) =>
      archivedIds.has(ticket.id)
        ? {
            ...ticket,
            status: "archived" as const,
            updatedAt: now,
          }
        : ticket,
    );
  } catch (error) {
    console.warn("[portal/data] automatic ticket archival storage unavailable.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return tickets;
  }
}

async function queryPortalUserByEmail(email?: string | null): Promise<PortalUser | null> {
  if (!email) return null;

  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_users")
      .select("*")
      .ilike("email", email)
      .maybeSingle();

    if (error) {
      console.warn("[portal/data] portal_users lookup failed.", { email, error: error.message });
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      companyId: data.company_id,
      homeCompanyId: data.home_company_id || data.company_id,
      role: normalizePortalRole(data.role),
      status: data.status,
    };
  } catch (error) {
    console.warn("[portal/data] portal_users storage unavailable.", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalCompanyById(companyId: string): Promise<PortalCompany | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_companies")
      .select("*")
      .eq("id", companyId)
      .maybeSingle();

    if (error) {
      console.warn("[portal/data] portal_companies lookup failed.", { companyId, error: error.message });
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      subscriptionId: data.subscription_id,
      subscriberType: normalizePortalSubscriberType(data.subscriber_type),
      logoUrl: data.logo_url || null,
      billingContactName: data.billing_contact_name || null,
      billingEmail: data.billing_email || null,
      stripeCustomerId: data.stripe_customer_id || null,
      allowExternalCollaborators: Boolean(data.allow_external_collaborators),
      externalAccessPolicy: data.external_access_policy || null,
    };
  } catch (error) {
    console.warn("[portal/data] portal_companies storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalCompanies(): Promise<PortalCompany[] | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.warn("[portal/data] portal_companies list lookup failed.", { error: error.message });
      return null;
    }

    return (data || []).map((company) => ({
      id: company.id,
      name: company.name,
      subscriptionId: company.subscription_id,
      subscriberType: normalizePortalSubscriberType(company.subscriber_type),
      logoUrl: company.logo_url || null,
      billingContactName: company.billing_contact_name || null,
      billingEmail: company.billing_email || null,
      stripeCustomerId: company.stripe_customer_id || null,
      allowExternalCollaborators: Boolean(company.allow_external_collaborators),
      externalAccessPolicy: company.external_access_policy || null,
    }));
  } catch (error) {
    console.warn("[portal/data] portal_companies list storage unavailable.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryWorkspaceMembershipsByUser(userId: string): Promise<PortalWorkspaceMembership[] | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_workspace_memberships")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("[portal/data] portal_workspace_memberships lookup failed.", { userId, error: error.message });
      return null;
    }

    return (data || []).map((membership) => ({
      id: String(membership.id),
      userId: String(membership.user_id),
      workspaceCompanyId: String(membership.workspace_company_id),
      membershipRole: normalizeWorkspaceMembershipRole(membership.membership_role),
      visibilityScope: normalizeWorkspaceVisibilityScope(membership.visibility_scope),
      createdAt: String(membership.created_at),
      updatedAt: String(membership.updated_at),
    }));
  } catch (error) {
    console.warn("[portal/data] portal_workspace_memberships storage unavailable.", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalSubscriptionById(subscriptionId: string): Promise<PortalSubscription | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_subscriptions")
      .select(
        "id, plan_name, seats_purchased, seats_used, renewal_date, status, stripe_subscription_id, billing_status, latest_invoice_id, latest_invoice_status, latest_invoice_amount_due, latest_invoice_amount_paid, latest_invoice_currency, latest_invoice_due_at, latest_invoice_paid_at",
      )
      .eq("id", subscriptionId)
      .maybeSingle();

    if (error) {
      console.warn("[portal/data] portal_subscriptions lookup failed.", { subscriptionId, error: error.message });
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      planName: data.plan_name,
      seatsPurchased: data.seats_purchased,
      seatsUsed: data.seats_used,
      renewalDate: data.renewal_date ? String(data.renewal_date) : null,
      status: data.status,
      stripeSubscriptionId: data.stripe_subscription_id || null,
      billingStatus: normalizePortalBillingStatus(data.billing_status),
      latestInvoiceId: data.latest_invoice_id || null,
      latestInvoiceStatus: data.latest_invoice_status || null,
      latestInvoiceAmountDue: data.latest_invoice_amount_due ?? null,
      latestInvoiceAmountPaid: data.latest_invoice_amount_paid ?? null,
      latestInvoiceCurrency: data.latest_invoice_currency || null,
      latestInvoiceDueAt: data.latest_invoice_due_at || null,
      latestInvoicePaidAt: data.latest_invoice_paid_at || null,
    };
  } catch (error) {
    console.warn("[portal/data] portal_subscriptions storage unavailable.", {
      subscriptionId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalDashboardEntitlements(companyId: string) {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_dashboard_entitlements")
      .select("id, company_id, dashboard_id, assigned_at, assigned_by_user_id, notes")
      .eq("company_id", companyId)
      .order("assigned_at", { ascending: true });

    if (error) {
      console.warn("[portal/data] portal_dashboard_entitlements lookup failed.", { companyId, error: error.message });
      return null;
    }

    return (data || []).map((entitlement) => ({
      id: String(entitlement.id),
      companyId: String(entitlement.company_id),
      dashboardId: String(entitlement.dashboard_id),
      assignedAt: String(entitlement.assigned_at),
      assignedByUserId: entitlement.assigned_by_user_id ? String(entitlement.assigned_by_user_id) : null,
      notes: entitlement.notes || null,
    }));
  } catch (error) {
    console.warn("[portal/data] portal_dashboard_entitlements storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalTeamMembers(companyId: string): Promise<PortalTeamMember[]> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_users")
      .select("*")
      .eq("company_id", companyId)
      .order("name", { ascending: true });

    if (error) {
      console.warn("[portal/data] portal_users team lookup failed.", { companyId, error: error.message });
      return [];
    }

    return (data || []).map((member) => ({
      id: member.id,
      companyId: member.company_id,
      homeCompanyId: member.home_company_id || member.company_id,
      homeCompanyName: null,
      name: member.name,
      email: member.email,
      role: normalizePortalRole(member.role),
      status: member.status,
    }));
  } catch (error) {
    console.warn("[portal/data] portal_users team storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

async function queryPortalUsersByIds(userIds: string[]): Promise<PortalUser[] | null> {
  if (!userIds.length) return [];

  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_users")
      .select("*")
      .in("id", userIds);

    if (error) {
      console.warn("[portal/data] portal_users id lookup failed.", { userIds, error: error.message });
      return null;
    }

    return (data || []).map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.company_id,
      homeCompanyId: user.home_company_id || user.company_id,
      role: normalizePortalRole(user.role),
      status: user.status,
    }));
  } catch (error) {
    console.warn("[portal/data] portal_users id storage unavailable.", {
      userIds,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalTeamInvites(companyId: string): Promise<PortalTeamInvite[] | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_team_invites")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.warn("[portal/data] portal_team_invites lookup failed.", { companyId, error: error.message });
      return null;
    }

    return (data || []).map((invite) => ({
      id: String(invite.id),
      companyId: String(invite.company_id),
      invitedUserId: invite.invited_user_id ? String(invite.invited_user_id) : null,
      invitedName: String(invite.invited_name),
      invitedEmail: String(invite.invited_email),
      invitedRole:
        invite.invited_role === "client_admin" ||
        invite.invited_role === "agency_admin" ||
        invite.invited_role === "agency_user"
          ? invite.invited_role
          : "client_user",
      invitedByUserId: String(invite.invited_by_user_id),
      inviteUrl: String(invite.invite_url),
      deliveryStatus:
        invite.delivery_status === "sent"
          ? "sent"
          : invite.delivery_status === "failed"
            ? "failed"
            : "manual_only",
      deliveryMessage: invite.delivery_message || null,
      createdAt: String(invite.created_at),
      updatedAt: String(invite.updated_at),
      lastSentAt: invite.last_sent_at || null,
    }));
  } catch (error) {
    console.warn("[portal/data] portal_team_invites storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryCompanyDashboards(companyId: string): Promise<PortalDashboard[]> {
  try {
    const admin = getServiceSupabase();
    let data: { dashboard_slug: unknown; is_active?: unknown; is_hidden?: unknown }[] | null = null;
    let error: { message: string } | null = null;
    const result = await admin
      .from("portal_dashboard_configs")
      .select("dashboard_slug, is_active, is_hidden")
      .eq("company_id", companyId);
    data = result.data;
    error = result.error;

    if (error && error.message.includes("is_hidden")) {
      const fallback = await admin
        .from("portal_dashboard_configs")
        .select("dashboard_slug, is_active")
        .eq("company_id", companyId);
      data = fallback.data as typeof data;
      error = fallback.error;
    }

    if (error) {
      console.warn("[portal/data] portal_dashboard_configs lookup failed.", { companyId, error: error.message });
      return [];
    }

    const activeSlugs = new Set(
      (data || [])
        .filter((item) => item.is_active && !item.is_hidden)
        .map((item) => item.dashboard_slug),
    );
    const hiddenSlugs = new Set(
      (data || []).filter((item) => item.is_hidden).map((item) => item.dashboard_slug),
    );
    const runtimeEntitlements = await queryPortalDashboardEntitlements(companyId);
    const dashboardCatalog = await getPortalDashboardCatalog();
    const entitledIds = new Set((runtimeEntitlements || []).map((entitlement) => entitlement.dashboardId));
    return dashboardCatalog.filter(
      (dashboard) =>
        !hiddenSlugs.has(dashboard.slug) &&
        (activeSlugs.has(dashboard.slug) || entitledIds.has(dashboard.id) || dashboard.availableToAll),
    );
  } catch (error) {
    console.warn("[portal/data] portal_dashboard_configs storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

async function queryPortalDashboardCatalog(): Promise<PortalDashboard[] | null> {
  type PortalDashboardCatalogRow = {
    id: unknown;
    slug: unknown;
    name: unknown;
    description?: unknown;
    access_tag?: unknown;
    embed_access?: unknown;
    available_to_all?: unknown;
  };

  try {
    const admin = getServiceSupabase();
    let data: PortalDashboardCatalogRow[] | null = null;
    let error: { message: string } | null = null;
    const result = await admin
      .from("portal_dashboards")
      .select("id, slug, name, description, access_tag, embed_access, available_to_all")
      .order("name", { ascending: true });
    data = result.data;
    error = result.error;

    if (error && error.message.includes("available_to_all")) {
      const fallback = await admin
        .from("portal_dashboards")
        .select("id, slug, name, description, access_tag, embed_access")
        .order("name", { ascending: true });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn("[portal/data] portal_dashboards catalog lookup failed.", { error: error.message });
      return null;
    }

    return (data || []).map((dashboard) => ({
      id: String(dashboard.id),
      slug: String(dashboard.slug),
      name: String(dashboard.name),
      description: String(dashboard.description || ""),
      accessTag: String(dashboard.access_tag || "Uncategorized"),
      embedUrl: null,
      embedAccess:
        dashboard.embed_access === "displayr_login_required" ? "displayr_login_required" : "public_link",
      availableToAll: Boolean(dashboard.available_to_all),
    }));
  } catch (error) {
    console.warn("[portal/data] portal_dashboards storage unavailable.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalDashboardConfigs(companyId: string): Promise<PortalDashboardConfig[] | null> {
  try {
    const admin = getServiceSupabase();
    let data: {
      id: unknown;
      company_id: unknown;
      dashboard_slug: unknown;
      displayr_embed_url: unknown;
      is_active: unknown;
      is_hidden?: unknown;
      notes?: unknown;
      created_at: unknown;
      updated_at: unknown;
    }[] | null = null;
    let error: { message: string } | null = null;
    const result = await admin
      .from("portal_dashboard_configs")
      .select("id, company_id, dashboard_slug, displayr_embed_url, is_active, is_hidden, notes, created_at, updated_at")
      .eq("company_id", companyId)
      .order("dashboard_slug", { ascending: true });
    data = result.data;
    error = result.error;

    if (error && error.message.includes("is_hidden")) {
      const fallback = await admin
        .from("portal_dashboard_configs")
        .select("id, company_id, dashboard_slug, displayr_embed_url, is_active, notes, created_at, updated_at")
        .eq("company_id", companyId)
        .order("dashboard_slug", { ascending: true });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn("[portal/data] portal_dashboard_configs detail lookup failed.", { companyId, error: error.message });
      return null;
    }

    return (data || []).map((config) => ({
      id: String(config.id),
      companyId: String(config.company_id),
      dashboardSlug: String(config.dashboard_slug),
      displayrEmbedUrl: String(config.displayr_embed_url),
      isActive: Boolean(config.is_active),
      isHidden: Boolean(config.is_hidden),
      notes: typeof config.notes === "string" ? config.notes : null,
      createdAt: String(config.created_at),
      updatedAt: String(config.updated_at),
    }));
  } catch (error) {
    console.warn("[portal/data] portal_dashboard_configs detail storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryActivePortalDashboardConfigs(): Promise<PortalDashboardConfig[] | null> {
  try {
    const admin = getServiceSupabase();
    let data: {
      id: unknown;
      company_id: unknown;
      dashboard_slug: unknown;
      displayr_embed_url: unknown;
      is_active: unknown;
      is_hidden?: unknown;
      notes?: unknown;
      created_at: unknown;
      updated_at: unknown;
    }[] | null = null;
    let error: { message: string } | null = null;
    const result = await admin
      .from("portal_dashboard_configs")
      .select("id, company_id, dashboard_slug, displayr_embed_url, is_active, is_hidden, notes, created_at, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });
    data = result.data;
    error = result.error;

    if (error && error.message.includes("is_hidden")) {
      const fallback = await admin
        .from("portal_dashboard_configs")
        .select("id, company_id, dashboard_slug, displayr_embed_url, is_active, notes, created_at, updated_at")
        .eq("is_active", true)
        .order("updated_at", { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn("[portal/data] portal_dashboard_configs active lookup failed.", { error: error.message });
      return null;
    }

    return (data || []).map((config) => ({
      id: String(config.id),
      companyId: String(config.company_id),
      dashboardSlug: String(config.dashboard_slug),
      displayrEmbedUrl: String(config.displayr_embed_url),
      isActive: Boolean(config.is_active),
      isHidden: Boolean(config.is_hidden),
      notes: typeof config.notes === "string" ? config.notes : null,
      createdAt: String(config.created_at),
      updatedAt: String(config.updated_at),
    }));
  } catch (error) {
    console.warn("[portal/data] portal_dashboard_configs active storage unavailable.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalUsageLogs(companyId: string): Promise<PortalUsageLog[]> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_usage_logs")
      .select("*")
      .eq("company_id", companyId)
      .order("event_at", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("[portal/data] portal_usage_logs lookup failed.", { companyId, error: error.message });
      return [];
    }

    return (data || []).map((log) => ({
      id: String(log.id),
      userId: String(log.user_id),
      companyId: String(log.company_id),
      workspaceCompanyId: log.workspace_company_id ? String(log.workspace_company_id) : String(log.company_id),
      billingCompanyId: log.billing_company_id ? String(log.billing_company_id) : String(log.company_id),
      userHomeCompanyId: log.user_home_company_id ? String(log.user_home_company_id) : undefined,
      dashboardId: String(log.dashboard_id),
      dashboardName: String(log.dashboard_name),
      eventType: log.event_type,
      eventAt: String(log.event_at),
      minutesTracked: Number(log.minutes_tracked || 0),
      source: log.source === "portal_runtime" ? "portal_runtime" : "mock",
      notes: log.notes || undefined,
      metadata: log.metadata || {},
    }));
  } catch (error) {
    console.warn("[portal/data] portal_usage_logs storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

async function queryPortalUsageLogsWithFilters(filters: PortalUsageLogFilters = {}): Promise<PortalUsageLog[] | null> {
  try {
    const admin = getServiceSupabase();
    let query = admin
      .from("portal_usage_logs")
      .select("*")
      .order("event_at", { ascending: false })
      .limit(filters.limit ?? 100);

    if (filters.companyId) query = query.eq("company_id", filters.companyId);
    if (filters.workspaceCompanyId) query = query.eq("workspace_company_id", filters.workspaceCompanyId);
    if (filters.billingCompanyId) query = query.eq("billing_company_id", filters.billingCompanyId);
    if (filters.userId) query = query.eq("user_id", filters.userId);
    if (filters.dashboardId) query = query.eq("dashboard_id", filters.dashboardId);
    if (filters.startAt) query = query.gte("event_at", filters.startAt);
    if (filters.endAt) query = query.lte("event_at", filters.endAt);

    const { data, error } = await query;

    if (error) {
      console.warn("[portal/data] portal_usage_logs filtered lookup failed.", { filters, error: error.message });
      return null;
    }

    return (data || []).map((log) => ({
      id: String(log.id),
      userId: String(log.user_id),
      companyId: String(log.company_id),
      workspaceCompanyId: log.workspace_company_id ? String(log.workspace_company_id) : String(log.company_id),
      billingCompanyId: log.billing_company_id ? String(log.billing_company_id) : String(log.company_id),
      userHomeCompanyId: log.user_home_company_id ? String(log.user_home_company_id) : undefined,
      dashboardId: String(log.dashboard_id),
      dashboardName: String(log.dashboard_name),
      eventType: log.event_type,
      eventAt: String(log.event_at),
      minutesTracked: Number(log.minutes_tracked || 0),
      source: log.source === "portal_runtime" ? "portal_runtime" : "mock",
      notes: log.notes || undefined,
      metadata: log.metadata || {},
    }));
  } catch (error) {
    console.warn("[portal/data] portal_usage_logs filtered storage unavailable.", {
      filters,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalUsageAllowance(companyId: string): Promise<PortalUsageAllowance | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_usage_allowances")
      .select("company_id, annual_hours_limit, hours_used, period_start, period_end")
      .eq("company_id", companyId)
      .maybeSingle();

    if (error) {
      console.warn("[portal/data] portal_usage_allowances lookup failed.", { companyId, error: error.message });
      return null;
    }

    if (!data) return null;

    return {
      companyId: data.company_id,
      annualHoursLimit: data.annual_hours_limit,
      hoursUsed: data.hours_used,
      periodStart: data.period_start,
      periodEnd: data.period_end,
    };
  } catch (error) {
    console.warn("[portal/data] portal_usage_allowances storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalUsageAllocations(companyId: string): Promise<PortalUsageAllocation[]> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_usage_allocations")
      .select("company_id, user_id, allocated_hours, created_at, updated_at")
      .eq("company_id", companyId);

    if (error) {
      console.warn("[portal/data] portal_usage_allocations lookup failed.", { companyId, error: error.message });
      return [];
    }

    return (data || []).map((allocation) => ({
      companyId: String(allocation.company_id),
      userId: String(allocation.user_id),
      allocatedHours: Number(allocation.allocated_hours || 0),
      createdAt: String(allocation.created_at),
      updatedAt: String(allocation.updated_at),
    }));
  } catch (error) {
    console.warn("[portal/data] portal_usage_allocations storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

async function queryPortalTickets(
  user: PortalUser,
  { includeArchived = false }: { includeArchived?: boolean } = {},
): Promise<PortalTicket[] | null> {
  try {
    const admin = getServiceSupabase();
    const query = admin
      .from("portal_tickets")
      .select(
        "id, company_id, subject, dashboard_name, issue_type, priority, status, completed_at, client_reviewed_completed_at, created_at, updated_at, requester_id, owner_id",
      )
      .order("updated_at", { ascending: false });

    if (user.role === "support_admin") {
      const { data, error } = await query.limit(100);

      if (error) {
        console.warn("[portal/data] portal_tickets support lookup failed.", { userId: user.id, error: error.message });
        return null;
      }

      const mappedTickets = (data || [])
        .map((ticket) => ({
          id: ticket.id,
          companyId: ticket.company_id,
          subject: ticket.subject,
          dashboardName: ticket.dashboard_name,
          issueType: ticket.issue_type,
          priority: ticket.priority,
          status: normalizePortalTicketStatus(ticket.status),
          completedAt: ticket.completed_at,
          clientReviewedCompletedAt: ticket.client_reviewed_completed_at,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          requesterId: ticket.requester_id,
          ownerId: ticket.owner_id,
        }));
      const syncedTickets = await syncPortalAutoArchivedTickets(mappedTickets);
      return syncedTickets.filter((ticket) => includeArchived || ticket.status !== "archived");
    }

    if (user.role === "client_admin" || user.role === "agency_admin") {
      const { data, error } = await query.eq("company_id", user.companyId).limit(100);

      if (error) {
        console.warn("[portal/data] portal_tickets company-admin lookup failed.", {
          userId: user.id,
          companyId: user.companyId,
          error: error.message,
        });
        return null;
      }

      const mappedTickets = (data || [])
        .map((ticket) => ({
          id: ticket.id,
          companyId: ticket.company_id,
          subject: ticket.subject,
          dashboardName: ticket.dashboard_name,
          issueType: ticket.issue_type,
          priority: ticket.priority,
          status: normalizePortalTicketStatus(ticket.status),
          completedAt: ticket.completed_at,
          clientReviewedCompletedAt: ticket.client_reviewed_completed_at,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          requesterId: ticket.requester_id,
          ownerId: ticket.owner_id,
        }));
      const syncedTickets = await syncPortalAutoArchivedTickets(mappedTickets);
      return syncedTickets.filter((ticket) => includeArchived || ticket.status !== "archived");
    }

    const { data, error } = await query.eq("requester_id", user.id).limit(100);

    if (error) {
      console.warn("[portal/data] portal_tickets user lookup failed.", { userId: user.id, error: error.message });
      return null;
    }

    const mappedTickets = (data || [])
      .map((ticket) => ({
        id: ticket.id,
        companyId: ticket.company_id,
        subject: ticket.subject,
        dashboardName: ticket.dashboard_name,
        issueType: ticket.issue_type,
        priority: ticket.priority,
        status: normalizePortalTicketStatus(ticket.status),
        completedAt: ticket.completed_at,
        clientReviewedCompletedAt: ticket.client_reviewed_completed_at,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        requesterId: ticket.requester_id,
        ownerId: ticket.owner_id,
      }));
    const syncedTickets = await syncPortalAutoArchivedTickets(mappedTickets);
    return syncedTickets.filter((ticket) => includeArchived || ticket.status !== "archived");
  } catch (error) {
    console.warn("[portal/data] portal_tickets storage unavailable.", {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function queryPortalTicketMessages(ticketId: string, includeInternal: boolean): Promise<PortalTicketMessage[] | null> {
  try {
    const admin = getServiceSupabase();
    let query = admin
      .from("portal_ticket_messages")
      .select("id, ticket_id, author_id, body, created_at, is_internal")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (!includeInternal) {
      query = query.eq("is_internal", false);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("[portal/data] portal_ticket_messages lookup failed.", { ticketId, error: error.message });
      return null;
    }

    return (data || []).map((message) => ({
      id: String(message.id),
      ticketId: message.ticket_id,
      authorId: message.author_id,
      body: message.body,
      createdAt: message.created_at,
      isInternal: message.is_internal,
    }));
  } catch (error) {
    console.warn("[portal/data] portal_ticket_messages storage unavailable.", {
      ticketId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export async function getPortalUserByEmail(email?: string | null): Promise<PortalUser | null> {
  const runtimeUser = await queryPortalUserByEmail(email);
  if (runtimeUser) return runtimeUser;
  if (!email) return null;
  return portalUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getPortalHomeCompany(user: PortalUser) {
  const companyId = user.homeCompanyId || user.companyId;
  const runtimeCompany = await queryPortalCompanyById(companyId);
  if (runtimeCompany) return runtimeCompany;
  return portalCompanies.find((company) => company.id === companyId) ?? null;
}

export async function getPortalWorkspaceMembershipsForUser(user: PortalUser) {
  const runtimeMemberships = await queryWorkspaceMembershipsByUser(user.id);
  if (runtimeMemberships) return runtimeMemberships;

  return [
    {
      id: `default-${user.id}-${user.companyId}`,
      userId: user.id,
      workspaceCompanyId: user.companyId,
      membershipRole: isPortalWorkspaceManager(user.role) ? "workspace_admin" : "workspace_member",
      visibilityScope: "full" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export async function getPortalAccessibleCompaniesForUser(user: PortalUser) {
  if (user.role === "support_admin") {
    return getPortalCompanies();
  }

  const companies = await getPortalCompanies();
  const memberships = await getPortalWorkspaceMembershipsForUser(user);
  const companyIds = new Set<string>([user.companyId, user.homeCompanyId || user.companyId]);

  memberships.forEach((membership) => {
    companyIds.add(membership.workspaceCompanyId);
  });

  return companies.filter((company) => companyIds.has(company.id));
}

export async function getPortalDashboardsForUser(user: PortalUser, companyId = user.companyId): Promise<PortalDashboard[]> {
  if (user.role === "support_admin") {
    return getPortalDashboardCatalog();
  }

  const runtimeDashboards = await queryCompanyDashboards(companyId);
  if (runtimeDashboards.length) return runtimeDashboards;

  const entitledIds = new Set(
    portalDashboardEntitlements
      .filter((entitlement) => entitlement.userId === user.id || entitlement.companyId === companyId)
      .map((entitlement) => entitlement.dashboardId),
  );

  return portalDashboards.filter((dashboard) => entitledIds.has(dashboard.id) || dashboard.availableToAll);
}

export async function getPortalDashboardForUser(user: PortalUser, slug: string, companyId = user.companyId) {
  return (await getPortalDashboardsForUser(user, companyId)).find((dashboard) => dashboard.slug === slug) ?? null;
}

export async function getPortalCompanies() {
  const runtimeCompanies = await queryPortalCompanies();
  if (runtimeCompanies) return runtimeCompanies;
  return [...portalCompanies].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPortalDashboardCatalog() {
  const runtimeDashboards = await queryPortalDashboardCatalog();
  if (runtimeDashboards) return runtimeDashboards;
  return [...portalDashboards].sort((a, b) => a.name.localeCompare(b.name));
}

export async function isPortalDashboardCatalogStorageReady() {
  return (await queryPortalDashboardCatalog()) !== null;
}

export async function getPortalDashboardConfigsByCompany(companyId: string) {
  const runtimeConfigs = await queryPortalDashboardConfigs(companyId);
  if (runtimeConfigs) return runtimeConfigs;

  const dashboardCatalog = await getPortalDashboardCatalog();
  return dashboardCatalog
    .filter((dashboard) => portalDashboardEntitlements.some((entitlement) => entitlement.companyId === companyId && entitlement.dashboardId === dashboard.id))
    .map((dashboard) => ({
      id: `mock-${companyId}-${dashboard.slug}`,
      companyId,
      dashboardSlug: dashboard.slug,
      displayrEmbedUrl: dashboard.embedUrl || "",
      isActive: true,
      isHidden: false,
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
}

export async function getPortalActiveDashboardConfigs() {
  const runtimeConfigs = await queryActivePortalDashboardConfigs();
  if (runtimeConfigs) return runtimeConfigs;

  const dashboardCatalog = await getPortalDashboardCatalog();
  return portalDashboardEntitlements
    .filter((entitlement) => entitlement.companyId)
    .flatMap((entitlement) => {
      const dashboard = dashboardCatalog.find((item) => item.id === entitlement.dashboardId);
      if (!dashboard || !dashboard.embedUrl) return [];
      return [
        {
          id: `mock-${entitlement.companyId}-${dashboard.slug}`,
          companyId: String(entitlement.companyId),
          dashboardSlug: dashboard.slug,
          displayrEmbedUrl: dashboard.embedUrl,
          isActive: true,
          isHidden: false,
          notes: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    });
}

export async function getPortalDashboardEntitlementsByCompany(companyId: string) {
  const runtimeEntitlements = await queryPortalDashboardEntitlements(companyId);
  if (runtimeEntitlements) return runtimeEntitlements;

  return portalDashboardEntitlements.filter((entitlement) => entitlement.companyId === companyId);
}

export async function getPortalDashboardConfig(companyId: string, dashboardSlug: string) {
  const configs = await getPortalDashboardConfigsByCompany(companyId);
  return configs.find((config) => config.dashboardSlug === dashboardSlug) || null;
}

export async function getPortalAnyActiveDashboardConfigBySlug(dashboardSlug: string) {
  const configs = await getPortalActiveDashboardConfigs();
  return configs.find((config) => config.dashboardSlug === dashboardSlug && !config.isHidden) || null;
}

export async function getPortalUsageAllowanceByCompany(companyId: string) {
  const runtimeAllowance = await queryPortalUsageAllowance(companyId);
  if (runtimeAllowance) return runtimeAllowance;
  return portalUsageAllowances.find((allowance) => allowance.companyId === companyId) ?? null;
}

export async function getPortalUsageAllocationsByCompany(companyId: string) {
  const runtimeAllocations = await queryPortalUsageAllocations(companyId);
  if (runtimeAllocations.length) return runtimeAllocations;
  return [];
}

export async function getPortalUsageAllocationByUser(companyId: string, userId: string) {
  const allocations = await getPortalUsageAllocationsByCompany(companyId);
  return allocations.find((allocation) => allocation.userId === userId) ?? null;
}

function calculateUsageSummary({
  annualHoursLimit,
  baselineHoursUsed,
  loggedMinutes,
  devOverride,
}: {
  annualHoursLimit: number;
  baselineHoursUsed: number;
  loggedMinutes: number;
  devOverride?: "available" | "exhausted" | null;
}) {
  const baselineMinutesUsed = baselineHoursUsed * 60;
  const trackedMinutesUsed = baselineMinutesUsed + loggedMinutes;
  const trackedHoursUsed = Number((trackedMinutesUsed / 60).toFixed(1));
  const overriddenHoursUsed =
    devOverride === "available"
      ? Math.min(trackedHoursUsed, Math.max(0, annualHoursLimit - 1))
      : devOverride === "exhausted"
        ? annualHoursLimit
        : trackedHoursUsed;
  const overriddenMinutesUsed = Math.round(overriddenHoursUsed * 60);
  const annualMinutesLimit = annualHoursLimit * 60;
  const remainingMinutes = Math.max(0, annualMinutesLimit - overriddenMinutesUsed);
  const hoursRemaining = Number((remainingMinutes / 60).toFixed(1));
  const utilizationPct = annualHoursLimit
    ? Math.min(100, Math.round((overriddenHoursUsed / annualHoursLimit) * 100))
    : 0;

  return {
    hoursUsed: overriddenHoursUsed,
    hoursUsedDisplay: formatPortalUsageDuration(overriddenMinutesUsed),
    annualHoursLimit,
    hoursRemaining,
    hoursRemainingDisplay: formatPortalUsageDuration(remainingMinutes),
    utilizationPct,
    isLocked: overriddenHoursUsed >= annualHoursLimit,
  };
}

export async function getPortalUsageStatus(user: PortalUser) {
  const billingCompanyId = user.homeCompanyId || user.companyId;
  const homeCompany = await getPortalHomeCompany(user);
  const hasUnlimitedInternalUsage = user.role === "support_admin" || homeCompany?.subscriberType === "internal";
  const allowance = hasUnlimitedInternalUsage ? null : await getPortalUsageAllowanceByCompany(billingCompanyId);
  const allocation =
    user.role === "client_user" || user.role === "agency_user"
      ? await getPortalUsageAllocationByUser(billingCompanyId, user.id)
      : null;

  if (allocation && allocation.allocatedHours > 0) {
    const hasAllowanceWindow = Boolean(allowance?.periodStart && allowance?.periodEnd);
    const loggedUsage = await getPortalUsageLogsForAdmin({
      companyId: billingCompanyId,
      userId: user.id,
      ...(hasAllowanceWindow
        ? {
            startAt: `${allowance?.periodStart}T00:00:00Z`,
            endAt: `${allowance?.periodEnd}T23:59:59Z`,
          }
        : {}),
      limit: 500,
    });
    const loggedMinutes = loggedUsage.reduce((total, log) => total + log.minutesTracked, 0);
    const devOverride = await getPortalDevUsageOverrideFromCookies();
    const summary = calculateUsageSummary({
      annualHoursLimit: allocation.allocatedHours,
      baselineHoursUsed: 0,
      loggedMinutes,
      devOverride,
    });

    return {
      allowance,
      allocation,
      ...summary,
      devOverride,
    };
  }

  if (!allowance) {
    return {
      allowance: null,
      allocation: null,
      hoursUsed: 0,
      hoursUsedDisplay: null,
      annualHoursLimit: null,
      hoursRemaining: null,
      hoursRemainingDisplay: null,
      utilizationPct: 0,
      isLocked: false,
      devOverride: null,
    };
  }

  const hasAllowanceWindow = Boolean(allowance.periodStart && allowance.periodEnd);
  const loggedUsage = await getPortalUsageLogsForAdmin({
    companyId: billingCompanyId,
    ...(hasAllowanceWindow
      ? {
          startAt: `${allowance.periodStart}T00:00:00Z`,
          endAt: `${allowance.periodEnd}T23:59:59Z`,
        }
      : {}),
    limit: 500,
  });
  const loggedMinutes = loggedUsage.reduce((total, log) => total + log.minutesTracked, 0);
  const devOverride = await getPortalDevUsageOverrideFromCookies();
  const summary = calculateUsageSummary({
    annualHoursLimit: allowance.annualHoursLimit,
    baselineHoursUsed: allowance.hoursUsed,
    loggedMinutes,
    devOverride,
  });

  return {
    allowance,
    allocation: null,
    ...summary,
    devOverride,
  };
}

export async function getPortalUsageLogsForUser(user: PortalUser): Promise<PortalUsageLog[]> {
  const companyId = user.homeCompanyId || user.companyId;
  const runtimeLogs = await queryPortalUsageLogs(companyId);
  if (runtimeLogs.length) {
    if (user.role === "support_admin") {
      return runtimeLogs;
    }
    return runtimeLogs.filter((log) => log.companyId === companyId);
  }

  if (user.role === "support_admin") {
    return [...portalUsageLogs].sort((a, b) => b.eventAt.localeCompare(a.eventAt));
  }

  return portalUsageLogs
    .filter((log) => log.companyId === companyId)
    .sort((a, b) => b.eventAt.localeCompare(a.eventAt));
}

export async function getPortalUsageLogsForAdmin(filters: PortalUsageLogFilters = {}) {
  const runtimeLogs = await queryPortalUsageLogsWithFilters(filters);
  if (runtimeLogs) return runtimeLogs;

  return portalUsageLogs
    .filter((log) => {
      if (filters.companyId && log.companyId !== filters.companyId) return false;
      if (filters.workspaceCompanyId && log.workspaceCompanyId !== filters.workspaceCompanyId) return false;
      if (filters.billingCompanyId && log.billingCompanyId !== filters.billingCompanyId) return false;
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.dashboardId && log.dashboardId !== filters.dashboardId) return false;
      if (filters.startAt && log.eventAt < filters.startAt) return false;
      if (filters.endAt && log.eventAt > filters.endAt) return false;
      return true;
    })
    .sort((a, b) => b.eventAt.localeCompare(a.eventAt))
    .slice(0, filters.limit ?? 100);
}

export async function getLatestPortalPasswordSetupTokenByUserId(userId: string) {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_password_setup_tokens")
      .select("email, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("[portal/data] portal_password_setup_tokens lookup failed.", { userId, error: error.message });
      return null;
    }

    if (!data) return null;

    return {
      email: data.email ? String(data.email) : null,
      createdAt: data.created_at ? String(data.created_at) : null,
    };
  } catch (error) {
    console.warn("[portal/data] portal_password_setup_tokens storage unavailable.", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export async function getPortalCompany(user: PortalUser) {
  const runtimeCompany = await queryPortalCompanyById(user.companyId);
  if (runtimeCompany) return runtimeCompany;
  return portalCompanies.find((company) => company.id === user.companyId) ?? null;
}

export async function getPortalSubscription(user: PortalUser) {
  const company = await getPortalCompany(user);
  if (!company) return null;
  const runtimeSubscription = await queryPortalSubscriptionById(company.subscriptionId);
  if (runtimeSubscription) return runtimeSubscription;
  return portalSubscriptions.find((subscription) => subscription.id === company.subscriptionId) ?? null;
}

export async function getPortalSubscriptionByCompany(companyId: string) {
  const runtimeCompany = await queryPortalCompanyById(companyId);
  const company = runtimeCompany || portalCompanies.find((item) => item.id === companyId) || null;
  if (!company) return null;

  const runtimeSubscription = await queryPortalSubscriptionById(company.subscriptionId);
  if (runtimeSubscription) return runtimeSubscription;
  return portalSubscriptions.find((subscription) => subscription.id === company.subscriptionId) ?? null;
}

export async function getPortalTeamMembers(user: PortalUser, companyId = user.companyId) {
  const runtimeTeamMembers = await queryPortalTeamMembers(companyId);
  if (runtimeTeamMembers.length) return runtimeTeamMembers;
  return portalTeamMembers.filter((member) => member.companyId === companyId);
}

export async function getPortalTeamMembersByCompany(companyId: string) {
  const runtimeTeamMembers = await queryPortalTeamMembers(companyId);
  if (runtimeTeamMembers.length) return runtimeTeamMembers;
  return portalTeamMembers.filter((member) => member.companyId === companyId);
}

export async function getPortalTeamInvitesByCompany(companyId: string) {
  const runtimeInvites = await queryPortalTeamInvites(companyId);
  if (runtimeInvites) return runtimeInvites;
  return portalTeamInvites
    .filter((invite) => invite.companyId === companyId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPortalUsersByIds(userIds: string[]) {
  const runtimeUsers = await queryPortalUsersByIds(userIds);
  if (runtimeUsers) return runtimeUsers;
  return portalUsers.filter((user) => userIds.includes(user.id));
}

export async function getPortalTicketsForUser(
  user: PortalUser,
  { includeArchived = false }: { includeArchived?: boolean } = {},
): Promise<PortalTicket[]> {
  const runtimeTickets = await queryPortalTickets(user, { includeArchived });
  if (runtimeTickets) return runtimeTickets;

  if (user.role === "support_admin") {
    return [...portalTickets]
      .map((ticket) => ({ ...ticket, status: normalizePortalTicketStatus(ticket.status) }))
      .filter((ticket) => includeArchived || ticket.status !== "archived")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  if (user.role === "client_admin" || user.role === "agency_admin") {
    return portalTickets
      .map((ticket) => ({ ...ticket, status: normalizePortalTicketStatus(ticket.status) }))
      .filter((ticket) => ticket.companyId === user.companyId && (includeArchived || ticket.status !== "archived"))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return portalTickets
    .map((ticket) => ({ ...ticket, status: normalizePortalTicketStatus(ticket.status) }))
    .filter((ticket) => ticket.requesterId === user.id && (includeArchived || ticket.status !== "archived"))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPortalTicketForUser(user: PortalUser, ticketId: string): Promise<PortalTicket | null> {
  const runtimeTickets = await queryPortalTickets(user, { includeArchived: true });
  if (runtimeTickets) {
    return runtimeTickets.find((item) => item.id === ticketId) ?? null;
  }

  const ticket = portalTickets
    .map((item) => ({ ...item, status: normalizePortalTicketStatus(item.status) }))
    .find((item) => item.id === ticketId) ?? null;
  if (!ticket) return null;
  if (
    user.role === "support_admin" ||
    ((user.role === "client_admin" || user.role === "agency_admin") && ticket.companyId === user.companyId) ||
    ticket.requesterId === user.id
  ) {
    return ticket;
  }
  return null;
}

export async function getPortalTicketMessages(ticketId: string, includeInternal: boolean): Promise<PortalTicketMessage[]> {
  const runtimeMessages = await queryPortalTicketMessages(ticketId, includeInternal);
  if (runtimeMessages) return runtimeMessages;

  return portalTicketMessages
    .filter((message) => message.ticketId === ticketId && (includeInternal || !message.isInternal))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function markPortalCompletedTicketReviewed(ticketId: string, user: PortalUser, ticket?: PortalTicket) {
  if (user.role === "support_admin") return;
  const currentTicket = ticket || (await getPortalTicketForUser(user, ticketId));
  if (!currentTicket || currentTicket.status !== "completed" || !currentTicket.completedAt) return;

  const alreadyReviewedCurrentCompletion =
    currentTicket.clientReviewedCompletedAt &&
    new Date(currentTicket.clientReviewedCompletedAt).getTime() >= new Date(currentTicket.completedAt).getTime();
  if (alreadyReviewedCurrentCompletion) return;

  try {
    const admin = getServiceSupabase();
    const { error } = await admin
      .from("portal_tickets")
      .update({
        client_reviewed_completed_at: new Date().toISOString(),
      })
      .eq("id", currentTicket.id);

    if (error) {
      console.warn("[portal/data] ticket review tracking failed.", { ticketId: currentTicket.id, error: error.message });
    }
  } catch (error) {
    console.warn("[portal/data] ticket review tracking unavailable.", {
      ticketId: currentTicket.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export function getPortalArticleCategories() {
  return Array.from(new Set(portalHelpArticles.map((article) => article.category)));
}

export function getPortalArticles(): PortalHelpArticle[] {
  return portalHelpArticles;
}

export function getPortalArticleBySlug(slug: string) {
  return portalHelpArticles.find((article) => article.slug === slug) ?? null;
}

export function getPortalUserName(userId: string) {
  return portalUsers.find((user) => user.id === userId)?.name ?? "EcoFocus Team";
}
