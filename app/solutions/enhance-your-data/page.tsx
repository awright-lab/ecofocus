"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import IntegrationHero from "./IntegrationHero";
import IntegrationOverview from "./IntegrationOverview";
import IntegrationWorkflow from "./IntegrationWorkflow";
import DataWeJoin from "./DataWeJoin";
import DeliverablesIntegrations from "./DeliverablesIntegrations";
import SampleJoinVisual from "./SampleJoinVisual";
import SecurityGovernance from "./SecurityGovernance";
import FAQIntegration from "./FAQIntegration";
import IntegrationCTA from "./IntegrationCTA";

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
        <IntegrationWorkflow />
        <DataWeJoin />
        <DeliverablesIntegrations />
        <SampleJoinVisual />
        <SecurityGovernance />
        <FAQIntegration />
        <IntegrationCTA />
      </main>
      <Footer />
    </>
  );
}

