// app/reports/page.tsx
"use client";

import { Suspense } from "react";
import * as React from "react";

import ReportsGrid from "./ReportsGrid";
import { LeftFilterRail } from "./LeftFilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useReportSearchParams } from "./useReportSearchParams";
import ReportsHero from "./ReportsHero";
import AccessTabs from "./AccessTabs";
import ReportsBundles from "./ReportsBundles";
import ReportsCTA from "./ReportsCTA";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsPageFallback />}>
      <ReportsPageInner />
    </Suspense>
  );
}

function ReportsPageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 text-emerald-800">
      Loading reports…
    </div>
  );
}

function ReportsPageInner() {
  const { values, setParam } = useReportSearchParams();
  const { access, year, topic, type } = values;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Top hero + access tabs */}
      <ReportsHero />
      <AccessTabs />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter rail + list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT rail */}
          <aside className="lg:col-span-3">
            <button
              className="lg:hidden w-full rounded-xl border border-emerald-200 py-2 text-emerald-900"
              onClick={() => setMobileOpen(true)}
            >
              Filters
            </button>
            <div className="hidden lg:block">
              <LeftFilterRail
                access={access}
                year={year}
                topic={topic}
                type={type}
                setParam={setParam}
              />
            </div>
          </aside>

          {/* RIGHT: list only */}
          <main className="lg:col-span-9">
            <ReportsGrid />
          </main>
        </div>

        {/* FULL-WIDTH sections under the grid */}
        <div className="mt-12 space-y-12">
          <ReportsBundles />
          <ReportsCTA />
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        access={access}
        year={year}
        topic={topic}
        type={type}
        setParam={(k, v) => {
          setParam(k, v);
          // setMobileOpen(false); // enable if you want auto-close on first change
        }}
      />
    </div>
  );
}





























