export type PortalRole = "client_user" | "client_admin" | "support_admin";

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  role: PortalRole;
};

export type PortalCompany = {
  id: string;
  name: string;
  subscriptionId: string;
};

export type PortalSubscription = {
  id: string;
  planName: string;
  seatsPurchased: number;
  seatsUsed: number;
  renewalDate: string;
  status: "active" | "trialing" | "past_due";
};

export type PortalDashboard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  accessTag: string;
  embedUrl: string | null;
  embedAccess: "public_link" | "displayr_login_required";
};

export type PortalDashboardEntitlement = {
  userId?: string;
  companyId?: string;
  dashboardId: string;
};

export type PortalTicket = {
  id: string;
  subject: string;
  dashboardName: string;
  issueType: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_on_client" | "resolved";
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
  name: string;
  email: string;
  role: PortalRole;
  status: "active" | "invited" | "inactive";
};
