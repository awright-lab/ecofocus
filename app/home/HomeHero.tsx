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
  const posDesktop = "100% 82%";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* Base wash to hide letterboxing from object-contain */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,#021515_0%,#021a19_60%,#03070f_100%)]" />

      {/* BACKGROUND video (pinned right/bottom) */}
      <video
        ref={bgRef}
        data-kind="bg"
        className="absolute inset-0 z-[2] h-full w-full object-contain"
        style={{ objectPosition: posMobile }}
        autoPlay muted loop playsInline preload="auto" poster={BG_POSTER}
      >
        <source src={BG} type="video/mp4" />
      </video>

      {/* Subtle texture overlay */}
      <video
        ref={overRef}
        data-kind="overlay"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover mix-blend-screen opacity-20"
        autoPlay muted loop playsInline preload="auto" poster={OVER_POSTER}
      >
        <source src={OVER} type="video/mp4" />
      </video>

      {/* ===== Overlay system (no seams, soft edges) ===== */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {/* A) Big lime/emerald arc (soft crescent) */}
        <div
          aria-hidden="true"
          className="absolute -left-40 -top-48 h-[68rem] w-[68rem] md:-left-48 md:-top-56 md:h-[76rem] md:w-[76rem] lg:-left-56 lg:-top-64 lg:h-[84rem] lg:w-[84rem]"
          style={{
            background:
              "radial-gradient(70% 70% at 35% 35%, rgba(163,230,53,0.85) 0%, rgba(16,185,129,0.9) 45%, rgba(4,120,87,0.75) 62%, rgba(2,44,34,0) 75%)",
            WebkitMaskImage:
              "radial-gradient(120% 90% at 38% 40%, #000 58%, rgba(0,0,0,0) 73%)",
            maskImage:
              "radial-gradient(120% 90% at 38% 40%, #000 58%, rgba(0,0,0,0) 73%)",
            filter: "blur(0.6px)"
          }}
        />

        {/* B) Deeper emerald arc underneath for body (offset a bit) */}
        <div
          aria-hidden="true"
          className="absolute -left-10 -top-6 h-[46rem] w-[46rem] md:-left-8 md:-top-10 md:h-[52rem] md:w-[52rem] rotate-[7deg]"
          style={{
            background:
              "radial-gradient(65% 65% at 30% 30%, rgba(6,95,70,0.95) 0%, rgba(4,47,46,0.9) 58%, rgba(2,44,34,0) 80%)",
            WebkitMaskImage:
              "radial-gradient(115% 85% at 40% 38%, #000 58%, rgba(0,0,0,0) 75%)",
            maskImage:
              "radial-gradient(115% 85% at 40% 38%, #000 58%, rgba(0,0,0,0) 75%)",
            filter: "blur(0.5px)",
            opacity: 0.92
          }}
        />

        {/* C) Gentle teal wash (left → middle). Broad feather so no seam. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(3,94,78,0.88) 6%, rgba(8,145,128,0.55) 42%, rgba(3,7,15,0) 78%)"
          }}
        />

        {/* D) Cyan/teal glow over right image (screen blend, feathered) */}
        <div
          aria-hidden="true"
          className="absolute right-[-4%] top-[2%] h-[52rem] w-[64rem] md:right-[-2%] md:h-[56rem] md:w-[70rem]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,0.26) 0%, rgba(16,185,129,0.16) 48%, rgba(3,7,15,0) 76%)",
            mixBlendMode: "screen"
          }}
        />

        {/* E) Soft dots on left ~60% only */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1.2px)",
            backgroundSize: "22px 22px",
            opacity: 0.28,
            WebkitMaskImage:
              "linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,0) 100%)"
          }}
        />

        {/* F) Long, soft bottom vignette (no hard band) */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_top,rgba(5,9,11,0.9)_0%,rgba(5,9,11,0.75)_22%,rgba(5,9,11,0.45)_48%,rgba(5,9,11,0.12)_78%,rgba(5,9,11,0)_100%)]" />
      </div>
      {/* ===== end overlay system ===== */}

      {/* CONTENT */}
      <div className="relative z-[5] mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[68vh] md:min-h-[62vh] items-center py-16 sm:py-24">
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

      {/* Desktop BG alignment */}
      <style jsx>{`
        @media (min-width: 768px) {
          video[data-kind="bg"] { object-position: ${posDesktop}; }
        }
      `}</style>
    </section>
  );
}







