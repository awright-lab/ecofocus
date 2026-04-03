'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserSupabase, setPortalRememberPreference } from "@/lib/supabase/client";

export default function LoginForm({
  redirect,
  callbackPath = "/auth/confirm",
  initialEmail = "",
}: {
  redirect: string;
  callbackPath?: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [mode, setMode] = useState<"password" | "magic_link">("password");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const forgotPasswordHref = redirect.startsWith("/portal") ? "/portal/forgot-password" : "/forgot-password";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const supabase = getBrowserSupabase();
      // Use the exact origin the user is on to avoid PKCE domain mismatches (www vs apex).
      const siteUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "";
      const redirectTarget = redirect || "/portal";
      let authError: Error | null = null;
      setPortalRememberPreference(remember);

      if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        authError = error;
      } else {
        const callbackUrl = new URL(callbackPath, siteUrl);
        callbackUrl.searchParams.set("next", redirectTarget);
        if (remember) {
          callbackUrl.searchParams.set("remember", "1");
        }
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: callbackUrl.toString(),
          },
        });
        authError = error;
      }

      if (authError) throw authError;

      if (mode === "password") {
        router.replace(redirectTarget);
        router.refresh();
        return;
      }

      setStatus("sent");
    } catch (err: any) {
      const rawMessage = err?.message || "Sign-in failed";
      const message =
        rawMessage === "Failed to fetch"
          ? "Unable to reach the authentication service. Check the deployed Supabase URL/DNS configuration."
          : rawMessage.includes("Invalid login credentials")
            ? "That username or password did not match our records."
            : rawMessage;
      setError(message);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-12 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Secure access</p>
        <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-600">
          Use your work email as your username. Password sign-in is available below, with magic links kept as a fallback.
        </p>
      </div>

      <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setStatus("idle");
            setError(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "password" ? "bg-slate-950 text-white" : "text-slate-700 hover:text-slate-950"
          }`}
        >
          Username + password
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("magic_link");
            setStatus("idle");
            setError(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "magic_link" ? "bg-slate-950 text-white" : "text-slate-700 hover:text-slate-950"
          }`}
        >
          Email link
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-800" htmlFor="email">
            Username
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

        {mode === "password" ? (
          <div>
            <label className="block text-sm font-medium text-gray-800" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
        ) : null}

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-slate-700">
            <span className="block font-medium text-slate-900">Remember this browser</span>
            Keep me signed in on this device for up to 30 days unless I log out.
          </span>
        </label>

        <button
          type="submit"
          disabled={!email || status === "sending" || (mode === "password" && !password)}
          className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {status === "sending"
            ? mode === "password"
              ? "Signing in…"
              : "Sending link…"
            : mode === "password"
              ? "Sign in"
              : "Send sign-in link"}
        </button>

        {mode === "magic_link" && status === "sent" && (
          <p className="text-sm text-emerald-700">
            Check your email for the sign-in link. It will bring you back to {redirect || "/portal"}.
          </p>
        )}
        {mode === "password" ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">
              Password sign-in works for portal accounts that already have a Supabase Auth password set.
            </p>
            <Link href={forgotPasswordHref} className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
              Forgot your password?
            </Link>
          </div>
        ) : null}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
