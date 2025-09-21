"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import ReportsHero from "./ReportsHero";
import ReportsFilters from "./ReportsFilters";
import ReportsGrid from "./ReportsGrid";
import ReportsBundles from "./ReportsBundles";
import ReportsCTA from "./ReportsCTA";

export default function ReportsPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <ReportsHero />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Reports" },
          ]}
          maxWidth="max-w-7xl"
        />

        <ReportsFilters />
        <ReportsGrid />
        <ReportsBundles />
        <ReportsCTA />
      </main>
      <Footer />
    </>
  );
}



















