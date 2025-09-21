"use client";

import Hero from "@/components/Hero";

export default function CustomHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Custom Research"
      headline={
        <>
          Custom research, built around{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            the decision
          </span>
        </>
      }
      subhead={
        <>
          Mix qual + quant to pressure-test claims, pricing, packs, and concepts—so your work ships
          with evidence clients can trust.
        </>
      }
      ctaPrimary={{ label: "Start a brief", href: "/contact" }}
      ctaSecondary={{ label: "See Syndicated Study", href: "/solutions/syndicated" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}



