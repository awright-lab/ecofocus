"use client";

import { useState } from "react";
import { Expand, MonitorPlay, X } from "lucide-react";
import type { PortalDashboard } from "@/lib/portal/types";

export function DisplayrEmbedFrame({
  dashboard,
  iframeSrc,
  isConfigured,
  isSupportAdmin = false,
}: {
  dashboard: PortalDashboard;
  iframeSrc: string | null;
  isConfigured: boolean;
  isSupportAdmin?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isConfigured || !iframeSrc) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
          <span>Viewer shell</span>
          <span className="text-xs text-slate-300">Dashboard configuration not assigned yet</span>
        </div>
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_50%,#f0fdf4_100%)] p-8 text-center xl:min-h-[560px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <MonitorPlay className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-900">Displayr dashboard embed area</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            A company-scoped Displayr dashboard URL has not been assigned to this portal dashboard yet, so the portal will not render an embed.
          </p>
          <p className="mt-4 max-w-xl text-sm text-slate-500">
            Configure the company-scoped dashboard mapping in portal dashboard settings or seed `portal_dashboard_configs` in Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)]">
      {isSupportAdmin ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
          <div className="flex items-center gap-3">
            <span>Displayr embed</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Portal-routed access</span>
          </div>
          <span className="text-xs text-slate-300">Published Displayr document rendered inside the private portal</span>
        </div>
      ) : null}

      {isSupportAdmin ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          The EcoFocus portal controls who can reach this embed route. The dashboard content itself remains hosted and authorized by Displayr.
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <span>{isSupportAdmin ? `Confidential licensed access for ${dashboard.name}` : "Confidential licensed dashboard access"}</span>
        <span>{isSupportAdmin ? "Do not forward or redistribute dashboard access outside your approved portal team." : "Licensed for your approved portal team."}</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <span>Open the dashboard in a larger modal view when you need more room to work.</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          <Expand className="h-4 w-4" />
          Open large view
        </button>
      </div>

      <div className="h-[460px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 xl:h-[560px]">
        <iframe
          title={dashboard.name}
          src={iframeSrc}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="fullscreen"
          allowFullScreen
        />
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${dashboard.name} large view`}
            className="flex h-[92vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_28px_120px_-36px_rgba(15,23,42,0.6)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Large view</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">{dashboard.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>

            <div className="flex-1 bg-slate-100 p-4">
              <div className="h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                <iframe
                  title={`${dashboard.name} large view`}
                  src={iframeSrc}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
