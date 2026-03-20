"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TeamInviteForm({
  canManage,
  seatsAvailable,
}: {
  canManage: boolean;
  seatsAvailable: number;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "client_user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/portal/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string; email?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't create the invite.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(`Invite prepared for ${data.email || form.email}.`);
      setForm({ name: "", email: "", role: "client_user" });
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't create the invite.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-3">
      <input
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        placeholder="Teammate name"
        disabled={!canManage || seatsAvailable <= 0}
        className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
      <input
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        placeholder="teammate@company.com"
        disabled={!canManage || seatsAvailable <= 0}
        className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
      <select
        value={form.role}
        onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
        disabled={!canManage || seatsAvailable <= 0}
        className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <option value="client_user">client user</option>
        <option value="client_admin">client admin</option>
      </select>
      <button
        type="submit"
        disabled={!canManage || seatsAvailable <= 0 || isSubmitting}
        className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Preparing invite..." : "Prepare team invite"}
      </button>
      {!canManage ? <p className="text-xs text-slate-500">Only client admins and EcoFocus support admins can add teammates.</p> : null}
      {canManage && seatsAvailable <= 0 ? <p className="text-xs text-amber-700">All purchased seats are currently assigned. Increase the seat count before inviting another teammate.</p> : null}
      {success ? <p className="text-xs font-medium text-emerald-700">{success}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </form>
  );
}
