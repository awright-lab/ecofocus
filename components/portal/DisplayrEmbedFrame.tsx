import { ExternalLink, LockKeyhole, MonitorPlay } from "lucide-react";
import type { PortalDashboard } from "@/lib/portal/types";

export function DisplayrEmbedFrame({
  dashboard,
  iframeUrl,
  isConfigured,
  requiresDisplayrLogin,
  envKey,
}: {
  dashboard: PortalDashboard;
  iframeUrl: string | null;
  isConfigured: boolean;
  requiresDisplayrLogin: boolean;
  envKey: string;
}) {
  if (!isConfigured || !iframeUrl) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
          <span>Viewer shell</span>
          <span className="text-xs text-slate-300">Displayr URL not configured yet</span>
        </div>
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_50%,#f0fdf4_100%)] p-8 text-center xl:min-h-[560px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <MonitorPlay className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-900">Displayr dashboard embed area</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Add the published dashboard URL to the environment variable below and redeploy. Route-level access control is already enforced by the portal.
          </p>
          <code className="mt-4 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm">{envKey}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
        <div className="flex items-center gap-3">
          <span>Displayr embed</span>
          {requiresDisplayrLogin ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
              <LockKeyhole className="h-3.5 w-3.5" />
              Displayr login required
            </span>
          ) : (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Anyone with link</span>
          )}
        </div>
        <a
          href={iframeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 hover:text-white"
        >
          <span>Open in new tab</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {requiresDisplayrLogin ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This dashboard is configured for Displayr-managed private access. Users may be prompted to log in to Displayr and allow embedded access in their browser.
        </div>
      ) : null}

      <div className="h-[460px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 xl:h-[560px]">
        <iframe
          title={dashboard.name}
          src={iframeUrl}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
