"use client";

import Hero from "@/components/Hero";

export default function BlogHero() {
  return (
    <Hero
      variant="solutions"
      size="short" // compact height
      badge="EcoNuggets"
      headline={
        <>
          Fresh sustainability insights that move{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            decisions
          </span>
        </>
      }
      subhead="Bite-size reads from our syndicated research and workflows—built to convert learnings into action."
      ctaPrimary={{ label: "Explore Reports", href: "/reports" }}
      ctaSecondary={{ label: "View Dashboard Demo", href: "/contact?type=demo" }}
      // same abstract lines video used sitewide for cohesion + caching
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense" // heavier than Home
    />
  );
}
