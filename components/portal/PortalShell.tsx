import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { PreviewModeControls } from "@/components/portal/PreviewModeControls";
import { PortalSessionMenu } from "@/components/portal/PortalSessionMenu";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import type { PortalAccessContext } from "@/lib/portal/auth";
import { getPortalDevUsageOverrideFromCookies, isPortalDevBypassEnabled } from "@/lib/portal/dev-auth";

export function PortalShell({
  access,
  children,
}: {
  access: PortalAccessContext;
  children: React.ReactNode;
}) {
  return <PortalShellInner access={access}>{children}</PortalShellInner>;
}

async function PortalShellInner({
  access,
  children,
}: {
  access: PortalAccessContext;
  children: React.ReactNode;
}) {
  const devToolsEnabled = isPortalDevBypassEnabled();
  const showDevBypassSession = devToolsEnabled && !access.session;
  const usageOverride = devToolsEnabled ? await getPortalDevUsageOverrideFromCookies() : null;
  const isSupportAdmin = access.effectiveRole === "support_admin";
  const isClientWorkspace = !isSupportAdmin;
  const shellEyebrow = isSupportAdmin ? "EcoFocus Admin" : "Private EcoFocus Portal";
  const shellTitle = isSupportAdmin ? "Support workspace" : "EcoFocus Internal Portal";
  const shellDescription = isSupportAdmin
    ? "Manage support, dashboard access, and internal review work from one place."
    : access.isPreviewMode
      ? `Read-only preview of the ${access.company.name} experience from a member perspective.`
      : "Access your dashboards, manage support requests, and keep your team aligned from one private workspace.";
  const subscriberTypeLabel = access.company.subscriberType ? access.company.subscriberType.replace("_", " ") : "subscriber";
  const isCrossWorkspaceSession = access.company.id !== access.homeCompany.id;
  const showWorkspaceDirectory =
    !access.isPreviewMode &&
    (access.effectiveRole === "support_admin" || access.accessibleCompanies.length > 1);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbf8_0%,#eef5ff_100%)] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-white/70 bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_44%,#0f172a_100%)] px-6 py-5 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.65)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              {isSupportAdmin ? (
                <div className="mb-4">
                  <Image
                    src="/images/ef-logo-3.png"
                    alt="EcoFocus"
                    width={150}
                    height={44}
                    sizes="150px"
                    className="h-auto w-[150px]"
                    priority
                  />
                </div>
              ) : isClientWorkspace ? (
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-100">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{access.company.name}</p>
                    <p className="text-xs text-emerald-100/75">EcoFocus client workspace</p>
                  </div>
                </div>
              ) : null}
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">
                {isSupportAdmin ? shellEyebrow : "Client Workspace"}
              </p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-[2rem]">{shellTitle}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/85">
                {shellDescription}
              </p>
            </div>

            <PortalSessionMenu
              userName={access.user.name}
              userRoleLabel={
                access.isPreviewMode
                  ? `${access.effectiveRole.replace("_", " ")} preview`
                  : access.user.role.replace("_", " ")
              }
              workspaceName={access.company.name}
              workspaceDescription={
                access.isPreviewMode
                  ? `${access.effectiveRole.replace("_", " ")} preview · read only`
                  : isSupportAdmin
                    ? "Support administration"
                    : `${access.subscription.planName} · ${subscriberTypeLabel}`
              }
              billedToName={access.billingCompany.name}
              showBilledTo={isCrossWorkspaceSession}
              showDevBypassSession={showDevBypassSession}
              hasSession={Boolean(access.session)}
            />
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-5 xl:flex-row">
          <PortalSidebar role={access.effectiveRole} showWorkspaceDirectory={showWorkspaceDirectory} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <PreviewModeControls
        workspaceName={access.company.name}
        previewRole={access.previewRole}
        previewableRoles={access.previewableRoles}
        showWhenInactive={access.user.role === "support_admin" && isCrossWorkspaceSession}
      />
    </div>
  );
}
