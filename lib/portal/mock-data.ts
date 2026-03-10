import type {
  PortalCompany,
  PortalDashboard,
  PortalDashboardEntitlement,
  PortalHelpArticle,
  PortalSubscription,
  PortalTeamMember,
  PortalTicket,
  PortalTicketMessage,
  PortalUser,
} from "@/lib/portal/types";

export const portalUsers: PortalUser[] = [
  {
    id: "user-maya",
    name: "Maya Hernandez",
    email: "maya@greenloopfoods.com",
    companyId: "company-greenloop",
    role: "client_admin",
  },
  {
    id: "user-elliot",
    name: "Elliot Park",
    email: "elliot@greenloopfoods.com",
    companyId: "company-greenloop",
    role: "client_user",
  },
  {
    id: "user-sam",
    name: "Sam Patel",
    email: "sam@ecofocusresearch.com",
    companyId: "company-ecofocus",
    role: "support_admin",
  },
];

export const portalCompanies: PortalCompany[] = [
  { id: "company-greenloop", name: "GreenLoop Foods", subscriptionId: "sub-greenloop" },
  { id: "company-ecofocus", name: "EcoFocus Research", subscriptionId: "sub-ecofocus" },
];

export const portalSubscriptions: PortalSubscription[] = [
  {
    id: "sub-greenloop",
    planName: "Enterprise Insight Suite",
    seatsPurchased: 12,
    seatsUsed: 8,
    renewalDate: "2026-08-15",
    status: "active",
  },
  {
    id: "sub-ecofocus",
    planName: "Internal Support Workspace",
    seatsPurchased: 20,
    seatsUsed: 9,
    renewalDate: "2026-12-31",
    status: "active",
  },
];

export const portalDashboards: PortalDashboard[] = [
  {
    id: "dashboard-eco-iq",
    slug: "eco-iq-overview",
    name: "Eco IQ Overview",
    description: "Topline sustainability perception trends, brand positioning, and audience shifts.",
    accessTag: "Included",
    embedUrl: null,
    embedAccess: "public_link",
  },
  {
    id: "dashboard-category",
    slug: "category-performance",
    name: "Category Performance",
    description: "Track category-level movement, segment filters, and quarterly benchmark changes.",
    accessTag: "Licensed",
    embedUrl: null,
    embedAccess: "displayr_login_required",
  },
  {
    id: "dashboard-2024-interactive",
    slug: "interactive-dashboard-2024",
    name: "2024 Interactive Dashboard",
    description: "Interactive Displayr dashboard for the 2024 study with page-level navigation, segment analysis, and export-ready views.",
    accessTag: "2024 Study",
    embedUrl: null,
    embedAccess: "public_link",
  },
  {
    id: "dashboard-export",
    slug: "export-readiness",
    name: "Export Readiness",
    description: "Download-oriented dashboard shell for chart and table extraction workflows.",
    accessTag: "Advanced",
    embedUrl: null,
    embedAccess: "displayr_login_required",
  },
  {
    id: "dashboard-custom",
    slug: "custom-client-study",
    name: "Custom Client Study",
    description: "Reserved for project-specific Displayr embeds and custom stakeholder views.",
    accessTag: "Project",
    embedUrl: null,
    embedAccess: "displayr_login_required",
  },
];

export const portalDashboardEntitlements: PortalDashboardEntitlement[] = [
  { companyId: "company-greenloop", dashboardId: "dashboard-eco-iq" },
  { companyId: "company-greenloop", dashboardId: "dashboard-category" },
  { companyId: "company-greenloop", dashboardId: "dashboard-2024-interactive" },
  { userId: "user-maya", dashboardId: "dashboard-export" },
  { userId: "user-maya", dashboardId: "dashboard-custom" },
  { companyId: "company-ecofocus", dashboardId: "dashboard-eco-iq" },
  { companyId: "company-ecofocus", dashboardId: "dashboard-category" },
  { companyId: "company-ecofocus", dashboardId: "dashboard-2024-interactive" },
  { companyId: "company-ecofocus", dashboardId: "dashboard-export" },
  { companyId: "company-ecofocus", dashboardId: "dashboard-custom" },
];

export const portalTickets: PortalTicket[] = [
  {
    id: "TCK-1042",
    subject: "Exported chart labels are truncating in PNG output",
    dashboardName: "Category Performance",
    issueType: "Chart Export",
    priority: "high",
    status: "in_progress",
    createdAt: "2026-03-04T14:22:00Z",
    updatedAt: "2026-03-09T18:40:00Z",
    requesterId: "user-maya",
    ownerId: "user-sam",
  },
  {
    id: "TCK-1038",
    subject: "Need segment filter guidance for leadership review",
    dashboardName: "Eco IQ Overview",
    issueType: "Training Request",
    priority: "medium",
    status: "waiting_on_client",
    createdAt: "2026-02-27T10:18:00Z",
    updatedAt: "2026-03-08T16:05:00Z",
    requesterId: "user-maya",
    ownerId: "user-sam",
  },
  {
    id: "TCK-1031",
    subject: "Can’t access project dashboard after seat reassignment",
    dashboardName: "Custom Client Study",
    issueType: "Login / Access",
    priority: "urgent",
    status: "open",
    createdAt: "2026-03-09T08:50:00Z",
    updatedAt: "2026-03-09T08:50:00Z",
    requesterId: "user-elliot",
    ownerId: null,
  },
];

