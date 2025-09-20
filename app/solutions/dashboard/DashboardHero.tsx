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
          The EcoFocus sustainability <span className="text-amber-500">insights workbench</span>
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

