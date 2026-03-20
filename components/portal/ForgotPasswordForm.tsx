"use client";

import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";

export function ForgotPasswordForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const supabase = getBrowserSupabase();
      const siteUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "";
      const callbackUrl = new URL("/auth/confirm", siteUrl);
      callbackUrl.searchParams.set("next", "/reset-password");

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl.toString(),
      });

      if (resetError) throw resetError;
      setStatus("sent");
    } catch (err: any) {
      const message =
        err?.message === "Failed to fetch"
          ? "Unable to reach the authentication service. Check the deployed Supabase URL/DNS configuration."
          : err?.message || "We couldn't send a password reset email.";
      setError(message);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-800" htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          autoComplete="email"
          placeholder="you@company.com"
        />
      </div>

      <button
        type="submit"
        disabled={!email || status === "sending"}
        className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === "sending" ? "Sending reset link…" : "Send password reset link"}
      </button>

      {status === "sent" ? (
        <p className="text-sm text-emerald-700">
          Check your email for a password reset link. It will bring you back to the portal to choose a new password.
        </p>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
