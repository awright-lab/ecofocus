import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import AboutHero from "@/app/about/AboutHero";
import MissionApproach from "@/app/about/MissionApproach";
import Outcomes from "@/app/about/Outcomes";
import Leadership from "@/app/about/Leadership";
import MethodologyHighlights from "@/app/about/MethodologyHighlights";
import FinalCTA from "@/app/about/FinalCTA";
import SoftDivider from "@/components/SoftDivider";

export const metadata: Metadata = {
  title: "About EcoFocus",
  description:
    "We help agencies turn sustainability insights into campaign results. Since 2010: nationally representative studies, transparent methods, and actionable dashboards.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <AboutHero />
        <SoftDivider />
        <MissionApproach />
        <SoftDivider />
        <Outcomes />
        <SoftDivider />
        <Leadership />
        <SoftDivider />
        <MethodologyHighlights />
        <FinalCTA
          eyebrow="Next Steps"
          headline="Your next campaign starts with better insights."
          ctaLabel="See the Data in Action"
          ctaHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}


