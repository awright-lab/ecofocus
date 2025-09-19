// app/solutions/syndicated/page.tsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import SyndicatedHero from "./SyndicatedHero";
import SyndicatedOverview from "./SyndicatedOverview";
import SyndicatedBenefits from "./SyndicatedBenefits";
import CoverageGrid from "./CoverageGrid";
import SyndicatedReportHighlight from "./SyndicatedReportHighlight";
import DataAccessOptions from "./DataAccessOptions";
import UseCasesGrid from "./UseCasesGrid";
import DifferentiatorsGrid from "./DifferentiatorsGrid";
import TopicsGrid from "./TopicsGrid";
import DataSnapshotPreview from "./DataSnapshotPreview";
import SyndicatedCTA from "./SyndicatedCTA";

export default function SyndicatedResearchPage() {
  return (
    <main className="bg-white text-gray-900">
      <Header />
      <SyndicatedHero />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Solutions", href: "/solutions" },
          { label: "Syndicated Research" },
        ]}
        maxWidth="max-w-7xl"
      />

      <SyndicatedOverview />
      <SyndicatedBenefits />
      <CoverageGrid />
      <SyndicatedReportHighlight />
      <DataAccessOptions />
      <UseCasesGrid />
      <DifferentiatorsGrid />
      <TopicsGrid />
      <DataSnapshotPreview />
      <SyndicatedCTA />
      <Footer />
    </main>
  );
}

