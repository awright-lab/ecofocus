import { Building2, LogOut, Shield } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbf8_0%,#eef5ff_100%)] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-white/70 bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_44%,#0f172a_100%)] px-6 py-6 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.65)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">
                Private EcoFocus Portal
              </p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Support + Data Portal</h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-50/85 sm:text-base">
                Licensed dashboard access, support workflows, and account management in one authenticated workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Company</span>
                </div>
                <p className="mt-2 text-sm font-medium text-white">{access.company.name}</p>
                <p className="text-xs text-emerald-50/75">{access.subscription.planName}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Signed In</span>
                </div>
                <p className="mt-2 text-sm font-medium text-white">{access.user.name}</p>
                <p className="text-xs text-emerald-50/75">{access.user.role.replace("_", " ")}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-emerald-50/80">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Private client workspace</span>
            {devToolsEnabled ? (
              <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                Dev tools enabled
              </span>
            ) : null}
            {showDevBypassSession ? (
              <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-amber-100">
                Dev bypass session
              </span>
            ) : null}
            {devToolsEnabled && usageOverride ? (
              <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1.5 text-sky-100">
                Usage override: {usageOverride}
              </span>
            ) : null}
            {showDevBypassSession ? (
              <form action="/portal/dev-logout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>End dev session</span>
                </button>
              </form>
            ) : null}
            {devToolsEnabled ? (
              <form action="/portal/dev-usage" method="post" className="inline-flex">
                <input type="hidden" name="redirect" value="/portal/home" />
                <button
                  type="submit"
                  name="mode"
                  value="available"
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
                >
                  Hours available
                </button>
              </form>
            ) : null}
            {devToolsEnabled ? (
              <form action="/portal/dev-usage" method="post" className="inline-flex">
                <input type="hidden" name="redirect" value="/portal/home" />
                <button
                  type="submit"
                  name="mode"
                  value="exhausted"
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
                >
                  Hours exhausted
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
