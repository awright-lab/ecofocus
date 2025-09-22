// app/reports/ReportsClient.tsx
"use client";

import * as React from "react";
import { Suspense } from "react";
import ReportsGrid from "./ReportsGrid";
import { LeftFilterRail } from "./LeftFilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useReportSearchParams } from "./useReportSearchParams";

function Body() {
  const { values, setParam } = useReportSearchParams();
  const { access, year, topic, type } = values;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Keep your hero / tabs / etc. here if they live on this page */}

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

          {/* RIGHT column */}
          <main className="lg:col-span-9 space-y-10">
            {/* List (uses useSearchParams internally) */}
            <ReportsGrid />

            {/* Keep your other sections intact below if you render them here */}
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
          // setMobileOpen(false); // uncomment if you want to auto-close
        }}
      />
    </div>
  );
}

export default function ReportsClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 text-emerald-800">
          Loading reports…
        </div>
      }
    >
      <Body />
    </Suspense>
  );
}
