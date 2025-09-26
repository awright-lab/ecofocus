// app/(site)/_components/HomeHero.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVideoPlaybackRate } from "@/hooks/useVideoPlaybackRate";

export default function HomeHero() {
  const BG = "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/74a06e80-80e1-47e4-963c-db953564b8d3_0.mp4";
  const BG_POSTER = "/images/new-hero-poster.jpg";
  const OVER = "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4";
  const OVER_POSTER = "/images/hero-6-poster.jpg";

  const bgRef = useRef<HTMLVideoElement>(null);
  const overRef = useRef<HTMLVideoElement>(null);
  useVideoPlaybackRate(bgRef, 0.6);
  useVideoPlaybackRate(overRef, 0.6);

  const posMobile = "100% 78%";
  const posDesktop = "100% 80%";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* Base dark gradient to hide letterboxing when object-contain is used */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,#000_0%,#000_66%,#03070f_100%)]" />

      {/* BACKGROUND video (pinned right/bottom) */}
      <video
        ref={bgRef}
        data-kind="bg"
        className="absolute inset-0 z-[2] h-full w-full object-contain"
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

      {/* Overlay texture video (subtle noise/texture) */}
      <video
        ref={overRef}
        data-kind="overlay"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover mix-blend-screen opacity-25"
        style={{ objectPosition: "50% 50%" }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={OVER_POSTER}
      >
        <source src={OVER} type="video/mp4" />
      </video>

      {/* --- Gradient overlay stack: mockup style --- */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {/* Emerald/teal sweep from top-left across hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-800/70 to-transparent" />
        {/* Cyan/teal radial glow over the right/center image region */}
        <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.28)_0%,rgba(16,185,129,0.18)_45%,transparent_70%)] mix-blend-screen" />
        {/* Bottom vignette fade into page content */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03070f] via-[#03070f]/80 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="relative z-[5] mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[68vh] md:min_h-[62vh] items-center py-16 sm:py-24">
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
              <Link
                href="/benefits"
                className="rounded-xl bg-emerald-500/90 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 transition"
              >
                Explore Benefits
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-white hover:bg-white/15 transition"
              >
                Request Details
              </Link>
            </div>
          </div>
          <div className="hidden lg:block flex-1" />
        </div>
      </div>

      {/* Desktop: shift BG further down/right to match composition */}
      <style jsx>{`
        @media (min-width: 768px) {
          video[data-kind="bg"] { object-position: ${posDesktop}; }
        }
      `}</style>
    </section>
  );
}





