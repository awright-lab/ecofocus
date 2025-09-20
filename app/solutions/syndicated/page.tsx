"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import SyndicatedHero from "./SyndicatedHero";
import StudyOverview from "./StudyOverview";
import UseCasesForAgencies from "./UseCasesForAgencies";
import WhatYouGet from "./WhatYouGet";
import MethodologyStripe from "./MethodologyStripe";
import SampleVisual from "./SampleVisual";
import SyndicatedCTA from "./SyndicatedCTA";
import FAQSyndicated from "./FAQSyndicated";

export default function SyndicatedPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <SyndicatedHero />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: "Syndicated Study" },
          ]}
          maxWidth="max-w-7xl"
        />

        <StudyOverview />
        <UseCasesForAgencies />
        <WhatYouGet />
        <MethodologyStripe />
        <SampleVisual />
        <FAQSyndicated />
        <SyndicatedCTA />
      </main>
      <Footer />
    </>
  );
}


