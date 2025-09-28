'use client';

import Hero from "@/components/Hero";

export default function AboutHero() {
  return (
    // wrapper lets us add a brand accent without changing <Hero/>
    <div className="relative">
      <Hero
        variant="solutions"
        size="normal" // compact height
        badge="Our Story"
        headline={
          <>
            Shaping Tomorrow with{" "}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Sustainable 
            </span>{" "}
            Insights
          </>
        }
        subhead={
          <>
            EcoFocus Research helps businesses understand U.S. consumers’ evolving attitudes and behaviors about sustainability.
          </>
        }
        videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
        posterSrc="/images/hero-6-poster.jpg"
        overlay="dense" // heavier tint than Home
      />

      {/* subtle marigold accent bar (brand pop) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 h-1 w-36 rounded-r-full bg-[#FFC247]"
      />
    </div>
  );
}






