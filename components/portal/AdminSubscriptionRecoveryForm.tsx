"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalSubscription } from "@/lib/portal/types";

const subscriptionStatuses: PortalSubscription["status"][] = ["active", "trialing", "past_due"];
const billingStatuses: NonNullable<PortalSubscription["billingStatus"]>[] = [
  "not_invoiced",
  "invoice_draft",
  "invoice_sent",
  "payment_pending",
  "paid",
  "past_due",
  "payment_failed",
];

export function AdminSubscriptionRecoveryForm({
  companyId,
  planName,
  subscriptionStatus,
  billingStatus,
  renewalDate,
  stripeCustomerId,
  stripeSubscriptionId,
  billingContactName,
  billingEmail,
}: {
  companyId: string;
  planName: string;
  subscriptionStatus: PortalSubscription["status"];
  billingStatus: NonNullable<PortalSubscription["billingStatus"]>;
  renewalDate: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  billingContactName?: string | null;
  billingEmail?: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    planName,
    subscriptionStatus,
    billingStatus,
    renewalDate,
    stripeCustomerId: stripeCustomerId || "",
    stripeSubscriptionId: stripeSubscriptionId || "",
    billingContactName: billingContactName || "",
    billingEmail: billingEmail || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({});

    try {
      const response = await fetch("/api/portal/admin/subscription/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          ...form,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFeedback({ error: data.error || "We couldn't update recovery fields right now." });
        setIsSubmitting(false);
        return;
      }

      setFeedback({ success: "Billing recovery fields updated." });
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't update recovery fields right now." });
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Plan name</span>
          <input
            value={form.planName}
            onChange={(event) => setForm((current) => ({ ...current, planName: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Renewal date</span>
          <input
            type="date"
            value={form.renewalDate}
            onChange={(event) => setForm((current) => ({ ...current, renewalDate: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Subscription status</span>
          <select
            value={form.subscriptionStatus}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                subscriptionStatus: event.target.value as PortalSubscription["status"],
              }))
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {subscriptionStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Billing status</span>
          <select
            value={form.billingStatus}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                billingStatus: event.target.value as NonNullable<PortalSubscription["billingStatus"]>,
              }))
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {billingStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Stripe customer ID</span>
          <input
            value={form.stripeCustomerId}
            onChange={(event) => setForm((current) => ({ ...current, stripeCustomerId: event.target.value }))}
            placeholder="cus_..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Stripe subscription ID</span>
          <input
            value={form.stripeSubscriptionId}
            onChange={(event) => setForm((current) => ({ ...current, stripeSubscriptionId: event.target.value }))}
            placeholder="sub_..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Billing contact name</span>
          <input
            value={form.billingContactName}
            onChange={(event) => setForm((current) => ({ ...current, billingContactName: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Billing email</span>
          <input
            type="email"
            value={form.billingEmail}
            onChange={(event) => setForm((current) => ({ ...current, billingEmail: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
        Use this only for operational recovery after a failed webhook, billing correction, or manual Stripe cleanup.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save recovery fields"}
        </button>
        {feedback.success ? <p className="text-xs font-medium text-emerald-700">{feedback.success}</p> : null}
        {feedback.error ? <p className="text-xs font-medium text-rose-600">{feedback.error}</p> : null}
      </div>
    </form>
  );
}
