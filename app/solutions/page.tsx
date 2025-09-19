// app/solutions/page.tsx
"use client";

import { useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import SolutionsHero from "./SolutionsHero";
import SolutionsOverview from "./SolutionsOverview";
import SolutionsHighlights from "./SolutionsHighlights";
import SolutionsFeaturedOfferings from "./SolutionsFeaturedOfferings";
import SolutionsComparison from "./SolutionsComparison";
import FinalCTA from "./FinalCTA";

export default function SolutionsPage() {
  useReducedMotion(); // keeps parity with other pages even if unused below

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <SolutionsHero />

        {/* Breadcrumbs aligned with content width */}
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Solutions" }]}
          maxWidth="max-w-7xl"
        />

        {/* Page sections – keep existing components but ensure the same rhythm as Home */}
        <div id="solutions-overview">
          <SolutionsOverview />
        </div>

        {/* Tabs/feature band */}
        <SolutionsHighlights />

        {/* Featured products / bundles */}
        <SolutionsFeaturedOfferings />

        {/* Comparison grid */}
        <SolutionsComparison />

        {/* Bold CTA slab (already styled inside component) */}
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}




