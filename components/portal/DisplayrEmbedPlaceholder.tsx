import { MonitorPlay } from "lucide-react";
import type { PortalDashboard } from "@/lib/portal/types";

export function DisplayrEmbedPlaceholder({ dashboard }: { dashboard: PortalDashboard }) {
  if (dashboard.embedUrl) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
          <span>Displayr embed ready</span>
          <span className="text-xs text-slate-300">TODO: replace placeholder with production iframe wrapper</span>
        </div>
        <div className="h-[460px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 xl:h-[560px]">
          <iframe title={dashboard.name} src={dashboard.embedUrl} className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
        <span>Viewer shell</span>
        <span className="text-xs text-slate-300">Prepared for iframe embed and dashboard-specific utilities</span>
      </div>
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_50%,#f0fdf4_100%)] p-8 text-center xl:min-h-[560px]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <MonitorPlay className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">Displayr dashboard embed area</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          This shell is ready for an entitlement-aware iframe component backed by a dashboard-specific `embedUrl`.
        </p>
        <p className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
          TODO: wire Displayr embed token handling and access controls
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1.5">Viewer height bounded</span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5">Utility bar preserved</span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5">Embed swap-in ready</span>
      </div>
    </div>
  );
}
