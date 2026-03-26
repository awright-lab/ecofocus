import Link from "next/link";
import { ResetPasswordForm } from "@/components/portal/ResetPasswordForm";
import { ResetPasswordHandler } from "@/components/portal/ResetPasswordHandler";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Reset Password",
  "Choose a new password for your EcoFocus portal account.",
);

export default async function PortalResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const tokenParam = params.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || "";
  const codeParam = params.code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;
  const tokenHashParam = params.token_hash;
  const tokenHash = Array.isArray(tokenHashParam) ? tokenHashParam[0] : tokenHashParam;
  const typeParam = params.type;
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#effcf6_0%,#eef5ff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,#0f766e_0%,#064e3b_42%,#0f172a_100%)] p-8 text-white shadow-[0_24px_80px_-40px_rgba(2,44,34,0.7)] sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">Private EcoFocus Portal</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
            Choose a new password.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
            Once your new password is saved, you can return to the portal login page and sign in with your work email and password.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <div className="mx-auto max-w-xl space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Password reset</p>
              <h2 className="text-2xl font-semibold text-slate-900">Set your new password</h2>
            </div>

            <ResetPasswordHandler code={code} tokenHash={tokenHash} type={type} />
            <ResetPasswordForm token={token} />

            <Link href="/login" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
              Back to portal login
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
