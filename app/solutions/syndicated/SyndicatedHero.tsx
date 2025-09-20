"use client";
import Hero from "@/components/Hero";

export default function SyndicatedHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Syndicated Study"
      headline={
        <>
          Defendable Sustainability{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">Trendlines</span> Since 2010
        </>
      }
      subhead={
        <>
          Nationally representative insights that decode the purpose-driven
          generations. Delivered seat-based in the Interactive Dashboard—so your
          team can explore, segment, and export with confidence.
        </>
      }
      ctaPrimary={{ label: "See Seat Packs", href: "/solutions/seat-packs" }}
      ctaSecondary={{ label: "View Methodology", href: "/about/methodology" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}



