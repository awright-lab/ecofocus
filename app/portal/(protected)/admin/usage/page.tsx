import Link from "next/link";
import { AdminWorkspacePicker } from "@/components/portal/AdminWorkspacePicker";
import { AdminSubscriptionCapacityForm } from "@/components/portal/AdminSubscriptionCapacityForm";
import { AdminUsageAllowanceForm } from "@/components/portal/AdminUsageAllowanceForm";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import {
  getPortalCompanies,
  getPortalSubscriptionByCompany,
  getPortalUsageAllowanceByCompany,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Usage Controls",
  "Internal usage, allowance, and seat capacity controls for the EcoFocus portal.",
);

export default async function AdminUsagePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/usage">
      {async (access) => {
        const companies = (await getPortalCompanies()).filter((company) => company.id !== access.company.id);
        const selectedCompanyId = selectedCompanyParam || companies[0]?.id || "";
        const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || null;
        const usageAllowance = selectedCompanyId
          ? await getPortalUsageAllowanceByCompany(selectedCompanyId)
          : null;
        const subscription = selectedCompanyId
          ? await getPortalSubscriptionByCompany(selectedCompanyId)
          : null;

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Usage controls"
                description="Manage client allowance windows, tracked hour totals, and seat capacity from one dedicated controls page."
                actions={
                  <Link
                    href={`/portal/admin/audit${selectedCompanyId ? `?company=${encodeURIComponent(selectedCompanyId)}` : ""}`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Open audit
                  </Link>
                }
              />
            </section>

            <AdminWorkspacePicker
              companies={companies.map((company) => ({
                id: company.id,
                name: company.name,
                subtitle: company.subscriberType === "agency" ? "Agency workspace" : "Client workspace",
              }))}
              selectedCompanyId={selectedCompanyId}
            />

            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Selected workspace</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCompany?.name || "No workspace selected"}</p>
              </div>
              <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Annual hours</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-950">{usageAllowance?.annualHoursLimit ?? 0}</p>
                <p className="mt-2 text-sm text-emerald-900/80">Configured allowance</p>
              </div>
              <div className="rounded-[28px] border border-sky-200 bg-sky-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">Tracked hours</p>
                <p className="mt-2 text-3xl font-semibold text-sky-950">{usageAllowance?.hoursUsed ?? 0}</p>
                <p className="mt-2 text-sm text-sky-900/80">Current usage record</p>
              </div>
              <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Seat availability</p>
                <p className="mt-2 text-3xl font-semibold text-amber-950">
                  {subscription ? Math.max(subscription.seatsPurchased - subscription.seatsUsed, 0) : 0}
                </p>
                <p className="mt-2 text-sm text-amber-900/80">Open seats remaining</p>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Usage allowance controls</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Adjust the current allowance window, annual hours limit, and tracked usage total when support review or contract updates require it.
                </p>

                {selectedCompany && usageAllowance ? (
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-900">{selectedCompany.name}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Current period: {formatDate(usageAllowance.periodStart)} to {formatDate(usageAllowance.periodEnd)}
                    </p>
                    <div className="mt-4">
                      <AdminUsageAllowanceForm
                        companyId={selectedCompany.id}
                        annualHoursLimit={usageAllowance.annualHoursLimit}
                        hoursUsed={usageAllowance.hoursUsed}
                        periodStart={usageAllowance.periodStart}
                        periodEnd={usageAllowance.periodEnd}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                    Select a client company to review or seed an allowance record before making updates.
                  </div>
                )}
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Seat capacity</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Update purchased seats and current seat usage when subscriptions expand or account cleanup changes the licensed team count.
                </p>

                {selectedCompany && subscription ? (
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Plan</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{subscription.planName}</p>
                      </div>
                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{subscription.status}</p>
                      </div>
                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Renewal</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(subscription.renewalDate)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <AdminSubscriptionCapacityForm
                        companyId={selectedCompany.id}
                        seatsPurchased={subscription.seatsPurchased}
                        seatsUsed={subscription.seatsUsed}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                    Select a client company with a seeded subscription before adjusting seat capacity.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">When to use this page</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Use this page for contract-driven changes, allowance corrections, and license updates. Use Audit when you need to investigate who used what and when.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Allowance review workflow</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Check tracked session history on Audit first, then return here to correct the allowance period or granted hours if the account record needs an update.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Seat cleanup workflow</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Adjust seat usage here after invite cleanup, subscription expansion, or account migrations so subscriber capacity stays aligned with the actual portal team.
                </p>
              </div>
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
