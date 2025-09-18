// components/SolutionsHero.tsx
"use client";

import Hero from "@/components/Hero";

export default function SolutionsHero() {
  return (
    <Hero
      variant="solutions"
      size="short" // compact height
      badge="Core Services"
      headline={
        <>
          Solutions for Sustainable{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Growth
          </span>
        </>
      }
      subhead={
        <>
          Syndicated research, custom studies, and data integration—pick what you
          need today and scale as you go.
        </>
      }
      ctaPrimary={{ label: "Explore our Solutions", href: "#syndicated" }}
      ctaSecondary={{ label: "Get in Touch", href: "/contact" }}
      // reuse the SAME abstract lines video as the homepage for cohesion
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense" // heavier tint than Home for contrast
    />
  );
}





