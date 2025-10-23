'use client';
import Hero from '@/components/Hero';

export default function DataInfusionHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Data Infusion"
      headline={
        <>
          Infuse Your{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Current Data
          </span>{" "}
          with EcoFocus Insights
        </>
      }
      subhead={
        <>
          Enrich your research, personas, and decisions with 13 years of
          sustainability attitudes and behaviors. Our 4,000 respondent waves
          (nationally representative, MoE ±1.55%) add context, reduce bias, and
          turn purpose into a growth driver.
        </>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}
