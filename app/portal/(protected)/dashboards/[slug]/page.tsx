import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileWarning, LifeBuoy } from "lucide-react";
import { DisplayrEmbedFrame } from "@/components/portal/DisplayrEmbedFrame";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalArticles, getPortalDashboardForUser } from "@/lib/portal/data";
import { getDisplayrEmbedEnvKey, getDisplayrEmbedState } from "@/lib/portal/displayr";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildPortalMetadata(
    `Dashboard Viewer - ${slug}`,
    "Private dashboard viewer shell prepared for future Displayr embedding.",
  );
}

export default async function PortalDashboardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const access = await requirePortalAccess(`/portal/dashboards/${slug}`);
  const dashboard = getPortalDashboardForUser(access.user, slug);
  if (!dashboard) notFound();
  const embedState = getDisplayrEmbedState(dashboard);
  const embedEnvKey = getDisplayrEmbedEnvKey(dashboard.slug);

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
                Back to Dashboards
              </span>
            </Link>
            <Link href={`/portal/support?dashboard=${encodeURIComponent(dashboard.name)}`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Need Help
            </Link>
            <Link href={`/portal/support/new?dashboard=${encodeURIComponent(dashboard.name)}&issueType=${encodeURIComponent("Possible Bug")}`} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Report an Issue
            </Link>
            <span className="rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500">
              Export Tips
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <DisplayrEmbedFrame
          dashboard={dashboard}
          iframeUrl={embedState.iframeUrl}
          isConfigured={embedState.isConfigured}
          requiresDisplayrLogin={embedState.requiresDisplayrLogin}
          envKey={embedEnvKey}
        />

        <div className="grid gap-6 xl:grid-cols-3">
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
                <div key={article.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{article.category}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{article.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{article.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Subscription and access</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Access tag: <span className="font-semibold text-slate-900">{dashboard.accessTag}</span>. This shell is prepared for seat-level
              grants, embed token exchange, and dashboard-specific support context.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 font-medium text-emerald-700">
                <ExternalLink className="h-4 w-4" />
                {embedState.isConfigured ? "Embed URL configured" : "Embed URL ready to configure"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 font-medium text-amber-700">
                <FileWarning className="h-4 w-4" />
                {embedState.requiresDisplayrLogin ? "Displayr-managed login flow" : "Direct public link embed"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 font-medium text-sky-700">
                <LifeBuoy className="h-4 w-4" />
                Dashboard-aware support actions
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
              Env key for this dashboard: <code className="font-semibold text-slate-900">{embedEnvKey}</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
