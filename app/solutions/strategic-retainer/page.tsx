"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import RetainerOffer from "../RetainerOffer";
import InteractiveDashboardShowcase from "../InteractiveDashboardShowcase";
import FinalCTA from "../FinalCTA";

export default function StrategicRetainerPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Strategic Retainer", href: "/solutions/strategic-retainer" },
          ]}
          maxWidth="max-w-7xl"
        />

        <RetainerOffer />
        <InteractiveDashboardShowcase />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
