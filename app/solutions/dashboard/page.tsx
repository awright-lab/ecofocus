"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import DashboardHero from "./DashboardHero";
import DashboardOverview from "./DashboardOverview";
import DashboardDemo from "./DashboardDemo";
import DashboardFeatures from "./DashboardFeatures";
import DashboardAccessCTA from "./DashboardAccessCTA";

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

        {/* White prelude that explains how teams actually use it */}
        <DashboardOverview />

        {/* Bold emerald slab with the demo video */}
        <DashboardDemo />

        {/* Feature cards grid (exports, filters, saved views, etc.) */}
        <DashboardFeatures />

        {/* Seat packs / pricing CTA */}
        <DashboardAccessCTA />
      </main>
      <Footer />
    </>
  );
}

