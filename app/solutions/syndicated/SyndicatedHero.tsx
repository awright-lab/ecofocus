// app/solutions/syndicated/SyndicatedHero.tsx
"use client";

import Hero from "@/components/Hero";

export default function SyndicatedHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Syndicated Research"
      headline={
        <>
          Track the purpose-driven{" "}
          <span className="brand-gradient-text animate-gradient">generation</span>
        </>
      }
      subhead={
        <>Nationally representative sustainability tracking since 2010—with large samples, deep cuts, and executive-ready evidence.</>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}



