"use client";

import { useState } from "react";
import { useReportSearchParams } from "./useReportSearchParams";
import { LeftFilterRail } from "./LeftFilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import ReportsGrid from "./ReportsGrid";

// import your existing sections:
// import ReportsHero from "./sections/ReportsHero";
// import ReportsFiltersTop from "./sections/ReportsFiltersTop"; // (remove if you don’t want the old horizontal bar anymore)
// import AccessTabs from "./sections/AccessTabs";
// import ReportsBundles from "./sections/ReportsBundles";
// import ReportsCTA from "./sections/ReportsCTA";

export default function ReportsPage() {
  const { values, setParam } = useReportSearchParams();
  const { access, year, topic, type } = values;

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Keep your hero and any content above */}
      {/* <ReportsHero /> */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* If you want to keep your existing top search bar or breadcrumbs, render it here */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT rail (desktop) + mobile button */}
          <aside className="lg:col-span-3">
            <button
              className="lg:hidden w-full rounded-xl border border-emerald-200 py-2 text-emerald-900"
              onClick={() => setMobileOpen(true)}
            >
              Filters
            </button>
            <div className="hidden lg:block">
              <LeftFilterRail access={access} year={year} topic={topic} type={type} setParam={setParam} />
            </div>
          </aside>

          {/* RIGHT column: keep all your existing sections here */}
          <main className="lg:col-span-9 space-y-10">
            {/* If you want to keep access tabs (All / Free / Premium) visible on the right above list, keep them; they still sync via URL params */}
            {/* <AccessTabs /> */}

            {/* This is the ONLY part we swapped earlier: reports list in horizontal rows */}
            <ReportsGrid />

            {/* Keep your other sections intact */}
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
          // Keep open so users can set multiple filters; close if you prefer:
          // setMobileOpen(false);
        }}
      />
    </div>
  );
}

























