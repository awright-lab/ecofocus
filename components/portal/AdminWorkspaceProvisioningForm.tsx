"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardOption = {
  id: string;
  name: string;
  accessTag: string;
};

const planPresets = {
  "Enterprise Insight Suite": {
    seatsPurchased: "12",
    annualHoursLimit: "120",
    createStripeCustomer: true,
  },
  "Demo Suite": {
    seatsPurchased: "1",
    annualHoursLimit: "5",
    createStripeCustomer: false,
  },
} as const;

type PlanPresetName = keyof typeof planPresets;

export function AdminWorkspaceProvisioningForm({
  dashboards,
}: {
  dashboards: DashboardOption[];
}) {
  const router = useRouter();
  const currentYear = new Date().getUTCFullYear();
  const defaultRenewalDate = `${currentYear}-12-31`;
  const defaultPeriodStart = `${currentYear}-01-01`;
  const defaultPeriodEnd = `${currentYear}-12-31`;
  const [form, setForm] = useState({
    companyName: "",
    subscriberType: "brand",
    logoUrl: "",
    billingContactName: "",
    billingEmail: "",
    adminName: "",
    adminEmail: "",
    planName: "Enterprise Insight Suite",
    seatsPurchased: "12",
    renewalDate: defaultRenewalDate,
    annualHoursLimit: "120",
    periodStart: defaultPeriodStart,
    periodEnd: defaultPeriodEnd,
    createStripeCustomer: true,
  });
  const [selectedDashboardIds, setSelectedDashboardIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoUploadMessage, setLogoUploadMessage] = useState<string | null>(null);
  const isDemoSuite = form.planName === "Demo Suite";

  const groupedDashboards = useMemo(() => {
    return dashboards.reduce<Record<string, DashboardOption[]>>((acc, dashboard) => {
      const key = dashboard.accessTag || "Other";
      acc[key] ||= [];
      acc[key].push(dashboard);
      return acc;
    }, {});
  }, [dashboards]);

  function toggleDashboard(dashboardId: string) {
    setSelectedDashboardIds((current) =>
      current.includes(dashboardId)
        ? current.filter((id) => id !== dashboardId)
        : [...current, dashboardId],
    );
  }

  function applyPlanPreset(planName: PlanPresetName) {
    const preset = planPresets[planName];
    setForm((current) => ({
      ...current,
      planName,
      seatsPurchased: preset.seatsPurchased,
      annualHoursLimit: preset.annualHoursLimit,
      createStripeCustomer: preset.createStripeCustomer,
      renewalDate: planName === "Demo Suite" ? "" : current.renewalDate || defaultRenewalDate,
      periodStart: planName === "Demo Suite" ? "" : current.periodStart || defaultPeriodStart,
      periodEnd: planName === "Demo Suite" ? "" : current.periodEnd || defaultPeriodEnd,
    }));
  }

  async function uploadLogo(file: File) {
    if (!form.companyName.trim()) {
      setError("Enter the company name before uploading a logo.");
      return;
    }

    setIsUploadingLogo(true);
    setError(null);
    setLogoUploadMessage(null);

    try {
      const payload = new FormData();
      payload.append("companyName", form.companyName);
      payload.append("file", file);

      const response = await fetch("/api/portal/admin/company-logo", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json()) as { error?: string; logoUrl?: string };
      if (!response.ok || !data.logoUrl) {
        setError(data.error || "We couldn't upload this logo right now.");
        setIsUploadingLogo(false);
        return;
      }

      setForm((current) => ({ ...current, logoUrl: data.logoUrl || "" }));
      setLogoUploadMessage("Logo uploaded and linked to this workspace draft.");
      setIsUploadingLogo(false);
    } catch {
      setError("We couldn't upload this logo right now.");
      setIsUploadingLogo(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/portal/admin/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          seatsPurchased: Number(form.seatsPurchased),
          annualHoursLimit: Number(form.annualHoursLimit),
          dashboardIds: selectedDashboardIds,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        companyId?: string;
        stripeCustomerId?: string | null;
      };

      if (!response.ok) {
        setError(data.error || "We couldn't create this workspace right now.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(
        data.stripeCustomerId
          ? `Workspace created and Stripe customer connected for ${data.companyId}.`
          : `Workspace created for ${data.companyId}. Use the Access tab to send setup email when demo or paid access is approved.`,
      );
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't create this workspace right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-800">Company name</span>
          <input
            value={form.companyName}
            onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="GreenLoop Foods"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Workspace type</span>
          <select
            value={form.subscriberType}
            onChange={(event) => setForm((current) => ({ ...current, subscriberType: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="brand">Brand</option>
            <option value="agency">Agency</option>
            <option value="internal">Internal</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Company logo</span>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/60">
              <span>{isUploadingLogo ? "Uploading logo..." : "Upload logo image"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                disabled={isUploadingLogo}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadLogo(file);
                  }
                  event.currentTarget.value = "";
                }}
              />
            </label>
            {form.logoUrl ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <Image
                    src={form.logoUrl}
                    alt="Company logo preview"
                    width={56}
                    height={56}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0 text-xs text-slate-600">
                  <p className="font-medium text-slate-900">Logo linked</p>
                  <p className="truncate">{form.logoUrl}</p>
                </div>
              </div>
            ) : null}
            {logoUploadMessage ? <p className="text-xs font-medium text-emerald-700">{logoUploadMessage}</p> : null}
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Logo URL override</span>
          <input
            value={form.logoUrl}
            onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Optional manual logo URL"
          />
        </label>

        <div className="md:col-span-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Billing contact
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Billing contact name</span>
          <input
            value={form.billingContactName}
            onChange={(event) => setForm((current) => ({ ...current, billingContactName: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Maya Hernandez"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Billing email</span>
          <input
            value={form.billingEmail}
            onChange={(event) => setForm((current) => ({ ...current, billingEmail: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="billing@greenloopfoods.com"
          />
        </label>

        <div className="md:col-span-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Primary admin
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Admin name</span>
          <input
            value={form.adminName}
            onChange={(event) => setForm((current) => ({ ...current, adminName: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="John Doe"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Admin email</span>
          <input
            value={form.adminEmail}
            onChange={(event) => setForm((current) => ({ ...current, adminEmail: event.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="john@greenloopfoods.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Plan</span>
          <select
            value={form.planName}
            onChange={(event) => applyPlanPreset(event.target.value as PlanPresetName)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="Enterprise Insight Suite">Enterprise Insight Suite</option>
            <option value="Demo Suite">Demo Suite</option>
          </select>
          {isDemoSuite ? (
            <p className="mt-2 text-xs leading-5 text-amber-700">
              Demo Suite locks access to 1 seat and 5 annual dashboard hours. Stripe customer creation is off by default.
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Seats purchased</span>
          <input
            value={form.seatsPurchased}
            onChange={(event) => setForm((current) => ({ ...current, seatsPurchased: event.target.value }))}
            disabled={isDemoSuite}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-800">Annual hours</span>
          <input
            value={form.annualHoursLimit}
            onChange={(event) => setForm((current) => ({ ...current, annualHoursLimit: event.target.value }))}
            disabled={isDemoSuite}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          />
        </label>

        {isDemoSuite ? (
          <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Demo Suite workspaces do not require a renewal date or allowance window. Usage remains available indefinitely.
          </div>
        ) : (
          <>
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
              <span className="mb-2 block text-sm font-medium text-slate-800">Allowance period start</span>
              <input
                type="date"
                value={form.periodStart}
                onChange={(event) => setForm((current) => ({ ...current, periodStart: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-800">Allowance period end</span>
              <input
                type="date"
                value={form.periodEnd}
                onChange={(event) => setForm((current) => ({ ...current, periodEnd: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </>
        )}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-950">Assigned dashboards</h4>
            <p className="mt-1 text-sm text-slate-600">Choose the dashboards this workspace should see in the portal.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {selectedDashboardIds.length} selected
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {Object.entries(groupedDashboards).map(([group, items]) => (
            <div key={group}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{group}</p>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {items.map((dashboard) => {
                  const isSelected = selectedDashboardIds.includes(dashboard.id);
                  return (
                    <button
                      key={dashboard.id}
                      type="button"
                      onClick={() => toggleDashboard(dashboard.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="block font-medium">{dashboard.name}</span>
                        {isSelected ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                            ✓
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.createStripeCustomer}
          disabled={isDemoSuite}
          onChange={(event) => setForm((current) => ({ ...current, createStripeCustomer: event.target.checked }))}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />
        <span>
          {isDemoSuite
            ? "Demo workspaces skip Stripe customer creation until they are converted to a paid client."
            : "Create a Stripe customer record now so invoicing can start immediately."}
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create workspace"}
        </button>
        {success ? <p className="text-xs font-medium text-emerald-700">{success}</p> : null}
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    </form>
  );
}
