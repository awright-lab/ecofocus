"use client";

import { useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import SolutionsHero from "./SolutionsHero";
import InteractiveDashboardShowcase from "./InteractiveDashboardShowcase";
import SolutionsOverview from "./SolutionsOverview";
import SolutionsComparison from "./SolutionsComparison";
import SolutionsFeaturedOfferings from "./SolutionsFeaturedOfferings";
import SolutionsHighlights from "./SolutionsHighlights";
import FinalCTA from "./FinalCTA";
import DashboardIntro from "./DashboardIntro";

export default function SolutionsPage() {
  useReducedMotion();

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <SolutionsHero />

        <DashboardIntro />

        {/* Heavier weight: delivery layer */}
        <InteractiveDashboardShowcase />

        {/* 3 pillars */}
        <SolutionsOverview />

        {/* Compare the pillars (dashboard handled in rows, not a column) */}
        <SolutionsComparison />

        {/* SKUs mapped to pillars + seat packs */}
        <SolutionsFeaturedOfferings />

        {/* Outcomes band */}
        <SolutionsHighlights />

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}





