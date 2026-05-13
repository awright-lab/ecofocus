"use client";

import Hero from "@/components/Hero";

export default function RetainerHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Strategic Retainer"
      headline={
        <>
          Flexible Monthly Insight Support Powered by{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            EcoFocus Data
          </span>
        </>
      }
      subhead={
        <>
          Combine EcoFocus data access with recurring analyst support for pitches, presentations, messaging,
          and strategic decision-making without jumping straight into a full custom engagement.
        </>
      }
      ctaPrimary={{ label: "Request pricing details", href: "/contact" }}
      ctaSecondary={{ label: "Book a discovery call", href: "/contact" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}
