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
          Sustainability + your data:{" "}
          <span className="text-amber-500">sharper personas, stronger proof</span>
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
