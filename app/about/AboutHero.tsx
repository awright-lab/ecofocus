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
          Turning sustainability{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            insights
          </span>{" "}
          into campaign results
        </>
      }
      subhead={
        <>
          For more than a decade, we’ve helped agencies transform data into strategies
          that align with values, build trust, and move consumers from intent to action.
        </>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"             // heavier tint than Home
    />
  );
}





