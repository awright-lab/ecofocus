"use client";

import Hero from "@/components/Hero";

export default function ReportsHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Reports & Briefs"
      headline={
        <>
          Evidence you can{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            drop into your deck
          </span>
        </>
      }
      subhead={
        <>
          Defendable stats, trend context, and white-label visuals from the EcoFocus syndicated study.
          Built for agencies; ready for pitches, POVs, and approvals.
        </>
      }
      ctaPrimary={{ label: "See seat packs", href: "/solutions/seat-packs" }}
      ctaSecondary={{ label: "View dashboard", href: "/solutions/dashboard" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}
