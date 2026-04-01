import LoginForm from "@/app/login/LoginForm";
import LoginHandler from "@/app/login/LoginHandler";
import { isPortalDevBypassEnabled } from "@/lib/portal/dev-auth";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Portal Login",
  "Secure sign-in entry for the private EcoFocus support and data portal.",
);

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const redirectParam = params.redirect;
  const redirect = Array.isArray(redirectParam) ? redirectParam[0] : redirectParam || "/portal/home";
  const emailParam = params.email;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam || "";
  const inviteParam = params.invite;
  const invite = Array.isArray(inviteParam) ? inviteParam[0] : inviteParam;
  const codeParam = params.code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;
  const tokenHashParam = params.token_hash;
  const tokenHash = Array.isArray(tokenHashParam) ? tokenHashParam[0] : tokenHashParam;
  const typeParam = params.type;
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;
  const showDevBypass = isPortalDevBypassEnabled();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#effcf6_0%,#eef5ff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_42%,#0f172a_100%)] p-8 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.7)] sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">Private EcoFocus Portal</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
            Licensed dashboards, support requests, and account access in one secure workspace.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
            This portal is an authenticated EcoFocus workspace for licensed dashboard access, support conversations, and account administration.
            Search indexing is disabled and access stays scoped to approved portal users and company assignments.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Portal dashboard and licensed dashboard access",
              "Support center, ticketing, and knowledge base",
              "Account, subscription, and seat management scaffold",
              "Role-protected internal support admin workflow",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm text-white/90">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/95 p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          <LoginHandler code={code} tokenHash={tokenHash} type={type} redirect={redirect} />
          <LoginForm redirect={redirect} initialEmail={email} />
          {invite === "1" ? (
            <div className="px-4 pb-4 text-sm text-emerald-700 sm:px-0">
              Your company has prepared portal access for this email. Sign in with the same work email to activate your account.
            </div>
          ) : null}
          {showDevBypass ? (
            <div className="mx-auto mt-6 max-w-xl border-t border-slate-200 px-4 pt-6 sm:px-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">Dev Bypass</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Test portal roles without email auth</h2>
              <p className="mt-2 text-sm text-slate-600">
                Enabled by `PORTAL_DEV_BYPASS=true`. This is for non-production testing only.
              </p>
              <form action="/portal/dev-login" method="post" className="mt-4 space-y-3">
                <input type="hidden" name="redirect" value={redirect} />
                <div className="grid gap-3">
                  {[
                    ["client_user", "Client User"],
                    ["client_admin", "Client Admin"],
                    ["agency_user", "Agency User"],
                    ["agency_admin", "Agency Admin"],
                    ["support_admin", "Support Admin"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="submit"
                      name="role"
                      value={value}
                      className="flex items-center justify-between rounded-2xl border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50"
                    >
                      <span>{label}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{value}</span>
                    </button>
                  ))}
                </div>
              </form>
            </div>
          ) : null}
          {params.error === "auth_callback_failed" ? (
            <div className="px-4 pb-4 text-sm text-rose-600 sm:px-0">
              The sign-in link could not be completed. Start with a fresh sign-in email and open it in the same browser you used to request it. If it still fails,
              the Supabase email template likely needs the token-hash SSR callback format.
            </div>
          ) : null}
          {params.error === "not_provisioned" ? (
            <div className="px-4 pb-4 text-sm text-rose-600 sm:px-0">
              This email address is not yet set up for the EcoFocus portal. Ask your company admin or EcoFocus Support to send an invitation first.
            </div>
          ) : null}
          {params.error === "access_paused" ? (
            <div className="px-4 pb-4 text-sm text-rose-600 sm:px-0">
              Portal access for this account is currently paused. Contact your company admin or EcoFocus Support if you need access restored.
            </div>
          ) : null}
          {params.error === "invalid_dev_role" ? (
            <div className="px-4 pb-4 text-sm text-rose-600 sm:px-0">
              Invalid dev bypass role selection.
            </div>
          ) : null}
          {params.password_set === "1" ? (
            <div className="px-4 pb-4 text-sm text-emerald-700 sm:px-0">
              Your password has been saved. Sign in with your work email and password below.
            </div>
          ) : null}
          {params.password_reset === "1" ? (
            <div className="px-4 pb-4 text-sm text-emerald-700 sm:px-0">
              Your password has been reset. Sign in with your work email and new password below.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
