import { SupportTicketForm } from "@/components/portal/SupportTicketForm";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalDashboardsForUser } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Start Support Request",
  "Private support request form for the EcoFocus portal.",
);

export default async function NewSupportTicketPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const access = await requirePortalAccess("/portal/support/new");
  if (access.isPreviewMode) {
    return (
      <div className="space-y-6">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6">
          <SectionHeader
            eyebrow="Support"
            title="Request submission is disabled in preview"
            description="Support preview mode is read-only so EcoFocus admins can review the client experience without creating or changing account activity."
          />
        </section>
      </div>
    );
  }
  const params = (await searchParams) || {};
  const dashboardParam = params.dashboard;
  const issueTypeParam = params.issueType;
  const defaultDashboard = Array.isArray(dashboardParam) ? dashboardParam[0] : dashboardParam;
  const defaultIssueType = Array.isArray(issueTypeParam) ? issueTypeParam[0] : issueTypeParam;
  const dashboards = await getPortalDashboardsForUser(access.effectiveUser, access.company.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Support"
          title="Start a support request"
          description="Share the dashboard, issue type, and business context so the EcoFocus team can understand the issue quickly and respond with the right next steps."
        />
      </section>

      <SupportTicketForm
        userName={access.effectiveUser.name}
        userEmail={access.effectiveUser.email}
        companyName={access.company.name}
        dashboards={dashboards}
        defaultDashboard={defaultDashboard}
        defaultIssueType={defaultIssueType}
      />
    </div>
  );
}
