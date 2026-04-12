import Link from "next/link";
import { AdminWorkspaceAccessCard } from "@/components/portal/AdminWorkspaceAccessCard";
import { AdminSubscriptionRecoveryForm } from "@/components/portal/AdminSubscriptionRecoveryForm";
import { AdminWorkspaceDeleteCard } from "@/components/portal/AdminWorkspaceDeleteCard";
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
  getPortalTeamMembersByCompany,
  getPortalUsageAllowanceByCompany,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

type AdminWorkspaceView = "overview" | "create" | "access" | "billing" | "invoices" | "recovery";

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

function normalizeView(value?: string): AdminWorkspaceView {
  if (value === "create" || value === "access" || value === "billing" || value === "invoices" || value === "recovery") {
    return value;
  }
  return "overview";
}

function buildWorkspaceHref(view: AdminWorkspaceView, companyId?: string) {
  const params = new URLSearchParams();
  params.set("view", view);
  if (companyId) params.set("company", companyId);
  return `/portal/admin/workspaces?${params.toString()}`;
}

function formatStatusLabel(value?: string | null) {
  return value ? value.replace(/_/g, " ") : "not set";
}

export default async function AdminWorkspacesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const selectedCompanyParam = Array.isArray(params.company) ? params.company[0] : params.company;
  const selectedViewParam = Array.isArray(params.view) ? params.view[0] : params.view;
  const selectedView = normalizeView(selectedViewParam);

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
        const selectedTeamMembers = selectedCompanyId
          ? await getPortalTeamMembersByCompany(selectedCompanyId)
          : [];
        const selectedClientAdmin = selectedCompany
          ? selectedTeamMembers.find((member) =>
              selectedCompany.subscriberType === "agency"
                ? member.role === "agency_admin" && member.status !== "inactive"
                : member.role === "client_admin" && member.status !== "inactive",
            ) || null
          : null;
        const selectedPlanName = selectedSubscription?.planName || "";
        const isSelectedDemoSuite = selectedPlanName === "Demo Suite";
        const workspaceTabs: { view: AdminWorkspaceView; label: string }[] = [
          { view: "overview", label: "Overview" },
          { view: "create", label: "New workspace" },
          { view: "access", label: "Access" },
          { view: "billing", label: "Billing" },
          { view: "invoices", label: "Invoices" },
          { view: "recovery", label: "Recovery" },
        ];

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
              <div className="mt-6 flex flex-wrap gap-2 rounded-[24px] bg-slate-50 p-2">
                {workspaceTabs.map((tab) => (
                  <Link
                    key={tab.view}
                    href={buildWorkspaceHref(tab.view, selectedCompanyId)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      selectedView === tab.view
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
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

            {selectedView === "overview" ? (
              <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
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
                    eyebrow="Workspace Snapshot"
                    title={selectedCompany ? selectedCompany.name : "Select a workspace"}
                    description={
                      selectedCompany
                        ? "Use this summary to decide the next operational step without opening every tool at once."
                        : "Pick a client workspace to inspect status, billing, and dashboard assignment."
                    }
                  />
                  {selectedCompany && selectedSubscription ? (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isSelectedDemoSuite ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isSelectedDemoSuite ? "Demo Suite" : "Enterprise Insight Suite"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {(selectedSubscription.billingStatus || "not_invoiced").replace(/_/g, " ")}
                      </span>
                    </div>
                  ) : null}
                  {selectedCompany ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-[24px] bg-slate-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Billing status</p>
                        <p className="mt-3 text-2xl font-semibold capitalize text-slate-950">
                          {formatStatusLabel(selectedSubscription?.billingStatus)}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {selectedCompany.billingEmail || "No billing email saved yet."}
                        </p>
                        <Link
                          href={buildWorkspaceHref("billing", selectedCompany.id)}
                          className="mt-4 inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          Manage billing
                        </Link>
                      </div>
                      <div className="rounded-[24px] bg-emerald-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Seat licensing</p>
                        <p className="mt-3 text-2xl font-semibold text-emerald-950">
                          {selectedSubscription
                            ? `${selectedSubscription.seatsUsed}/${selectedSubscription.seatsPurchased} seats`
                            : "No plan"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-emerald-900">
                          {selectedSubscription
                            ? `Renews ${formatDate(selectedSubscription.renewalDate)}`
                            : "Create a subscription record before sending access."}
                        </p>
                      </div>
                      <div className="rounded-[24px] bg-teal-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Access handoff</p>
                        <p className="mt-3 text-lg font-semibold text-teal-950">
                          {isSelectedDemoSuite
                            ? "Demo access can be sent"
                            : selectedSubscription?.billingStatus === "paid"
                              ? "Paid access can be sent"
                              : "Access held until payment"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-teal-900">
                          {selectedClientAdmin
                            ? `${selectedClientAdmin.name} <${selectedClientAdmin.email}>`
                            : "No company admin found yet."}
                        </p>
                        <Link
                          href={buildWorkspaceHref("access", selectedCompany.id)}
                          className="mt-4 inline-flex rounded-xl border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-800"
                        >
                          Open access
                        </Link>
                      </div>
                      <div className="rounded-[24px] bg-sky-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Dashboard access</p>
                        <p className="mt-3 text-2xl font-semibold text-sky-950">{selectedEntitlements.length} assigned</p>
                        <p className="mt-2 text-sm leading-6 text-sky-900">
                          Assign or update company-specific Displayr URLs from the dashboard access console.
                        </p>
                        <Link
                          href={`/portal/admin/dashboards?company=${encodeURIComponent(selectedCompany.id)}`}
                          className="mt-4 inline-flex rounded-xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-800"
                        >
                          Open dashboards
                        </Link>
                      </div>
                      <div className="rounded-[24px] bg-amber-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Next action</p>
                        <p className="mt-3 text-lg font-semibold text-amber-950">
                          {isSelectedDemoSuite
                            ? "Send demo setup email"
                            : selectedSubscription?.billingStatus === "paid"
                              ? "Send paid access email"
                              : selectedInvoices.length
                              ? "Watch invoice status"
                              : "Send the first invoice"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-amber-900">
                          Use the focused billing and invoice views when you need to take action.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                      No workspace selected yet.
                    </div>
                  )}
                </div>
              </section>
            ) : null}

            {selectedView === "access" ? (
              <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                <AdminWorkspacePicker
                  companies={clientCompanies.map((company) => ({
                    id: company.id,
                    name: company.name,
                    subtitle: company.subscriberType === "agency" ? "Agency workspace" : "Client workspace",
                  }))}
                  selectedCompanyId={selectedCompanyId}
                />

                {selectedCompany && selectedSubscription ? (
                  <AdminWorkspaceAccessCard
                    adminEmail={selectedClientAdmin?.email || null}
                    adminName={selectedClientAdmin?.name || null}
                    billingStatus={selectedSubscription.billingStatus || "not_invoiced"}
                    companyId={selectedCompany.id}
                    companyName={selectedCompany.name}
                    planName={selectedSubscription.planName}
                  />
                ) : (
                  <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                    <SectionHeader
                      eyebrow="Access"
                      title="Access handoff"
                      description="Select a workspace with a subscription record before sending setup email."
                    />
                  </div>
                )}
              </section>
            ) : null}

            {selectedView === "create" ? (
              <section className="rounded-[32px] border border-slate-200 bg-white p-6">
                <SectionHeader
                  eyebrow="New Workspace"
                  title="Create a company workspace"
                  description="Set up the workspace record, initial client admin, usage allowance, billing contact, and dashboard assignment in one focused workflow."
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
              </section>
            ) : null}

            {selectedView === "billing" ? (
              <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
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
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                      No workspace selected yet.
                    </div>
                  )}
                </div>
              </section>
            ) : null}

            {selectedView === "invoices" ? (
              <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
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
              </section>
            ) : null}

            {selectedView === "recovery" ? (
              <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                <AdminWorkspacePicker
                  companies={clientCompanies.map((company) => ({
                    id: company.id,
                    name: company.name,
                    subtitle: company.subscriberType === "agency" ? "Agency workspace" : "Client workspace",
                  }))}
                  selectedCompanyId={selectedCompanyId}
                />

                <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-6">
                  <SectionHeader
                    eyebrow="Advanced Recovery"
                    title={selectedCompany ? `${selectedCompany.name} recovery controls` : "Recovery controls"}
                    description="Use this only after a failed webhook, billing correction, or manual Stripe cleanup. Normal billing work should happen in the Billing view."
                  />

                  {selectedCompany && selectedSubscription ? (
                    <div className="mt-6 space-y-5">
                      <div className="rounded-[24px] border border-amber-200 bg-white p-5">
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
                      <AdminWorkspaceDeleteCard
                        companyId={selectedCompany.id}
                        companyName={selectedCompany.name}
                      />
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[24px] bg-white p-4 text-sm text-slate-600">
                      Select a workspace with a subscription record before using recovery controls.
                    </div>
                  )}
                </div>
              </section>
            ) : null}
          </div>
        );
      }}
    </RoleGuard>
  );
}
