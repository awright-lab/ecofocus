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

  // keep the leaf/video anchored to the right/bottom like your current build
  const posMobile = "100% 78%";
  const posDesktop = "100% 82%";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* 0) Dark base to hide letterboxing from object-contain */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,#021515_0%,#001a18_60%,#03070f_100%)]" />

      {/* 1) Background video (pinned) */}
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

      {/* 2) Subtle texture overlay */}
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

      {/* 3) Mockup-style overlay system */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {/* A) Big lime/emerald swoosh (top-left crescent) */}
        <div
          aria-hidden="true"
          className="absolute -left-40 -top-48 h-[64rem] w-[64rem] md:-left-44 md:-top-56 md:h-[72rem] md:w-[72rem] lg:-left-56 lg:-top-64 lg:h-[82rem] lg:w-[82rem]"
          style={{
            // bright green head + darker tail, matching the mock’s lime-to-emerald sweep
            background:
              "conic-gradient(from 210deg at 40% 40%, rgba(163,230,53,0.85), rgba(16,185,129,0.95), rgba(5,150,105,0.9) 65%, rgba(2,44,34,0.0) 85%)",
            // crescent mask to get the curved bite shape
            WebkitMaskImage:
              "radial-gradient(120% 85% at 38% 38%, #000 60%, rgba(0,0,0,0) 72%)",
            maskImage:
              "radial-gradient(120% 85% at 38% 38%, #000 60%, rgba(0,0,0,0) 72%)",
            filter: "blur(0.8px)",
          }}
        />

        {/* B) Deeper emerald swoosh underneath to add body (offset/rotated) */}
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-28 h-[46rem] w-[46rem] md:-left-20 md:-top-32 md:h-[52rem] md:w-[52rem] rotate-[8deg]"
          style={{
            background:
              "conic-gradient(from 220deg at 42% 42%, rgba(6,95,70,0.95), rgba(4,47,46,0.9), rgba(6,95,70,0.8) 70%, rgba(2,44,34,0.0) 86%)",
            WebkitMaskImage:
              "radial-gradient(110% 80% at 42% 40%, #000 58%, rgba(0,0,0,0) 72%)",
            maskImage:
              "radial-gradient(110% 80% at 42% 40%, #000 58%, rgba(0,0,0,0) 72%)",
            filter: "blur(0.6px)",
            opacity: 0.9,
          }}
        />

        {/* C) Teal wash across mid-left to improve text contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(3,94,78,0.85) 10%, rgba(8,145,128,0.55) 38%, rgba(3,7,15,0) 70%)",
          }}
        />

        {/* D) Cyan/teal glow on the right (keeps image vibrant) */}
        <div
          aria-hidden="true"
          className="absolute right-[-6%] top-[4%] h-[44rem] w-[52rem] md:right-[-4%] md:h-[50rem] md:w-[60rem] lg:right-[-2%] lg:h-[56rem] lg:w-[68rem]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,0.28) 0%, rgba(16,185,129,0.18) 45%, rgba(3,7,15,0) 72%)",
            mixBlendMode: "screen",
          }}
        />

        {/* E) Very soft dots on left 60% only (like the mock) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.2px)",
            backgroundSize: "22px 22px",
            opacity: 0.35,
            WebkitMaskImage:
              "linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* F) Bottom vignette to blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0a0f12] via-[#0a0f12]/90 to-transparent" />
      </div>

      {/* 4) Content */}
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






