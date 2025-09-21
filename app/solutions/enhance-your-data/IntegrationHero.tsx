"use client";

import Hero from "@/components/Hero";

export default function IntegrationHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Data Integration"
      headline={
        <>
          Sustainability + Your Data:{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">Sharper Personas, Stronger Proof</span>
        </>
      }
      subhead={
        <>
          Blend EcoFocus trendlines with client sales/CRM/BI. Build cohorts that behave like real
          buyers, validate claims before launch, and give teams evidence they can defend.
        </>
      }
      ctaPrimary={{ label: "Talk about your data", href: "/contact" }}
      ctaSecondary={{ label: "See the Dashboard", href: "/solutions/dashboard" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}
