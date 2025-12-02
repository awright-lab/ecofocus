'use client';
import Hero from '@/components/Hero';

export default function CustomHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Custom Studies"
      headline={
        <>
          Custom Research Designed For Your{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Exact Business Questions
          </span>
        </>
      }
      subhead={
        <>
          EcoFocus Custom Studies decode what your consumers, employees, and stakeholders believe, expect, and respond to when it comes to sustainability, so your next move is built on evidence, not gut feel.
        </>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}



