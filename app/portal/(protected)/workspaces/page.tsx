import { SectionHeader } from "@/components/portal/SectionHeader";
import { WorkspacesDirectory } from "@/components/portal/WorkspacesDirectory";
import { requirePortalAccess } from "@/lib/portal/auth";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Workspaces",
  "Browse available company workspaces, switch contexts, and manage workspace access.",
);

export default async function PortalWorkspacesPage() {
  const access = await requirePortalAccess("/portal/workspaces");

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.4)]">
        <SectionHeader
          eyebrow="Workspace Directory"
          title="Company workspaces"
          description="Each company has its own workspace. Search the directory, move through pages quickly, and switch into the company you need."
        />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <WorkspacesDirectory
          companies={access.accessibleCompanies}
          currentCompanyId={access.company.id}
          isSupportAdmin={access.effectiveRole === "support_admin"}
        />
      </section>
    </div>
  );
}
