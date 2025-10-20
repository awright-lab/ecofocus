"use client";

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { MeasureCard } from "./MeasureCard";
import { BrandsByVertical } from "./BrandsByVertical";
import { PricingTable } from "./PricingTable";
import { GetResultsCard, MethodsSnapshotCard } from "./Callouts";

export const metadata: Metadata = {
  title:
    "Decoding the Purpose-Driven Shopper: 2025 Brand Benchmark | EcoFocus Research",
  description:
    "Awareness • Purchase Behavior • Eco-Friendly Perception across 41 brands in 4 verticals. Explore packages, pricing, and methods (N=4,000 balanced to US Census).",
  openGraph: {
    title: "Decoding the Purpose-Driven Shopper: 2025 Brand Benchmark",
    description:
      "Awareness • Purchase Behavior • Eco-Friendly Perception. N=4,000 balanced to US Census across CPG, Soft Goods, Homeowners, and Pets.",
    images: ["/og/brand-benchmark-2025.png"],
    type: "website",
  },
};

export default function BrandBenchmarkPage() {
  return (
    <>
      {/* ===== HEADER ===== */}
      <Header />

      <main id="main" className="min-h-screen bg-white">
        {/* HERO (reuses shared component) */}
        <Hero
          variant="report"
          size="tall"
          badge="EcoFocus Research • Syndicated Insights"
          headline={
            <>
              Decoding the Purpose-Driven Shopper:
              <br />
              <span className="text-emerald-300">2025 Brand Benchmark</span>
            </>
          }
          subhead="Awareness • Purchase Behavior • Eco-Friendly Perception"
          ctaPrimary={{ label: "Get Your Brand’s Results", href: "#get-results" }}
          ctaSecondary={{ label: "See Packages & Pricing", href: "#packages" }}
          videoSrc="/video/leaf-neural.mp4"
          posterSrc="/images/hero/leaf-neural.jpg"
          overlay="dense"
        />

        {/* ===== MEASURE CARDS ===== */}
        <section className="container mx-auto grid grid-cols-1 gap-6 px-6 py-16 md:grid-cols-3">
          <MeasureCard
            tone="teal"
            title="Awareness"
            desc='“Which of the following brands have you heard of?”'
            icon="dots"
          />
          <MeasureCard
            tone="slate"
            title="Purchase Behavior"
            desc="Have bought the following brands, plan to buy in the next 12 months, or purchase frequency."
            icon="checklist"
          />
          <MeasureCard
            tone="amber"
            title="Eco-Friendly Perception"
            desc="Based on what you know, rate how green or eco-friendly these companies are."
            icon="gauge"
          />
        </section>

        {/* ===== BRANDS BY VERTICAL ===== */}
        <section className="container mx-auto px-6 pb-10">
          <BrandsByVertical />
        </section>

        {/* ===== PACKAGES & PRICING ===== */}
        <section id="packages" className="container mx-auto px-6 py-14">
          <PricingTable />
        </section>

        {/* ===== CALLOUTS ===== */}
        <section
          id="get-results"
          className="container mx-auto grid grid-cols-1 gap-6 px-6 pb-20 lg:grid-cols-2"
        >
          <GetResultsCard />
          <MethodsSnapshotCard />
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <Footer />
    </>
  );
}
