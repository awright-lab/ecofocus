'use client';
import Hero from '@/components/Hero';

export default function SyndicatedHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Syndicated Study"
      headline={
        <>
          Decoding the{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Purpose-Driven Generation
          </span>
        </>
      }
      subhead={
        <>
          Reliable sustainability data to support your next big decision.
          Actionable, behavior-anchored insights revealing what today’s
          purpose-minded consumers believe, expect, and do—delivered through our
          interactive dashboard so your team can explore, segment, and export
          with confidence.
        </>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}



