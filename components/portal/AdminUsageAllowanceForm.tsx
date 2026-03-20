"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminUsageAllowanceForm({
  companyId,
  annualHoursLimit,
  hoursUsed,
  periodStart,
  periodEnd,
}: {
  companyId: string;
  annualHoursLimit: number;
  hoursUsed: number;
  periodStart: string;
  periodEnd: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    annualHoursLimit: String(annualHoursLimit),
    hoursUsed: String(hoursUsed),
    periodStart,
    periodEnd,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/portal/usage/allowance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          annualHoursLimit: Number(form.annualHoursLimit),
          hoursUsed: Number(form.hoursUsed),
          periodStart: form.periodStart,
          periodEnd: form.periodEnd,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't update the allowance right now.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Allowance updated.");
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't update the allowance right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Annual hours</span>
          <input
            value={form.annualHoursLimit}
            onChange={(event) => setForm((current) => ({ ...current, annualHoursLimit: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Tracked hours used</span>
          <input
            value={form.hoursUsed}
            onChange={(event) => setForm((current) => ({ ...current, hoursUsed: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Period start</span>
          <input
            type="date"
            value={form.periodStart}
            onChange={(event) => setForm((current) => ({ ...current, periodStart: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Period end</span>
          <input
            type="date"
            value={form.periodEnd}
            onChange={(event) => setForm((current) => ({ ...current, periodEnd: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save allowance"}
        </button>
        {success ? <p className="text-xs font-medium text-emerald-700">{success}</p> : null}
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    </form>
  );
}
