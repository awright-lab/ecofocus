import LoginForm from "@/app/login/LoginForm";
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

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#effcf6_0%,#eef5ff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_42%,#0f172a_100%)] p-8 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.7)] sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">EcoFocus client portal</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
            Your dashboards and support, all in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
            Sign in to access licensed dashboards, review usage, and stay on top of support requests for your workspace.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Licensed dashboards",
              "Usage and access overview",
              "Support requests and updates",
              "Account and billing insights",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm text-white/90">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/95 p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
          <LoginForm redirect={redirect} initialEmail={email} />
          {invite === "1" ? (
            <div className="px-4 pb-4 text-sm text-emerald-700 sm:px-0">
              Your company has prepared portal access for this email. Sign in with the same work email to activate your account.
            </div>
          ) : null}
          {params.error === "auth_callback_failed" ? (
            <div className="px-4 pb-4 text-sm text-rose-600 sm:px-0">
              Sign-in failed. Please try again or reset your password if the issue persists.
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
