import LoginForm from "@/app/login/LoginForm";
import LoginHandler from "@/app/login/LoginHandler";
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
  const codeParam = params.code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#effcf6_0%,#eef5ff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_42%,#0f172a_100%)] p-8 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.7)] sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">Private EcoFocus Portal</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
            Licensed dashboards, support requests, and account access in one secure workspace.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
            This portal is built as an authenticated product surface. Search indexing is disabled, sitemap inclusion is excluded,
            and future integrations for Displayr embeds, seat licensing, support workflows, and subscription controls plug into
            this shell.
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
          <LoginHandler code={code} redirect={redirect} />
          <LoginForm redirect={redirect} />
          {params.error === "auth_callback_failed" ? (
            <div className="px-4 pb-4 text-sm text-rose-600 sm:px-0">
              The magic-link callback could not be completed. If this persists, update the Supabase email template to use
              the token-hash SSR flow and ensure the callback opens in the same browser session.
            </div>
          ) : null}
          <div className="px-4 pb-4 text-xs text-slate-500 sm:px-0">
            TODO: replace email-link-only access with production auth policy, role claims, and tenant mapping.
          </div>
        </section>
      </div>
    </div>
  );
}
