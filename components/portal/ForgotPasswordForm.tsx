"use client";

import { useState } from "react";

export function ForgotPasswordForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    setResetUrl(null);
    setEmailWarning(null);

    try {
      const response = await fetch("/api/portal/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as {
        error?: string;
        resetUrl?: string | null;
        emailWarning?: string | null;
      };
      if (!response.ok) {
        throw new Error(data.error || "We couldn't send a password reset email.");
      }
      setStatus("sent");
      setResetUrl(data.resetUrl || null);
      setEmailWarning(data.emailWarning || null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "We couldn't send a password reset email.");
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
        <div className="space-y-3">
          <p className="text-sm text-emerald-700">
            If this work email is set up for the EcoFocus Portal, you&apos;ll receive a password reset link shortly.
          </p>
          {emailWarning ? <p className="text-sm text-amber-700">{emailWarning}</p> : null}
          {resetUrl ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Manual reset link</p>
              <p className="mt-2 break-all">{resetUrl}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );
}
