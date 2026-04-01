"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminSubscriptionCapacityForm({
  companyId,
  seatsPurchased,
  seatsUsed,
}: {
  companyId: string;
  seatsPurchased: number;
  seatsUsed: number;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    seatsPurchased: String(seatsPurchased),
    seatsUsed: String(seatsUsed),
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
      const response = await fetch("/api/portal/subscription/capacity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          seatsPurchased: Number(form.seatsPurchased),
          seatsUsed: Number(form.seatsUsed),
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't update seat capacity right now.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Seat capacity updated.");
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't update seat capacity right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Seats purchased</span>
          <input
            value={form.seatsPurchased}
            onChange={(event) => setForm((current) => ({ ...current, seatsPurchased: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Seats used</span>
          <input
            value={form.seatsUsed}
            onChange={(event) => setForm((current) => ({ ...current, seatsUsed: event.target.value }))}
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
          {isSubmitting ? "Saving..." : "Save seat capacity"}
        </button>
        {success ? <p className="text-xs font-medium text-emerald-700">{success}</p> : null}
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    </form>
  );
}
