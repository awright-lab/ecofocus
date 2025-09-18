"use client";

import Hero from "@/components/Hero";

export default function AboutHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"                 // compact height
      badge="Our Story"
      headline={
        <>
          Independent sustainability{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            research
          </span>{" "}
          since 2010
        </>
      }
      subhead={
        <>
          We help organizations see the signal in the noise—connecting attitudes, behaviors,
          and outcomes so teams can make confident, evidence-based decisions.
        </>
      }
      // same abstract lines video as homepage
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"             // heavier tint than Home
    />
  );
}



