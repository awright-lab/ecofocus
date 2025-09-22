// app/reports/page.tsx
import { Suspense } from "react";

// keep these imports
import ReportsGrid from "./ReportsGrid";
import { LeftFilterRail } from "./LeftFilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useReportSearchParams } from "./useReportSearchParams";

// your existing sections (leave as-is if they already exist)
import AccessTabs from "./AccessTabs";
import ReportsBundles from "./ReportsBundles";
import ReportsCTA from "./ReportsCTA";

// keep dynamic to avoid static prerender with searchParams
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
  // This hook calls useSearchParams(), so it MUST live inside <Suspense>
  const { values, setParam } = useReportSearchParams();
  const { access, year, topic, type } = values;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Optional hero if you render one above */}
      <AccessTabs />

      {/* Centered container: left rail + results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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

          {/* RIGHT: listing */}
          <main className="lg:col-span-9 space-y-10">
            <ReportsGrid />
          </main>
        </div>
      </div>

      {/* FULL-WIDTH slabs below listing */}
      <section className="section-slab-emerald py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ReportsBundles />
        </div>
      </section>

      <section className="section-slab-deep py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ReportsCTA />
        </div>
      </section>

      {/* Mobile drawer */}
      <MobileFilterDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        access={access}
        year={year}
        topic={topic}
        type={type}
        setParam={(k, v) => {
          setParam(k, v);
          // setMobileOpen(false); // uncomment if you want to auto-close after a change
        }}
      />
    </>
  );
}

import * as React from "react";






























