"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import DashboardHero from "./DashboardHero";
import DashboardDemo from "./DashboardDemo";
import CoverageTaxonomy from "./CoverageTaxonomy";
import AnalysisWorkbench from "./AnalysisWorkbench";
import ExportsAndTheming from "./ExportsAndTheming";
import CollaborationGovernance from "./CollaborationGovernance";
import SecurityOps from "./SecurityOps";
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

        {/* Deep-dive sections (no repeats from Solutions) */}
        <CoverageTaxonomy />
        <AnalysisWorkbench />

        {/* Demo slab */}
        <DashboardDemo />

        <ExportsAndTheming />
        <CollaborationGovernance />
        <SecurityOps />

        <DashboardAccessCTA />
      </main>
      <Footer />
    </>
  );
}


