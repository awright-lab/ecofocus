import { PortalPasswordSetupForm } from "@/components/portal/PortalPasswordSetupForm";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Set Portal Password",
  "Create a password for your EcoFocus portal account.",
);

export default async function PortalSetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const emailParam = params.email;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam || "";
  const inviteParam = params.invite;
  const invite = Array.isArray(inviteParam) ? inviteParam[0] : inviteParam;
  const setupParam = params.setup;
  const setup = Array.isArray(setupParam) ? setupParam[0] : setupParam;
  const tokenParam = params.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || "";
  const setupToken = setup || token;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#effcf6_0%,#eef5ff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_42%,#0f172a_100%)] p-8 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.7)] sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">Private EcoFocus Portal</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
            Create your portal password.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
            Set a password once, then sign in with your work email and password whenever you need access to dashboards,
            support requests, or account tools.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <div className="mx-auto max-w-xl space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Account setup</p>
              <h2 className="text-2xl font-semibold text-slate-900">Set your password</h2>
              <p className="mt-2 text-sm text-slate-600">
                Use the same work email your company used for portal access.
              </p>
            </div>

            {invite === "1" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Your company has prepared portal access for this email. Create a password to finish setting up your account.
              </div>
            ) : null}

            <PortalPasswordSetupForm initialEmail={email} setupToken={setupToken} />
          </div>
        </section>
      </div>
    </div>
  );
}
