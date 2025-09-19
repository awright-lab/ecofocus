// app/solutions/custom/page.tsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import CustomHero from "./CustomHero";

// keep your local sections as they are
import Approaches from "./Approaches";
import Deliverables from "./Deliverables";
import Process from "./Process";
import UseCases from "./UseCases";
import WhyCustom from "./WhyCustom";
import FinalCTA from "./FinalCTA";

export default function CustomResearchPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <CustomHero />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Custom Research" },
          ]}
          maxWidth="max-w-7xl"
        />

        {/* Your existing sections */}
        <Approaches />
        <WhyCustom />
        <Process />
        <Deliverables />
        <UseCases />

        {/* Reuse your CTA or the shared one */}
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}



