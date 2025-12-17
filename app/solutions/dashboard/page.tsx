"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import DashboardHero from "./DashboardHero";
import DashboardDemo from "./DashboardDemo";
import DashboardAccessCTA from "./DashboardAccessCTA";
import DashboardDifferentiators from "./DashboardDifferentiators";
import DashboardCapabilities from "./DashboardCapabilities";
import DashboardMethodology from "./DashboardMethodology";
import DashboardUseCases from "./DashboardUseCases";
import DashboardAccess from "./DashboardAccess";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <DashboardHero />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Interactive Dashboard" },
          ]}
          maxWidth="max-w-7xl"
        />

        {/* Deep-dive sections (no repeats from Solutions) */}
        <DashboardDifferentiators />
        <DashboardCapabilities />

        {/* Demo slab */}
        <DashboardDemo />

        <DashboardMethodology />
        <DashboardUseCases />
        <DashboardAccess />

        <DashboardAccessCTA />
      </main>
      <Footer />
    </>
  );
}


