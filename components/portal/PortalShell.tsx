import { Building2, LogOut, Shield } from "lucide-react";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { WorkspaceSwitcher } from "@/components/portal/WorkspaceSwitcher";
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
  const isSupportAdmin = access.user.role === "support_admin";
  const shellEyebrow = isSupportAdmin ? "EcoFocus Admin" : "Private EcoFocus Portal";
  const shellTitle = isSupportAdmin ? "Support workspace" : "Support + Data Portal";
  const shellDescription = isSupportAdmin
    ? "Manage support, dashboard access, and internal review work from one place."
    : "Licensed dashboard access, support workflows, and account management in one authenticated workspace.";
  const companyChipLabel = isSupportAdmin ? "Internal Workspace" : "Company";
  const workspaceChipText = isSupportAdmin ? "Support administration" : access.subscription.planName;
  const workspaceBadge = isSupportAdmin ? "Internal admin view" : "Private client workspace";
  const showWorkspaceSwitcher = access.accessibleCompanies.length > 1;
  const subscriberTypeLabel = access.company.subscriberType ? access.company.subscriberType.replace("_", " ") : "subscriber";
  const isCrossWorkspaceSession = access.company.id !== access.homeCompany.id;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbf8_0%,#eef5ff_100%)] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-white/70 bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_44%,#0f172a_100%)] px-6 py-5 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.65)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">
                {shellEyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-[2rem]">{shellTitle}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/85">
                {shellDescription}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[560px] xl:max-w-[760px] xl:grid-cols-2">
              {showWorkspaceSwitcher ? (
                <WorkspaceSwitcher
                  companies={access.accessibleCompanies.map((company) => ({
                    id: company.id,
                    name: company.name,
                    subscriberType: company.subscriberType,
                  }))}
                  currentCompanyId={access.company.id}
                />
              ) : null}
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{companyChipLabel}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-white">{access.company.name}</p>
                <p className="text-xs text-emerald-50/75">
                  {workspaceChipText}
                  {!isSupportAdmin ? ` · ${subscriberTypeLabel}` : ""}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Signed In</span>
                </div>
                <p className="mt-2 text-sm font-medium text-white">{access.user.name}</p>
                <p className="text-xs text-emerald-50/75">{access.user.role.replace("_", " ")}</p>
              </div>
              {isCrossWorkspaceSession ? (
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Billed To</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">{access.billingCompany.name}</p>
                  <p className="text-xs text-emerald-50/75">Seats and usage stay with the subscriber that owns this login.</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs text-emerald-50/80">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{workspaceBadge}</span>
            {devToolsEnabled && isSupportAdmin ? (
              <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                Testing mode
              </span>
            ) : null}
            {showDevBypassSession ? (
              <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                Test sign-in session
              </span>
            ) : null}
            {devToolsEnabled && isSupportAdmin && usageOverride ? (
              <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1.5 text-sky-100">
                {usageOverride === "available" ? "Hours set to available" : "Hours set to exhausted"}
              </span>
            ) : null}
            {showDevBypassSession ? (
              <form action="/portal/dev-logout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>End test session</span>
                </button>
              </form>
            ) : null}
            {access.session ? (
              <form action="/api/portal/logout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              </form>
            ) : null}
            {devToolsEnabled && isSupportAdmin ? (
              <form action="/portal/dev-usage" method="post" className="inline-flex">
                <input type="hidden" name="redirect" value="/portal/home" />
                <button
                  type="submit"
                  name="mode"
                  value="available"
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
                >
                  Set hours available
                </button>
              </form>
            ) : null}
            {devToolsEnabled && isSupportAdmin ? (
              <form action="/portal/dev-usage" method="post" className="inline-flex">
                <input type="hidden" name="redirect" value="/portal/home" />
                <button
                  type="submit"
                  name="mode"
                  value="exhausted"
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
                >
                  Set hours exhausted
                </button>
              </form>
            ) : null}
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-5 xl:flex-row">
          <PortalSidebar role={access.user.role} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
