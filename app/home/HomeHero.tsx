"use client";

import Image from "next/image";
import Hero from "@/components/Hero";

export default function HomeHero() {
  return (
    <Hero
      variant="home"
      headline="Decoding the Purpose-Driven Generation"
      subhead="Reliable Sustainability Data to Support Your Next Big Decision"
      ctaPrimary={{ label: "Explore Benefits", href: "/benefits" }}
      ctaSecondary={{ label: "Request Details", href: "/contact" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="light"
      rightVisual={
        <div className="relative w-full aspect-square rounded-xl shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur">
          <Image
            src="/images/laptop.png"
            alt="EcoFocus Dashboard Preview"
            fill
            className="rounded-xl object-cover"
            priority
          />
        </div>
      }
    />
  );
}










































