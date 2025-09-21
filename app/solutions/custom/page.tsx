"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import CustomHero from "./CustomHero";
import CustomOverview from "./CustomOverview";
import CustomMethods from "./CustomMethods";
import CustomWorkflow from "./CustomWorkflow";
import DeliverablesCustom from "./DeliverablesCustom";
import SampleOutputs from "./SampleOutputs";
import FAQCustom from "./FAQCustom";
import CustomCTA from "./CustomCTA";

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

        <CustomOverview />
        <CustomMethods />
        <CustomWorkflow />
        <DeliverablesCustom />
        <SampleOutputs />
        <FAQCustom />
        <CustomCTA />
      </main>
      <Footer />
    </>
  );
}




