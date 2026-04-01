import Link from "next/link";
import { ChevronDown, LogOut, Shield } from "lucide-react";
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
  const isSupportAdmin = access.user.role === "support_admin";
  const shellEyebrow = isSupportAdmin ? "EcoFocus Admin" : "Private EcoFocus Portal";
  const shellTitle = isSupportAdmin ? "Support workspace" : "Support + Data Portal";
  const shellDescription = isSupportAdmin
    ? "Manage support, dashboard access, and internal review work from one place."
    : "Licensed dashboard access, support workflows, and account management in one authenticated workspace.";
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

            <div className="relative z-20 w-full max-w-sm xl:min-w-[320px]">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
                  <div className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                          <Shield className="h-3.5 w-3.5" />
                          <span>Signed In</span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-white">{access.user.name}</p>
                        <p className="text-xs text-emerald-50/75">{access.user.role.replace("_", " ")}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 text-emerald-100 transition group-open:rotate-180" />
                    </div>
                  </div>
                </summary>
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 px-4 py-3 text-sm text-emerald-50/85 shadow-[0_24px_80px_-40px_rgba(2,44,34,0.9)] backdrop-blur">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Workspace</p>
                      <p className="mt-1 font-medium text-white">{access.company.name}</p>
                      <p className="text-xs text-emerald-50/75">
                        {isSupportAdmin ? "Support administration" : `${access.subscription.planName} · ${subscriberTypeLabel}`}
                      </p>
                    </div>
                    {isCrossWorkspaceSession ? (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Billed To</p>
                        <p className="mt-1 font-medium text-white">{access.billingCompany.name}</p>
                        <p className="text-xs text-emerald-50/75">Seats and usage stay with the subscriber that owns this login.</p>
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        href="/portal/account"
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
                      >
                        Account
                      </Link>
                      {showDevBypassSession ? (
                        <form action="/portal/dev-logout" method="post">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
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
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Log out</span>
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {!isSupportAdmin ? (
            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs text-emerald-50/80">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Private client workspace</span>
              {showDevBypassSession ? (
                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                  Test sign-in session
                </span>
              ) : null}
            </div>
          ) : null}
        </header>

        <div className="mt-6 flex flex-col gap-5 xl:flex-row">
          <PortalSidebar
            role={access.user.role}
            accessibleCompanies={access.accessibleCompanies}
            currentCompanyId={access.company.id}
          />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
