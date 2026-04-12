"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DEFAULT_ENTERPRISE_SEATS = 12;
const DEFAULT_ENTERPRISE_ANNUAL_HOURS = 120;

export function AdminWorkspaceUpgradeCard({
  annualHoursLimit,
  companyId,
  companyName,
  planName,
  seatsPurchased,
  stripeCustomerId,
}: {
  annualHoursLimit?: number | null;
  companyId: string;
  companyName: string;
  planName: string;
  seatsPurchased?: number | null;
  stripeCustomerId?: string | null;
}) {
  const router = useRouter();
  const isDemoSuite = planName === "Demo Suite";
  const [targetSeats, setTargetSeats] = useState(String(Math.max(seatsPurchased || 0, DEFAULT_ENTERPRISE_SEATS)));
  const [targetHours, setTargetHours] = useState(String(Math.max(annualHoursLimit || 0, DEFAULT_ENTERPRISE_ANNUAL_HOURS)));
  const [createStripeCustomer, setCreateStripeCustomer] = useState(!stripeCustomerId);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});

  async function upgradeWorkspace() {
    setIsUpgrading(true);
    setFeedback({});

    try {
      const response = await fetch(`/api/portal/admin/workspaces/${encodeURIComponent(companyId)}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatsPurchased: Number(targetSeats),
          annualHoursLimit: Number(targetHours),
          createStripeCustomer,
        }),
      });
      const data = (await response.json()) as {
        annualHoursLimit?: number;
        error?: string;
        planName?: string;
        seatsPurchased?: number;
        stripeCustomerId?: string | null;
      };

      if (!response.ok) {
        setFeedback({ error: data.error || "We couldn't upgrade this workspace." });
        setIsUpgrading(false);
        return;
      }

      setFeedback({
        success: `${companyName} is now on ${data.planName || "Enterprise Insight Suite"} with ${
          data.seatsPurchased || targetSeats
        } seats and ${data.annualHoursLimit || targetHours} annual hours.`,
      });
      setIsUpgrading(false);
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't upgrade this workspace." });
      setIsUpgrading(false);
    }
  }

  if (!isDemoSuite) {
    return (
      <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Plan upgrade</p>
            <h3 className="mt-2 text-xl font-semibold text-emerald-950">Enterprise access is active</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900">
              {companyName} is already on {planName || "a paid workspace plan"}. Use Billing to invoice and Access to send setup after payment.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800">Enterprise</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Plan upgrade</p>
          <h3 className="mt-2 text-xl font-semibold text-amber-950">Upgrade to Enterprise Insight Suite</h3>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Convert this demo workspace into a paid workspace shell. Access emails remain gated until billing is paid.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-800">Demo workspace</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block rounded-[24px] bg-white p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Enterprise seats</span>
          <input
            type="number"
            min="1"
            value={targetSeats}
            onChange={(event) => setTargetSeats(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-amber-500"
          />
        </label>
        <label className="block rounded-[24px] bg-white p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Annual hours</span>
          <input
            type="number"
            min="1"
            value={targetHours}
            onChange={(event) => setTargetHours(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-amber-500"
          />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-3 rounded-[24px] bg-white p-4 text-sm leading-6 text-slate-700">
        <input
          type="checkbox"
          checked={createStripeCustomer}
          onChange={(event) => setCreateStripeCustomer(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />
        <span>
          <span className="font-semibold text-slate-950">
            {stripeCustomerId ? "Verify existing Stripe customer during upgrade" : "Create Stripe customer during upgrade"}
          </span>
          <span className="block text-slate-600">
            You can leave this off if you only want to switch the portal plan now and let the first invoice create the customer later.
          </span>
        </span>
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={upgradeWorkspace}
          disabled={isUpgrading}
          className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUpgrading ? "Upgrading..." : "Upgrade workspace"}
        </button>
        {feedback.success ? <p className="text-sm font-medium text-emerald-700">{feedback.success}</p> : null}
        {feedback.error ? <p className="text-sm font-medium text-rose-600">{feedback.error}</p> : null}
      </div>
    </div>
  );
}
