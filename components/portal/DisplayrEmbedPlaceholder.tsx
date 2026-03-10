import { MonitorPlay } from "lucide-react";
import type { PortalDashboard } from "@/lib/portal/types";

export function DisplayrEmbedPlaceholder({ dashboard }: { dashboard: PortalDashboard }) {
  if (dashboard.embedUrl) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
          <span>Displayr embed ready</span>
          <span className="text-xs text-slate-300">TODO: replace placeholder with production iframe wrapper</span>
        </div>
        <div className="aspect-[16/9] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
          <iframe title={dashboard.name} src={dashboard.embedUrl} className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-[16/9] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_50%,#f0fdf4_100%)] p-8 text-center">
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
  );
}
