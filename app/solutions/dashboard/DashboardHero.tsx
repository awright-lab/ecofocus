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
          Explore, filter, export—{" "}
          <span className="text-amber-500">all in one place</span>
        </>
      }
      subhead={
        <>
          Seat-based access to EcoFocus data since 2010. Filter Gen Z & Millennials, explore
          attitudes vs. behaviors, and export white-label charts or CSVs for decks, POVs, and briefs.
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
