// app/reports/ReportsPageClient.tsx
"use client";

import * as React from "react";
import ReportsGrid from "./ReportsGrid";
import { LeftFilterRail } from "./LeftFilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useReportSearchParams } from "./useReportSearchParams";
import ReportsBundles from "./ReportsBundles";

export default function ReportsPageClient() {
  const { values, setParam } = useReportSearchParams();
  const { access, year, topic, type } = values;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Centered container: filters + grid */}
      <div id="report-catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

          <main className="lg:col-span-9 space-y-10">
            <ReportsGrid />
          </main>
        </div>
      </div>

      {/* Full-width brand slabs below the list */}
      <section className="bg-[#213F97]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ReportsBundles />
        </div>
      </section>

      <MobileFilterDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        access={access}
        year={year}
        topic={topic}
        type={type}
        setParam={(k, v) => {
          setParam(k, v);
          // setMobileOpen(false);
        }}
      />
    </>
  );
}
