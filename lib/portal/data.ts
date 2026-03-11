import {
  portalCompanies,
  portalDashboardEntitlements,
  portalDashboards,
  portalHelpArticles,
  portalSubscriptions,
  portalTeamMembers,
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
  PortalHelpArticle,
  PortalRole,
  PortalSubscription,
  PortalTicket,
  PortalTicketMessage,
  PortalTeamMember,
  PortalUsageAllowance,
  PortalUsageLog,
  PortalUser,
} from "@/lib/portal/types";

const roleRank: Record<PortalRole, number> = {
  client_user: 1,
  client_admin: 2,
  support_admin: 3,
};

export function normalizePortalRole(input?: string | null): PortalRole {
  if (input === "support_admin" || input === "client_admin" || input === "client_user") {
    return input;
  }
  return "client_user";
}

export function hasRequiredRole(userRole: PortalRole, requiredRole: PortalRole) {
  return roleRank[userRole] >= roleRank[requiredRole];
}

async function queryPortalUserByEmail(email?: string | null): Promise<PortalUser | null> {
  if (!email) return null;

  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_users")
      .select("id, name, email, company_id, role, status")
      .ilike("email", email)
      .eq("status", "active")
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
      role: normalizePortalRole(data.role),
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
      .select("id, name, subscription_id")
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
    };
  } catch (error) {
    console.warn("[portal/data] portal_companies storage unavailable.", {
      companyId,
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
      .select("id, plan_name, seats_purchased, seats_used, renewal_date, status")
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
      renewalDate: data.renewal_date,
      status: data.status,
    };
  } catch (error) {
    console.warn("[portal/data] portal_subscriptions storage unavailable.", {
      subscriptionId,
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
      .select("id, company_id, name, email, role, status")
      .eq("company_id", companyId)
      .order("name", { ascending: true });

    if (error) {
      console.warn("[portal/data] portal_users team lookup failed.", { companyId, error: error.message });
      return [];
    }

    return (data || []).map((member) => ({
      id: member.id,
      companyId: member.company_id,
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

async function queryCompanyDashboards(companyId: string): Promise<PortalDashboard[]> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_dashboard_configs")
      .select("dashboard_slug")
      .eq("company_id", companyId)
      .eq("is_active", true);

    if (error) {
      console.warn("[portal/data] portal_dashboard_configs lookup failed.", { companyId, error: error.message });
      return [];
    }

    const slugs = new Set((data || []).map((item) => item.dashboard_slug));
    return portalDashboards.filter((dashboard) => slugs.has(dashboard.slug));
  } catch (error) {
    console.warn("[portal/data] portal_dashboard_configs storage unavailable.", {
      companyId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getPortalUserByEmail(email?: string | null): Promise<PortalUser | null> {
  const runtimeUser = await queryPortalUserByEmail(email);
  if (runtimeUser) return runtimeUser;
  if (!email) return null;
  return portalUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getPortalDashboardsForUser(user: PortalUser): Promise<PortalDashboard[]> {
  const runtimeDashboards = await queryCompanyDashboards(user.companyId);
  if (runtimeDashboards.length) return runtimeDashboards;

  const entitledIds = new Set(
    portalDashboardEntitlements
      .filter((entitlement) => entitlement.userId === user.id || entitlement.companyId === user.companyId)
      .map((entitlement) => entitlement.dashboardId),
  );

  return portalDashboards.filter((dashboard) => entitledIds.has(dashboard.id));
}

export async function getPortalDashboardForUser(user: PortalUser, slug: string) {
  return (await getPortalDashboardsForUser(user)).find((dashboard) => dashboard.slug === slug) ?? null;
}

export function getPortalUsageAllowance(user: PortalUser): PortalUsageAllowance | null {
  if (user.role === "support_admin") return null;
  return portalUsageAllowances.find((allowance) => allowance.userId === user.id) ?? null;
}

export async function getPortalUsageStatus(user: PortalUser) {
  const allowance = getPortalUsageAllowance(user);
  if (!allowance) {
    return {
      allowance: null,
      hoursUsed: 0,
      annualHoursLimit: null,
      hoursRemaining: null,
      utilizationPct: 0,
      isLocked: false,
    };
  }

  const devOverride = await getPortalDevUsageOverrideFromCookies();
  const overriddenHoursUsed =
    devOverride === "available"
      ? Math.min(allowance.hoursUsed, Math.max(0, allowance.annualHoursLimit - 1))
      : devOverride === "exhausted"
        ? allowance.annualHoursLimit
        : allowance.hoursUsed;

  const hoursRemaining = Math.max(0, allowance.annualHoursLimit - overriddenHoursUsed);
  const utilizationPct = allowance.annualHoursLimit
    ? Math.min(100, Math.round((overriddenHoursUsed / allowance.annualHoursLimit) * 100))
    : 0;

  return {
    allowance,
    hoursUsed: overriddenHoursUsed,
    annualHoursLimit: allowance.annualHoursLimit,
    hoursRemaining,
    utilizationPct,
    isLocked: overriddenHoursUsed >= allowance.annualHoursLimit,
    devOverride,
  };
}

export function getPortalUsageLogsForUser(user: PortalUser): PortalUsageLog[] {
  if (user.role === "support_admin") {
    return [...portalUsageLogs].sort((a, b) => b.eventAt.localeCompare(a.eventAt));
  }

  return portalUsageLogs
    .filter((log) => log.userId === user.id)
    .sort((a, b) => b.eventAt.localeCompare(a.eventAt));
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

export async function getPortalTeamMembers(user: PortalUser) {
  const runtimeTeamMembers = await queryPortalTeamMembers(user.companyId);
  if (runtimeTeamMembers.length) return runtimeTeamMembers;
  return portalTeamMembers.filter((member) => member.companyId === user.companyId);
}

export function getPortalTicketsForUser(user: PortalUser): PortalTicket[] {
  if (user.role === "support_admin") {
    return [...portalTickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return portalTickets
    .filter((ticket) => ticket.requesterId === user.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getPortalTicketForUser(user: PortalUser, ticketId: string): PortalTicket | null {
  const ticket = portalTickets.find((item) => item.id === ticketId) ?? null;
  if (!ticket) return null;
  if (user.role === "support_admin" || ticket.requesterId === user.id) return ticket;
  return null;
}

export function getPortalTicketMessages(ticketId: string, includeInternal: boolean): PortalTicketMessage[] {
  return portalTicketMessages
    .filter((message) => message.ticketId === ticketId && (includeInternal || !message.isInternal))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
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
