'use client';
import Hero from '@/components/Hero';

export default function IntegrationHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Data Integration"
      headline={
        <>
          Enhance Your Data With{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Sustainability Intelligence
          </span>
        </>
      }
      subhead={
        <>
          Transform your existing datasets—sales, personas, trackers, CRM, loyalty, or research—by wrapping them
          with 13+ years of EcoFocus sustainability intelligence. Bring clarity and context to the KPIs your
          teams care about most.
        </>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}