export const portalTicketMessages: PortalTicketMessage[] = [
  {
    id: "msg-1",
    ticketId: "TCK-1042",
    authorId: "user-maya",
    body: "The export looks correct in the dashboard preview, but the downloaded PNG cuts off long axis labels.",
    createdAt: "2026-03-04T14:22:00Z",
    isInternal: false,
  },
  {
    id: "msg-2",
    ticketId: "TCK-1042",
    authorId: "user-sam",
    body: "We reproduced this with narrow viewport exports and are reviewing the chart container sizing.",
    createdAt: "2026-03-05T09:10:00Z",
    isInternal: false,
  },
  {
    id: "msg-3",
    ticketId: "TCK-1042",
    authorId: "user-sam",
    body: "Internal note: likely needs a Displayr export preset tied to the category dashboard theme.",
    createdAt: "2026-03-05T09:22:00Z",
    isInternal: true,
  },
  {
    id: "msg-4",
    ticketId: "TCK-1038",
    authorId: "user-maya",
    body: "We want to understand which segment filters to apply before exporting a leadership-ready story deck.",
    createdAt: "2026-02-27T10:18:00Z",
    isInternal: false,
  },
  {
    id: "msg-5",
    ticketId: "TCK-1038",
    authorId: "user-sam",
    body: "Shared a recommended workflow. Waiting on confirmation of which stakeholder audience the deck targets.",
    createdAt: "2026-03-08T16:05:00Z",
    isInternal: false,
  },
  {
    id: "msg-6",
    ticketId: "TCK-1031",
    authorId: "user-elliot",
    body: "I was removed and re-added to the project team last week. The custom study dashboard now shows no access.",
    createdAt: "2026-03-09T08:50:00Z",
    isInternal: false,
  },
];

export const portalHelpArticles: PortalHelpArticle[] = [
  {
    id: "article-login",
    slug: "logging-in-to-the-portal",
    title: "Logging in to the EcoFocus portal",
    category: "Access",
    summary: "Use your work email to receive a secure sign-in link and return to your assigned portal workspace.",
    content:
      "Use your approved work email to request a one-time sign-in link. If your organization uses seat-based access, your dashboard availability depends on the assigned license and company entitlements. Contact your portal administrator if your expected dashboard is missing after login.",
  },
  {
    id: "article-exporting",
    slug: "exporting-charts-and-tables",
    title: "Exporting charts and tables",
    category: "Exports",
    summary: "Best practices for PNG, PPT, and table exports from Displayr-based dashboard views.",
    content:
      "Before exporting, apply the filters you want included in the final output and confirm whether you need presentation-ready charts or raw tables. If exported labels are truncated, capture the dashboard name and the export format used when submitting a support request.",
  },
  {
    id: "article-eco-iq",
    slug: "understanding-eco-iq",
    title: "Understanding Eco IQ",
    category: "Metrics",
    summary: "How to interpret Eco IQ scoring, benchmark ranges, and movement over time.",
    content:
      "Eco IQ combines key sustainability perception measures into a single directional index. Review the benchmark context and segment filter selections before comparing movement across reporting periods.",
  },
  {
    id: "article-segments",
    slug: "filtering-segments",
    title: "Filtering segments effectively",
    category: "Analysis",
    summary: "How to use segment filters without introducing conflicting cuts into stakeholder-ready outputs.",
    content:
      "Start with one primary segment dimension, validate sample sizes, and document any compound filters used in reporting. For custom project dashboards, keep a shared note on which segment definitions your team has standardized.",
  },
  {
    id: "article-downloads",
    slug: "downloading-data-tables",
    title: "Downloading data tables",
    category: "Exports",
    summary: "Where to find table downloads and how to request a custom extract if the standard export is not sufficient.",
    content:
      "Use the dashboard utility bar to check available table export options. If the standard table export does not meet your reporting need, submit a support ticket with the dashboard name, target cut, and required output format.",
  },
];

export const portalTeamMembers: PortalTeamMember[] = [
  {
    id: "team-1",
    companyId: "company-greenloop",
    name: "Maya Hernandez",
    email: "maya@greenloopfoods.com",
    role: "client_admin",
    status: "active",
  },
  {
    id: "team-2",
    companyId: "company-greenloop",
    name: "Elliot Park",
    email: "elliot@greenloopfoods.com",
    role: "client_user",
    status: "active",
  },
  {
    id: "team-3",
    companyId: "company-greenloop",
    name: "Jordan Lee",
    email: "jordan@greenloopfoods.com",
    role: "client_user",
    status: "invited",
  },
];
