'use client';

import Hero from '@/components/Hero';

export default function NewsletterHero() {
  return (
    <div className="relative">
      <Hero
        variant="solutions"
        size="normal"
        badge="Newsletter"
        headline={
          <>
            Get EcoFocus{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Insights
            </span>
          </>
        }
        videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
        posterSrc="/images/hero-6-poster.jpg"
        overlay="dense"
      />

      <div className="absolute -bottom-px left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 animate-gradient" />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 h-14 w-14 rounded-full bg-[#EF9601]/20 blur-xl"
      />
    </div>
  );
}
