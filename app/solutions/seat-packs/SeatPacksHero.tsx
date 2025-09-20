"use client";

import Hero from "@/components/Hero";

export default function SeatPacksHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Interactive Dashboard"
      headline={
        <>
          Dashboard <span className="text-amber-500">Seat Packs</span>
        </>
      }
      subhead={
        <>
          Give strategy and creative teams seat-based access to the EcoFocus Interactive Dashboard—filter by audience,
          explore trendlines since 2010, and export white-label charts or CSVs for decks, POVs, and briefs.
        </>
      }
      ctaPrimary={{ label: "Request a demo", href: "/contact" }}
      ctaSecondary={{ label: "Back to Solutions", href: "/solutions" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}
