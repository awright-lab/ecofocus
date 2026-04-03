"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminWorkspaceInvoiceForm({
  companyId,
  companyName,
  billingEmail,
}: {
  companyId: string;
  companyName: string;
  billingEmail?: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    amountUsd: "",
    description: "",
    memo: "",
    daysUntilDue: "30",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setInvoiceUrl(null);

    try {
      const response = await fetch("/api/portal/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          amountUsd: Number(form.amountUsd),
          description: form.description,
          memo: form.memo,
          daysUntilDue: Number(form.daysUntilDue),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        invoice?: { hostedInvoiceUrl?: string | null };
      };

      if (!response.ok) {
        setError(data.error || "We couldn't send the invoice right now.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(`Invoice created and sent for ${companyName}.`);
      setInvoiceUrl(data.invoice?.hostedInvoiceUrl || null);
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't send the invoice right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
        {billingEmail ? (
          <>Invoices will be sent to <span className="font-semibold text-slate-900">{billingEmail}</span>.</>
        ) : (
          <>Add a billing email to this workspace before sending invoices.</>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Amount (USD)</span>
          <input
            value={form.amountUsd}
            onChange={(event) => setForm((current) => ({ ...current, amountUsd: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="25000"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Due in days</span>
          <input
            value={form.daysUntilDue}
            onChange={(event) => setForm((current) => ({ ...current, daysUntilDue: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Description</span>
        <input
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="EcoFocus workspace licensing and annual dashboard hours"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Internal note / footer</span>
        <textarea
          value={form.memo}
          onChange={(event) => setForm((current) => ({ ...current, memo: event.target.value }))}
          rows={3}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="Optional payment instructions or agreement note"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !billingEmail}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Create and send invoice"}
        </button>
        {invoiceUrl ? (
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Open invoice
          </a>
        ) : null}
        {success ? <p className="text-xs font-medium text-emerald-700">{success}</p> : null}
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    </form>
  );
}
