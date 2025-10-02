'use client';

import Hero from "@/components/Hero";
const LAST_UPDATED = 'October 1, 2025';

export default function LegalHero() {
  return (
    // wrapper lets us add a brand accent without changing <Hero/>
    <div className="relative">
      <Hero
        variant="solutions"
        size="normal" // compact height
        badge="Policies"
        headline={
          <>
            Privacy, Terms &amp; Cookies
          </>
        }
        subhead={<>Last updated: {LAST_UPDATED}</>} 
        videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
        posterSrc="/images/hero-6-poster.jpg"
        overlay="dense" // heavier tint than Home
      />
    </div>
  );
}






