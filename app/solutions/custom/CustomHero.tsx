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
          Purpose-Built{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Research That Moves Decisions
          </span>
        </>
      }
      subhead={
        <>
          B2C and B2B studies designed around your questions. We combine proven sustainability constructs
          with your audiences, products, and objectives to deliver defensible insights that drive action.
        </>
      }
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}



