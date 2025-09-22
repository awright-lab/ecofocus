// app/reports/page.tsx
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ReportsPageClient from "./ReportsPageClient"; // client body
import AccessTabs from "./AccessTabs"; // if yours lives at ./sections/AccessTabs, change this import

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <>
      <Header />

      {/* Hero — deep blue slab + subtle grid, matching your site hero style */}
      <section
        id="reports-hero"
        className="relative section-slab-deep bg-grid-soft"
        aria-labelledby="reports-hero-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-18 md:py-20 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
            Reports &amp; Briefs
          </p>

          <h1
            id="reports-hero-title"
            className="mt-2 font-bold leading-tight text-[clamp(1.8rem,5.2vw,2.6rem)]"
          >
            Evidence you can <span className="brand-gradient-text">drop into your deck</span>
          </h1>

          <p className="mt-3 max-w-3xl text-sm sm:text-base text-white/90">
            Defendable stats, trend context, and white-label visuals from the EcoFocus syndicated
            study. Built for agencies; ready for pitches, POVs, and approvals.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="/store/seat-packs"
              className="btn-primary-emerald"
            >
              See seat packs
            </a>
            <a
              href="/solutions/dashboard"
              className="btn-secondary-light"
            >
              View dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Tabs just under the hero */}
      <AccessTabs />

      {/* Body (client) */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 text-emerald-800">
            Loading reports…
          </div>
        }
      >
        <ReportsPageClient />
      </Suspense>

      <Footer />
    </>
  );
}
































