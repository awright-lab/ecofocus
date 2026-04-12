"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PortalPasswordSetupForm({
  initialEmail = "",
  setupToken = "",
}: {
  initialEmail?: string;
  setupToken?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/portal/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          token: setupToken,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't finish setting your password.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/login?email=${encodeURIComponent(email)}&password_set=1`);
    } catch {
      setError("We couldn't finish setting your password.");
      setIsSubmitting(false);
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

      {!setupToken ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This setup link is missing its secure token. Ask EcoFocus to resend the access email.
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-slate-800" htmlFor="password">
          Create password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={!email || !password || !confirmPassword || !setupToken || isSubmitting}
        className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {isSubmitting ? "Saving password…" : "Set password"}
      </button>

      <p className="text-sm text-slate-500">
        Once your password is saved, you can sign in with your work email and password from the portal login page.
      </p>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
