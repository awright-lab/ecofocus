"use client";

import Hero from "@/components/Hero";

export default function SolutionsHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Core Services"
      headline={
        <>
          Solutions for sustainable{" "}
          <span className="brand-gradient-text animate-gradient">growth</span>
        </>
      }
      subhead={
        <>
          Syndicated research, data integration, and custom studies—delivered through our
          Interactive Dashboard with white-label exports.
        </>
      }
      ctaPrimary={{ label: "See the Dashboard", href: "#dashboard" }}
      ctaSecondary={{ label: "Talk to us", href: "/contact" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}






