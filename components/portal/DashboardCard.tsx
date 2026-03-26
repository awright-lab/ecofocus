import Link from "next/link";
import { ArrowRight, Clock3, LockKeyhole } from "lucide-react";
import type { PortalDashboard } from "@/lib/portal/types";

export function DashboardCard({
  dashboard,
  usageLocked = false,
  href,
}: {
  dashboard: PortalDashboard;
  usageLocked?: boolean;
  href?: string;
}) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {dashboard.accessTag}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{dashboard.name}</h3>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
          <LockKeyhole className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{dashboard.description}</p>
      {usageLocked ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="flex items-center gap-2 font-semibold">
            <Clock3 className="h-4 w-4" />
            Annual usage allowance exhausted
          </div>
          <p className="mt-1 text-xs text-amber-800">Dashboard access is paused until hours are reset or expanded.</p>
        </div>
      ) : (
        <Link
          href={href || `/portal/dashboards/${dashboard.slug}`}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}
