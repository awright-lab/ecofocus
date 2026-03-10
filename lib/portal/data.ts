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
  portalUsers,
} from "@/lib/portal/mock-data";
import { getPortalDevUsageOverrideFromCookies } from "@/lib/portal/dev-auth";
import type {
  PortalDashboard,
  PortalHelpArticle,
  PortalRole,
  PortalTicket,
  PortalTicketMessage,
  PortalUsageAllowance,
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

export function getPortalUserByEmail(email?: string | null): PortalUser | null {
  if (!email) return null;
  return portalUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getPortalDashboardsForUser(user: PortalUser): PortalDashboard[] {
  const entitledIds = new Set(
    portalDashboardEntitlements
      .filter((entitlement) => entitlement.userId === user.id || entitlement.companyId === user.companyId)
      .map((entitlement) => entitlement.dashboardId),
  );

  return portalDashboards.filter((dashboard) => entitledIds.has(dashboard.id));
}

export function getPortalDashboardForUser(user: PortalUser, slug: string) {
  return getPortalDashboardsForUser(user).find((dashboard) => dashboard.slug === slug) ?? null;
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

export function getPortalCompany(user: PortalUser) {
  return portalCompanies.find((company) => company.id === user.companyId) ?? null;
}

export function getPortalSubscription(user: PortalUser) {
  const company = getPortalCompany(user);
  if (!company) return null;
  return portalSubscriptions.find((subscription) => subscription.id === company.subscriptionId) ?? null;
}

export function getPortalTeamMembers(user: PortalUser) {
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
