// app/solutions/custom/CustomHero.tsx
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
          Evidence built for your{" "}
          <span className="brand-gradient-text animate-gradient">decision</span>
        </>
      }
      subhead={
        <>From claims and packs to audience and pricing, we scope the method to the outcome your team needs to defend.</>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}


