'use client';

import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";

export default function LoginForm({ redirect }: { redirect: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const supabase = getBrowserSupabase();
      // Hardcoded production URL for magic links
      const siteUrl = "https://www.ecofocusresearch.com";
      const redirectTo = `${siteUrl}${redirect || "/portal"}`;
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      if (authError) throw authError;
      setStatus("sent");
    } catch (err: any) {
      setError(err.message || "Sign-in failed");
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-12 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Secure access</p>
        <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-600">
          Enter your email to get a one-time sign-in link. You’ll be redirected to the portal after login.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-800" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            autoComplete="email"
            placeholder="you@company.com"
          />
        </div>

        <button
          type="submit"
          disabled={!email || status === "sending"}
          className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {status === "sending" ? "Sending link…" : "Send sign-in link"}
        </button>

        {status === "sent" && (
          <p className="text-sm text-emerald-700">
            Check your email for the sign-in link. It will bring you back to {redirect || "/portal"}.
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
