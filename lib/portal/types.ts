export type PortalSubscriberType = "brand" | "agency" | "internal";

export type PortalRole =
  | "client_user"
  | "client_admin"
  | "agency_user"
  | "agency_admin"
  | "external_collaborator"
  | "support_admin";

export type PortalPreviewRole =
  | "client_user"
  | "client_admin"
  | "agency_user"
  | "agency_admin";

export type PortalWorkspaceMembershipRole =
  | "workspace_member"
  | "workspace_admin"
  | "external_collaborator"
  | "support_admin";

export type PortalWorkspaceVisibilityScope = "full" | "limited";

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  homeCompanyId?: string;
  role: PortalRole;
  status?: "active" | "invited" | "inactive";
};

export type PortalCompany = {
  id: string;
  name: string;
  subscriptionId: string;
  subscriberType?: PortalSubscriberType;
  logoUrl?: string | null;
  billingContactName?: string | null;
  billingEmail?: string | null;
  stripeCustomerId?: string | null;
  allowExternalCollaborators?: boolean;
  externalAccessPolicy?: string | null;
};

export type PortalWorkspaceMembership = {
  id: string;
  userId: string;
  workspaceCompanyId: string;
  membershipRole: PortalWorkspaceMembershipRole;
  visibilityScope: PortalWorkspaceVisibilityScope;
  createdAt: string;
  updatedAt: string;
};

export type PortalUsageLogFilters = {
  companyId?: string;
  workspaceCompanyId?: string;
  billingCompanyId?: string;
  userId?: string;
  dashboardId?: string;
  startAt?: string;
  endAt?: string;
  limit?: number;
};

export type PortalSubscription = {
  id: string;
  planName: string;
  seatsPurchased: number;
  seatsUsed: number;
  renewalDate: string | null;
  status: "active" | "trialing" | "past_due";
  stripeSubscriptionId?: string | null;
  billingStatus?:
    | "not_invoiced"
    | "invoice_draft"
    | "invoice_sent"
    | "payment_pending"
    | "paid"
    | "past_due"
    | "payment_failed";
  latestInvoiceId?: string | null;
  latestInvoiceStatus?: string | null;
  latestInvoiceAmountDue?: number | null;
  latestInvoiceAmountPaid?: number | null;
  latestInvoiceCurrency?: string | null;
  latestInvoiceDueAt?: string | null;
  latestInvoicePaidAt?: string | null;
};

export type PortalDashboard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  accessTag: string;
  embedUrl: string | null;
  embedAccess: "public_link" | "displayr_login_required";
  availableToAll?: boolean;
};

export type PortalDashboardConfig = {
  id: string;
  companyId: string;
  dashboardSlug: string;
  displayrEmbedUrl: string;
  isActive: boolean;
  isHidden?: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PortalDashboardEntitlement = {
  id?: string;
  userId?: string;
  companyId?: string;
  dashboardId: string;
  assignedAt?: string;
  assignedByUserId?: string | null;
  notes?: string | null;
};

export type PortalInvoiceSummary = {
  id: string;
  number: string | null;
  status: string;
  currency: string;
  amountDue: number;
  amountPaid: number;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
  description: string | null;
  createdAt: string;
  dueAt: string | null;
};

export type PortalUsageAllowance = {
  companyId: string;
  annualHoursLimit: number;
  hoursUsed: number;
  periodStart: string | null;
  periodEnd: string | null;
};

export type PortalUsageLogEvent =
  | "viewer_opened"
  | "viewer_session"
  | "allowance_exhausted"
  | "allowance_override"
  | "support_review_requested"
  | "admin_action";

export type PortalUsageLog = {
  id: string;
  userId: string;
  companyId: string;
  workspaceCompanyId?: string;
  billingCompanyId?: string;
  userHomeCompanyId?: string;
  dashboardId: string;
  dashboardName: string;
  eventType: PortalUsageLogEvent;
  eventAt: string;
  minutesTracked: number;
  source: "mock" | "portal_runtime";
  notes?: string;
  metadata?: Record<string, unknown>;
};

export type PortalTicket = {
  id: string;
  companyId: string;
  subject: string;
  dashboardName: string;
  issueType: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_on_client" | "completed" | "archived";
  completedAt?: string | null;
  clientReviewedCompletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  requesterId: string;
  ownerId: string | null;
};

export type PortalTicketMessage = {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  createdAt: string;
  isInternal: boolean;
};

export type PortalHelpArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
};

export type PortalTeamMember = {
  id: string;
  companyId: string;
  homeCompanyId?: string;
  homeCompanyName?: string | null;
  name: string;
  email: string;
  role: PortalRole;
  status: "active" | "invited" | "inactive";
};

export type PortalTeamInvite = {
  id: string;
  companyId: string;
  invitedUserId?: string | null;
  invitedName: string;
  invitedEmail: string;
  invitedRole: Exclude<PortalRole, "external_collaborator" | "support_admin">;
  invitedByUserId: string;
  inviteUrl: string;
  deliveryStatus: "sent" | "manual_only" | "failed";
  deliveryMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  lastSentAt?: string | null;
};
