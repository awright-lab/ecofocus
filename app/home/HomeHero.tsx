"use client";

import Hero from "@/components/Hero";

export default function HomeHero() {
  return (
    <Hero
  variant="home"
  size="normal"                                   // ← shorter hero
  headline={
    <>
      Decoding the Purpose-Driven{" "}
      <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
        Generation
      </span>
    </>
  }
  subhead="Reliable Sustainability Data to Support Your Next Big Marketing Decision"
  ctaPrimary={{ label: "Explore Benefits", href: "/benefits" }}
  ctaSecondary={{ label: "Request Details", href: "/contact" }}
  videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
  posterSrc="/images/hero-6-poster.jpg"
  overlay="light"                                 // slightly lighter than the report page
  />
  );
}










































