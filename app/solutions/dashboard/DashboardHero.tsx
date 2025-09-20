"use client";

import Hero from "@/components/Hero";

export default function DashboardHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Interactive Dashboard"
      headline={
        <>
          The EcoFocus Sustainability <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">Insights Workbench</span>
        </>
      }
      subhead={
        <>
          Go beyond toplines: segment builder, crosstabs, trend comparisons, and export-ready visuals.
          Everything is seat-based and agency-friendly.
        </>
      }
      ctaPrimary={{ label: "Watch the demo", href: "#demo" }}
      ctaSecondary={{ label: "See Seat Packs", href: "/solutions/seat-packs" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}

