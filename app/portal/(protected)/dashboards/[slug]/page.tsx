import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock3, ExternalLink, FileWarning, LifeBuoy } from "lucide-react";
import { DashboardUsageTracker } from "@/components/portal/DashboardUsageTracker";
import { DisplayrEmbedFrame } from "@/components/portal/DisplayrEmbedFrame";
import { requirePortalAccess } from "@/lib/portal/auth";
import {
  getPortalAnyActiveDashboardConfigBySlug,
  getPortalArticles,
  getPortalCompanies,
  getPortalDashboardForUser,
  getPortalUsageStatus,
} from "@/lib/portal/data";
import { getDisplayrEmbedState } from "@/lib/portal/displayr";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildPortalMetadata(
    `Dashboard Viewer - ${slug}`,
    "Private dashboard viewer shell prepared for future Displayr embedding.",
  );
}

export default async function PortalDashboardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = (await searchParams) || {};
  const access = await requirePortalAccess(`/portal/dashboards/${slug}`);
  const isSupportAdmin = access.effectiveRole === "support_admin";
  const selectedCompanyParam = Array.isArray(query.company) ? query.company[0] : query.company;
  const availableCompanies = isSupportAdmin ? await getPortalCompanies() : [];
  const fallbackCompanyConfig =
    isSupportAdmin && access.company.subscriberType === "internal" && !selectedCompanyParam
      ? await getPortalAnyActiveDashboardConfigBySlug(slug)
      : null;
  const selectedCompany =
    isSupportAdmin && selectedCompanyParam
      ? availableCompanies.find((company) => company.id === selectedCompanyParam) || access.company
      : fallbackCompanyConfig
        ? availableCompanies.find((company) => company.id === fallbackCompanyConfig.companyId) || access.company
      : access.company;
  const dashboard = await getPortalDashboardForUser(access.effectiveUser, slug, access.company.id);
  if (!dashboard) {
    if (access.isPreviewMode) {
      redirect("/portal/home");
    }
    notFound();
  }
  const usage = await getPortalUsageStatus(access.effectiveUser);
  const embedState = await getDisplayrEmbedState(
    dashboard,
    selectedCompany.id,
    access.effectiveUser.id,
    access.company.id,
    access.company.subscriberType === "internal",
  );

  const relatedArticles = getPortalArticles().slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Dashboard Viewer</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">{dashboard.name}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{dashboard.description}</p>
          </div>
          <div className="flex max-w-xl flex-wrap gap-3 xl:justify-end">
            <Link href="/portal/dashboards" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {isSupportAdmin ? "Back to Dashboard Library" : "Back to Dashboards"}
              </span>
            </Link>
            <Link href={`/portal/support?dashboard=${encodeURIComponent(dashboard.name)}`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Need Help
            </Link>
            {access.isPreviewMode ? (
              <span className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">
                Reporting disabled in preview
              </span>
            ) : (
              <Link href={`/portal/support/new?dashboard=${encodeURIComponent(dashboard.name)}&issueType=${encodeURIComponent("Possible Bug")}`} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Report an Issue
              </Link>
            )}
            <Link
              href="/portal/help/exporting-charts-and-tables"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Export Tips
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {usage.isLocked ? (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-center gap-3 text-amber-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Dashboard access paused</h3>
                <p className="mt-1 text-sm text-amber-800">
                  This company has reached the annual portal usage allowance of {usage.annualHoursLimit} hours.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-amber-900">
              Access can be restored by purchasing an allowance increase, purchasing a usage-period reset, or contacting EcoFocus Support if
              you believe the tracked usage is incorrect and needs review against your account activity logs.
            </p>
          </div>
        ) : (
          <>
            <DashboardUsageTracker
              dashboardId={dashboard.id}
              dashboardName={dashboard.name}
              enabled={embedState.isConfigured && !isSupportAdmin && !access.isPreviewMode}
            />
            <DisplayrEmbedFrame
              dashboard={dashboard}
              iframeSrc={embedState.iframeSrc}
              isConfigured={embedState.isConfigured}
              isSupportAdmin={isSupportAdmin}
            />
          </>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          {isSupportAdmin ? (
            <div className="rounded-[28px] border border-violet-200 bg-violet-50 p-6">
              <h3 className="text-lg font-semibold text-violet-950">Internal company context</h3>
              <p className="mt-3 text-sm leading-6 text-violet-900">
                You are viewing this dashboard using the <span className="font-semibold">{selectedCompany.name}</span> configuration while signed in as EcoFocus.
              </p>
              <p className="mt-3 text-xs leading-6 text-violet-800">
                Internal support viewing uses the selected company&apos;s dashboard mapping, but it does not post standard client session-minute usage.
              </p>
            </div>
          ) : null}

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">How to use this dashboard</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Start with the default view, then apply one segment dimension at a time.</li>
              <li>Capture export context before downloading charts or tables for stakeholder review.</li>
              <li>Use the support actions above if access, export, or interpretation issues block progress.</li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Related help articles</h3>
            <div className="mt-4 space-y-3">
              {relatedArticles.map((article) => (
                <Link key={article.id} href={`/portal/help/${article.slug}`} className="block rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{article.category}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{article.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{article.summary}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">{isSupportAdmin ? "Subscription and access" : "Access details"}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Access tag: <span className="font-semibold text-slate-900">{dashboard.accessTag}</span>.
              {isSupportAdmin
                ? " This shell is prepared for seat-level grants, embed token exchange, and dashboard-specific support context."
                : " Your company has licensed access to this dashboard through the EcoFocus portal."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {usage.annualHoursLimit ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 font-medium text-slate-700">
                  <Clock3 className="h-4 w-4" />
                  {usage.hoursUsed}/{usage.annualHoursLimit} annual hours used
                </span>
              ) : null}
              {isSupportAdmin ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 font-medium text-violet-700">
                  <FileWarning className="h-4 w-4" />
                  Internal support viewing mode
                </span>
              ) : access.isPreviewMode ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 font-medium text-sky-700">
                  <FileWarning className="h-4 w-4" />
                  Read-only member preview
                </span>
              ) : null}
              {isSupportAdmin ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 font-medium text-emerald-700">
                  <ExternalLink className="h-4 w-4" />
                  {embedState.isConfigured ? "Company dashboard mapping configured" : "Company dashboard mapping required"}
                </span>
              ) : null}
              {isSupportAdmin ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 font-medium text-amber-700">
                  <FileWarning className="h-4 w-4" />
                  {embedState.requiresDisplayrLogin ? "Displayr login required" : "Displayr public-link publish mode"}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 font-medium text-sky-700">
                <LifeBuoy className="h-4 w-4" />
                Dashboard-aware support actions
              </span>
            </div>
            {isSupportAdmin ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
                Configuration source: <span className="font-semibold text-slate-900">{embedState.configSource}</span>. In production, embeds should come from company-specific private portal configuration storage.
                {" "}Internal support views do not post dashboard session minutes to the standard usage tracker.
                {` Current dashboard company context: ${selectedCompany.name}.`}
              </div>
            ) : access.isPreviewMode ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
                Support preview mode uses this company&apos;s dashboard and allowance context for rendering, but it does not post viewer-session minutes or consume the company&apos;s tracked hours.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
