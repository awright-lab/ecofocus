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
  PortalSubscription,
  PortalTeamInvite,
  PortalTicket,
  PortalTicketMessage,
  PortalTeamMember,
  PortalUsageAllowance,
  PortalUsageLogFilters,
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

async function queryPortalCompanies(): Promise<PortalCompany[] | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_companies")
      .select("id, name, subscription_id")
      .order("name", { ascending: true });

    if (error) {
      console.warn("[portal/data] portal_companies list lookup failed.", { error: error.message });
      return null;
    }

    return (data || []).map((company) => ({
      id: company.id,
      name: company.name,
      subscriptionId: company.subscription_id,
    }));
  } catch (error) {
    console.warn("[portal/data] portal_companies list storage unavailable.", {
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

async function queryPortalUsersByIds(userIds: string[]): Promise<PortalUser[] | null> {
  if (!userIds.length) return [];

  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_users")
      .select("id, name, email, company_id, role, status")
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
      .select("id, company_id, invited_user_id, invited_name, invited_email, invited_role, invited_by_user_id, invite_url, delivery_status, delivery_message, created_at, updated_at, last_sent_at")
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
      invitedRole: invite.invited_role === "client_admin" ? "client_admin" : "client_user",
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

async function queryPortalDashboardConfigs(companyId: string): Promise<PortalDashboardConfig[] | null> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_dashboard_configs")
      .select("id, company_id, dashboard_slug, displayr_embed_url, is_active, notes, created_at, updated_at")
      .eq("company_id", companyId)
      .order("dashboard_slug", { ascending: true });

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
      notes: config.notes || null,
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

async function queryPortalUsageLogs(companyId: string): Promise<PortalUsageLog[]> {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_usage_logs")
      .select("id, user_id, company_id, dashboard_id, dashboard_name, event_type, event_at, minutes_tracked, source, notes")
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
      dashboardId: String(log.dashboard_id),
      dashboardName: String(log.dashboard_name),
      eventType: log.event_type,
      eventAt: String(log.event_at),
      minutesTracked: Number(log.minutes_tracked || 0),
      source: log.source === "portal_runtime" ? "portal_runtime" : "mock",
      notes: log.notes || undefined,
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
      .select("id, user_id, company_id, dashboard_id, dashboard_name, event_type, event_at, minutes_tracked, source, notes")
      .order("event_at", { ascending: false })
      .limit(filters.limit ?? 100);

    if (filters.companyId) query = query.eq("company_id", filters.companyId);
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
      dashboardId: String(log.dashboard_id),
      dashboardName: String(log.dashboard_name),
      eventType: log.event_type,
      eventAt: String(log.event_at),
      minutesTracked: Number(log.minutes_tracked || 0),
      source: log.source === "portal_runtime" ? "portal_runtime" : "mock",
      notes: log.notes || undefined,
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

async function queryPortalTickets(user: PortalUser): Promise<PortalTicket[] | null> {
  try {
    const admin = getServiceSupabase();
    const query = admin
      .from("portal_tickets")
      .select("id, company_id, subject, dashboard_name, issue_type, priority, status, created_at, updated_at, requester_id, owner_id")
      .order("updated_at", { ascending: false });

    if (user.role === "support_admin") {
      const { data, error } = await query.limit(100);

      if (error) {
        console.warn("[portal/data] portal_tickets support lookup failed.", { userId: user.id, error: error.message });
        return null;
      }

      return (data || []).map((ticket) => ({
        id: ticket.id,
        companyId: ticket.company_id,
        subject: ticket.subject,
        dashboardName: ticket.dashboard_name,
        issueType: ticket.issue_type,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        requesterId: ticket.requester_id,
        ownerId: ticket.owner_id,
      }));
    }

    const { data, error } = await query.eq("requester_id", user.id).limit(100);

    if (error) {
      console.warn("[portal/data] portal_tickets user lookup failed.", { userId: user.id, error: error.message });
      return null;
    }

    return (data || []).map((ticket) => ({
      id: ticket.id,
      companyId: ticket.company_id,
      subject: ticket.subject,
      dashboardName: ticket.dashboard_name,
      issueType: ticket.issue_type,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      requesterId: ticket.requester_id,
      ownerId: ticket.owner_id,
    }));
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

export async function getPortalCompanies() {
  const runtimeCompanies = await queryPortalCompanies();
  if (runtimeCompanies) return runtimeCompanies;
  return [...portalCompanies].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPortalDashboardCatalog() {
  return [...portalDashboards].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPortalDashboardConfigsByCompany(companyId: string) {
  const runtimeConfigs = await queryPortalDashboardConfigs(companyId);
  if (runtimeConfigs) return runtimeConfigs;

  return portalDashboards
    .filter((dashboard) => portalDashboardEntitlements.some((entitlement) => entitlement.companyId === companyId && entitlement.dashboardId === dashboard.id))
    .map((dashboard) => ({
      id: `mock-${companyId}-${dashboard.slug}`,
      companyId,
      dashboardSlug: dashboard.slug,
      displayrEmbedUrl: dashboard.embedUrl || "",
      isActive: true,
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
}

export async function getPortalUsageAllowanceByCompany(companyId: string) {
  const runtimeAllowance = await queryPortalUsageAllowance(companyId);
  if (runtimeAllowance) return runtimeAllowance;
  return portalUsageAllowances.find((allowance) => allowance.companyId === companyId) ?? null;
}

export async function getPortalUsageStatus(user: PortalUser) {
  const allowance = user.role === "support_admin" ? null : await getPortalUsageAllowanceByCompany(user.companyId);
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

  const loggedUsage = await getPortalUsageLogsForAdmin({
    companyId: user.companyId,
    startAt: `${allowance.periodStart}T00:00:00Z`,
    endAt: `${allowance.periodEnd}T23:59:59Z`,
    limit: 500,
  });
  const loggedHours = Number((loggedUsage.reduce((total, log) => total + log.minutesTracked, 0) / 60).toFixed(1));

  const devOverride = await getPortalDevUsageOverrideFromCookies();
  const trackedHoursUsed = Math.max(allowance.hoursUsed, loggedHours);
  const overriddenHoursUsed =
    devOverride === "available"
      ? Math.min(trackedHoursUsed, Math.max(0, allowance.annualHoursLimit - 1))
      : devOverride === "exhausted"
        ? allowance.annualHoursLimit
        : trackedHoursUsed;

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

export async function getPortalUsageLogsForUser(user: PortalUser): Promise<PortalUsageLog[]> {
  const runtimeLogs = await queryPortalUsageLogs(user.companyId);
  if (runtimeLogs.length) {
    if (user.role === "support_admin") {
      return runtimeLogs;
    }
    return runtimeLogs.filter((log) => log.companyId === user.companyId);
  }

  if (user.role === "support_admin") {
    return [...portalUsageLogs].sort((a, b) => b.eventAt.localeCompare(a.eventAt));
  }

  return portalUsageLogs
    .filter((log) => log.companyId === user.companyId)
    .sort((a, b) => b.eventAt.localeCompare(a.eventAt));
}

export async function getPortalUsageLogsForAdmin(filters: PortalUsageLogFilters = {}) {
  const runtimeLogs = await queryPortalUsageLogsWithFilters(filters);
  if (runtimeLogs) return runtimeLogs;

  return portalUsageLogs
    .filter((log) => {
      if (filters.companyId && log.companyId !== filters.companyId) return false;
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.dashboardId && log.dashboardId !== filters.dashboardId) return false;
      if (filters.startAt && log.eventAt < filters.startAt) return false;
      if (filters.endAt && log.eventAt > filters.endAt) return false;
      return true;
    })
    .sort((a, b) => b.eventAt.localeCompare(a.eventAt))
    .slice(0, filters.limit ?? 100);
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

export async function getPortalTicketsForUser(user: PortalUser): Promise<PortalTicket[]> {
  const runtimeTickets = await queryPortalTickets(user);
  if (runtimeTickets) return runtimeTickets;

  if (user.role === "support_admin") {
    return [...portalTickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return portalTickets
    .filter((ticket) => ticket.requesterId === user.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPortalTicketForUser(user: PortalUser, ticketId: string): Promise<PortalTicket | null> {
  const runtimeTickets = await queryPortalTickets(user);
  if (runtimeTickets) {
    return runtimeTickets.find((item) => item.id === ticketId) ?? null;
  }

  const ticket = portalTickets.find((item) => item.id === ticketId) ?? null;
  if (!ticket) return null;
  if (user.role === "support_admin" || ticket.requesterId === user.id) return ticket;
  return null;
}

export async function getPortalTicketMessages(ticketId: string, includeInternal: boolean): Promise<PortalTicketMessage[]> {
  const runtimeMessages = await queryPortalTicketMessages(ticketId, includeInternal);
  if (runtimeMessages) return runtimeMessages;

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
