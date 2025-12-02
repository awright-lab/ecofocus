"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import IntegrationHero from "./IntegrationHero";
import IntegrationOverview from "./IntegrationOverview";
import IntegrationCTA from "./IntegrationCTA";
import Spotlight from "./Spotlight";
import MethodologySection from "./MethodologySection";
import UseCasesGrid from "./UseCasesGrid";
import DataAccessOptions from "./DataAccessOptions";
import WhatYouGet from "./WhatYouGet";
import SampleVisual from "../syndicated/SampleVisual";
import DifferentiatorsShowcase from "./DifferentiatorsShowcase";

export default function EnhanceYourDataPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <IntegrationHero />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Data Integration" },
          ]}
          maxWidth="max-w-7xl"
        />

        <IntegrationOverview />
        <Spotlight />
        <MethodologySection />
        <DifferentiatorsShowcase />
        <UseCasesGrid />
        <DataAccessOptions />
        <SampleVisual />
        <WhatYouGet />
        <IntegrationCTA />
      </main>
      <Footer />
    </>
  );
}

