// app/reports/page.tsx
import { Suspense } from "react";

// If you split these, keep them:
import ReportsGrid from "./ReportsGrid";
import { LeftFilterRail } from "./LeftFilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useReportSearchParams } from "./useReportSearchParams";

// If you render hero / tabs / bundles / CTA above/below, leave those imports & JSX as-is.

// Optional: force dynamic to avoid static prerender with searchParams
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

// ---- Everything below used to be your page body that reads useSearchParams ----
function ReportsPageInner() {
  // This hook calls useSearchParams(), so it MUST be inside Suspense
  const { values, setParam } = useReportSearchParams();
  const { access, year, topic, type } = values;

  // local mobile drawer state can live here
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Keep your hero / breadcrumbs / top content here if you render them */}
      {/* <ReportsHero /> */}
      {/* <AccessTabs />  // optional if you still want them visible */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: rail */}
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

          {/* RIGHT: list + the rest of your sections */}
          <main className="lg:col-span-9 space-y-10">
            {/* The list component also reads useSearchParams, but it's now inside Suspense via ReportsPageInner */}
            <ReportsGrid />

            {/* Keep your other sections intact below */}
            {/* <ReportsBundles /> */}
            {/* <ReportsCTA /> */}
          </main>
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
          // optionally close after first change:
          // setMobileOpen(false);
        }}
      />
    </div>
  );
}

// Tiny import for useState without adding 'use client' to the whole page module
import * as React from "react";


























