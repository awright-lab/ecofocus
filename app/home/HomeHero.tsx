"use client";

import Hero from "@/components/Hero";

export default function HomeHero() {
  return (
    <Hero
  variant="home"
  size="normal"                                   // ← shorter hero
  headline="Decoding the Purpose-Driven Generation"
  subhead="Reliable Sustainability Data to Support Your Next Big Decision"
  ctaPrimary={{ label: "Explore Benefits", href: "/benefits" }}
  ctaSecondary={{ label: "Request Details", href: "/contact" }}
  videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
  posterSrc="/images/hero-6-poster.jpg"
  overlay="light"                                 // slightly lighter than the report page
  />
  );
}










































