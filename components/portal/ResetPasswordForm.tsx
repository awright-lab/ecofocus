"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token = "" }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasValidToken = Boolean(token);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (!hasValidToken) {
      setError("This password reset link is invalid or has expired.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/portal/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = (await response.json()) as { error?: string; email?: string };
      if (!response.ok) {
        throw new Error(data.error || "We couldn't reset your password.");
      }

      router.push(`/login${data.email ? `?email=${encodeURIComponent(data.email)}&password_reset=1` : "?password_reset=1"}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "We couldn't reset your password.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-800" htmlFor="password">
          New password
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
          Confirm new password
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
          placeholder="Re-enter your new password"
        />
      </div>

      <button
        type="submit"
        disabled={!password || !confirmPassword || isSubmitting || !hasValidToken}
        className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {isSubmitting ? "Saving new password…" : "Reset password"}
      </button>

      <p className="text-sm text-slate-500">
        After your password is updated, you’ll return to the login screen and sign in with your work email and new password.
      </p>

      {!hasValidToken ? (
        <p className="text-sm text-rose-600">
          This reset link is missing or invalid. Request a fresh password reset email from the portal.
        </p>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
