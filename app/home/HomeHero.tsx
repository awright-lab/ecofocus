// app/(site)/_components/HomeHero.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVideoPlaybackRate } from "@/hooks/useVideoPlaybackRate";

export default function HomeHero() {
  const BG = "https://YOUR-CDN/new-hero.mp4";           // ← your new video
  const BG_POSTER = "/images/new-hero-poster.jpg";
  const OVER = "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4";
  const OVER_POSTER = "/images/hero-6-poster.jpg";

  const bgRef = useRef<HTMLVideoElement>(null);
  const overRef = useRef<HTMLVideoElement>(null);
  useVideoPlaybackRate(bgRef, 0.6);
  useVideoPlaybackRate(overRef, 0.6);

  // Right/bottom emphasis — tweak these until the whole leaf is framed how you like
  const posMobile = "95% 84%";   // X% Y%
  const posDesktop = "92% 78%";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* Base fill so 'contain' bars blend cleanly */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Background video — object-contain so it never crops */}
      <video
        ref={bgRef}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ objectPosition: posMobile }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={BG_POSTER}
      >
        <source src={BG} type="video/mp4" />
      </video>

      {/* Overlay video — match fit + position */}
      <video
        ref={overRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-screen opacity-35"
        style={{ objectPosition: posMobile }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={OVER_POSTER}
      >
        <source src={OVER} type="video/mp4" />
      </video>

      {/* Switch objectPosition on md+ for finer framing */}
      <style jsx>{`
        @media (min-width: 768px) {
          video { object-position: ${posDesktop}; }
        }
      `}</style>

      {/* Left scrim = reliable text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent md:from-slate-950/80 md:via-slate-950/55" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[70vh] md:min-h-[68vh] items-center py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 id="home-hero-title" className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
              Decoding the Purpose-Driven{" "}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Generation
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg sm:text-xl text-slate-200">
              Reliable Sustainability Data to Support Your Next Big Marketing Decision
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/benefits" className="rounded-xl bg-emerald-500/90 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 transition">
                Explore Benefits
              </Link>
              <Link href="/contact" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-white hover:bg-white/15 transition">
                Request Details
              </Link>
            </div>
          </div>
          <div className="hidden lg:block flex-1" />
        </div>
      </div>
    </section>
  );
}

