// app/reports/page.tsx
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ReportsPageClient from "./ReportsPageClient"; // client body
import AccessTabs from "./AccessTabs"; // if yours lives at ./sections/AccessTabs, change this import
import ReportsHero from "./ReportsHero";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <>
      <Header />

      {/* Hero — deep blue slab + subtle grid, matching your site hero style */}
      <ReportsHero />

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
































