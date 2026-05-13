"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import RetainerHero from "./RetainerHero";
import RetainerOverview from "./RetainerOverview";
import RetainerUseCases from "./RetainerUseCases";
import RetainerIncluded from "./RetainerIncluded";
import RetainerOffer from "../RetainerOffer";
import InteractiveDashboardShowcase from "../InteractiveDashboardShowcase";
import FinalCTA from "../FinalCTA";

export default function StrategicRetainerPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <RetainerHero />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Strategic Retainer", href: "/solutions/strategic-retainer" },
          ]}
          maxWidth="max-w-7xl"
        />

        <RetainerOverview />
        <RetainerUseCases />
        <RetainerOffer />
        <RetainerIncluded />
        <InteractiveDashboardShowcase />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
