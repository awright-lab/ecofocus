import Link from "next/link";
import { AdminSubscriptionRecoveryForm } from "@/components/portal/AdminSubscriptionRecoveryForm";
import { AdminWorkspaceInvoiceForm } from "@/components/portal/AdminWorkspaceInvoiceForm";
import { AdminWorkspacePicker } from "@/components/portal/AdminWorkspacePicker";
import { AdminWorkspaceProvisioningForm } from "@/components/portal/AdminWorkspaceProvisioningForm";
import { RoleGuard } from "@/components/portal/RoleGuard";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { listPortalInvoicesByCompany } from "@/lib/portal/billing";
import {
  getPortalCompanies,
  getPortalDashboardCatalog,
  getPortalDashboardEntitlementsByCompany,
  getPortalSubscriptionByCompany,
  getPortalUsageAllowanceByCompany,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Workspace Provisioning",
  "Internal workspace provisioning, billing setup, and invoicing for the EcoFocus portal.",
);

function formatUsdFromCents(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

export default async function AdminWorkspacesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;

  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/workspaces">
      {async (access) => {
        const allCompanies = await getPortalCompanies();
        const clientCompanies = allCompanies.filter((company) => company.id !== access.company.id);
        const dashboardCatalog = await getPortalDashboardCatalog();
        const selectedCompanyId = selectedCompanyParam || clientCompanies[0]?.id || "";
        const selectedCompany = clientCompanies.find((company) => company.id === selectedCompanyId) || null;
        const selectedSubscription = selectedCompanyId
          ? await getPortalSubscriptionByCompany(selectedCompanyId)
          : null;
        const selectedAllowance = selectedCompanyId
          ? await getPortalUsageAllowanceByCompany(selectedCompanyId)
          : null;
        const selectedEntitlements = selectedCompanyId
          ? await getPortalDashboardEntitlementsByCompany(selectedCompanyId)
          : [];
        const selectedInvoices = selectedCompanyId
          ? await listPortalInvoicesByCompany(selectedCompanyId, 8)
          : [];

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Workspace provisioning"
                description="Create a client workspace, assign dashboards, connect billing contacts, and send invoices without leaving the portal."
                actions={
                  selectedCompanyId ? (
                    <Link
                      href={`/portal/admin/dashboards?company=${encodeURIComponent(selectedCompanyId)}`}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Open dashboard access
                    </Link>
                  ) : null
                }
              />
              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Client workspaces</p>
                  <p className="mt-2 text-3xl font-semibold">{clientCompanies.length}</p>
                </div>
                <div className="rounded-[24px] bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Catalog dashboards</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-950">{dashboardCatalog.length}</p>
                </div>
                <div className="rounded-[24px] bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Selected assignments</p>
                  <p className="mt-2 text-3xl font-semibold text-sky-950">{selectedEntitlements.length}</p>
                </div>
                <div className="rounded-[24px] bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Recent invoices</p>
                  <p className="mt-2 text-3xl font-semibold text-amber-950">{selectedInvoices.length}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <SectionHeader
                  eyebrow="New Workspace"
                  title="Create a company workspace"
                  description="Set up the workspace record, initial client admin, usage allowance, billing contact, and dashboard assignment in one pass."
                />
                <div className="mt-6">
                  <AdminWorkspaceProvisioningForm
                    dashboards={dashboardCatalog.map((dashboard) => ({
                      id: dashboard.id,
                      name: dashboard.name,
                      accessTag: dashboard.accessTag,
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <AdminWorkspacePicker
                  companies={clientCompanies.map((company) => ({
                    id: company.id,
                    name: company.name,
                    subtitle: company.subscriberType === "agency" ? "Agency workspace" : "Client workspace",
                  }))}
                  selectedCompanyId={selectedCompanyId}
                />

                <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                  <SectionHeader
                    eyebrow="Billing"
                    title={selectedCompany ? `${selectedCompany.name} billing` : "Billing tools"}
                    description={
                      selectedCompany
                        ? "Review the current billing contact and send a Stripe invoice when the workspace is ready to purchase."
                        : "Select a workspace to manage billing."
                    }
                  />

                  {selectedCompany ? (
                    <div className="mt-6 space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Billing contact</p>
                          <p className="mt-2 font-semibold text-slate-950">{selectedCompany.billingContactName || "Not set"}</p>
                          <p className="mt-1">{selectedCompany.billingEmail || "No billing email saved yet."}</p>
                        </div>
                        <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Plan summary</p>
                          <p className="mt-2 font-semibold text-slate-950">{selectedSubscription?.planName || "No plan record"}</p>
                          <p className="mt-1">
                            {selectedSubscription
                              ? `${selectedSubscription.seatsPurchased} seats · renews ${formatDate(selectedSubscription.renewalDate)}`
                              : "No subscription record is available yet."}
                          </p>
                          <p className="mt-1">
                            {selectedAllowance
                              ? `${selectedAllowance.annualHoursLimit} annual dashboard hours`
                              : "No allowance window has been configured yet."}
                          </p>
                        </div>
                      </div>

                      <AdminWorkspaceInvoiceForm
                        companyId={selectedCompany.id}
                        companyName={selectedCompany.name}
                        billingEmail={selectedCompany.billingEmail}
                      />

                      {selectedSubscription ? (
                        <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
                          <h3 className="text-sm font-semibold text-amber-950">Billing recovery controls</h3>
                          <p className="mt-2 text-sm leading-6 text-amber-900">
                            Use these fields when Stripe or webhook recovery requires a manual correction before retrying a customer workflow.
                          </p>
                          <div className="mt-5">
                            <AdminSubscriptionRecoveryForm
                              companyId={selectedCompany.id}
                              planName={selectedSubscription.planName}
                              subscriptionStatus={selectedSubscription.status}
                              billingStatus={selectedSubscription.billingStatus || "not_invoiced"}
                              renewalDate={selectedSubscription.renewalDate}
                              stripeCustomerId={selectedCompany.stripeCustomerId}
                              stripeSubscriptionId={selectedSubscription.stripeSubscriptionId}
                              billingContactName={selectedCompany.billingContactName}
                              billingEmail={selectedCompany.billingEmail}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                      No workspace selected yet.
                    </div>
                  )}
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                  <SectionHeader
                    eyebrow="Invoices"
                    title="Recent billing activity"
                    description="Stripe invoices are listed here so support can quickly confirm what was sent and what is still outstanding."
                  />
                  <div className="mt-6 space-y-3">
                    {selectedInvoices.length ? (
                      selectedInvoices.map((invoice) => (
                        <div key={invoice.id} className="rounded-[24px] bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-950">{invoice.description || invoice.number || invoice.id}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                {formatUsdFromCents(invoice.amountDue)} · {invoice.status}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {invoice.hostedInvoiceUrl ? (
                                <a
                                  href={invoice.hostedInvoiceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                                >
                                  Open invoice
                                </a>
                              ) : null}
                              {invoice.invoicePdf ? (
                                <a
                                  href={invoice.invoicePdf}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                                >
                                  PDF
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                        No recent invoices are available for the selected workspace yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
