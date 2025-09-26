// app/(site)/_components/HomeHero.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVideoPlaybackRate } from "@/hooks/useVideoPlaybackRate";

export default function HomeHero() {
  const BG =
    "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/74a06e80-80e1-47e4-963c-db953564b8d3_0.mp4";
  const BG_POSTER = "/images/new-hero-poster.jpg";
  const OVER =
    "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4";
  const OVER_POSTER = "/images/hero-6-poster.jpg";

  const bgRef = useRef<HTMLVideoElement>(null);
  const overRef = useRef<HTMLVideoElement>(null);
  useVideoPlaybackRate(bgRef, 0.6);
  useVideoPlaybackRate(overRef, 0.6);

  // BG should stay pinned far right/bottom
  const posMobile = "100% 78%";
  const posDesktop = "100% 80%";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* 0. Base dark gradient so 'contain' bars blend */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,#000_0%,#000_66%,#03070f_100%)]" />

      {/* 1. BACKGROUND video (full leaf visible, pinned right/bottom) */}
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

      {/* 2a. Decorative gradient Swoosh (top-left) — single-line className to avoid styled-jsx parse issues */}
      <div
        aria-hidden="true"
        className="-left-32 -top-40 h-[38rem] w-[38rem] md:-left-24 md:-top-48 md:h-[45rem] md:w-[45rem] lg:-left-32 lg:-top-52 lg:h-[52rem] lg:w-[52rem] absolute z-[3] pointer-events-none"
        style={{
          background:
            "conic-gradient(from 200deg at 40% 40%, rgba(16,185,129,0.85), rgba(56,189,248,0.75), rgba(16,185,129,0.9)), radial-gradient(55% 55% at 45% 45%, rgba(16,185,129,0.9), rgba(16,185,129,0))",
          mixBlendMode: "normal",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 35% 35%, #000 60%, rgba(0,0,0,0) 72%)",
          maskImage:
            "radial-gradient(120% 120% at 35% 35%, #000 60%, rgba(0,0,0,0) 72%)",
          filter: "blur(0.5px)",
          opacity: 0.85,
        }}
      />

      {/* 2b. Soft right-side glow */}
      <div
        aria-hidden="true"
        className="absolute right-[-15%] top-10 z-[3] h-[28rem] w-[35rem] md:right-[-10%] md:top-6 md:h-[34rem] md:w-[42rem] lg:right-[-6%] lg:top-4 lg:h-[40rem] lg:w-[50rem] pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 50%, rgba(56,189,248,0.28), rgba(16,185,129,0.18) 45%, rgba(3,7,15,0) 70%)",
          mixBlendMode: "screen",
          filter: "blur(2px)",
          opacity: 0.9,
        }}
      />

      {/* 3. OVERLAY texture video (covers hero) */}
      <video
        ref={overRef}
        data-kind="overlay"
        className="pointer-events-none absolute inset-0 z-[4] h-full w-full object-cover mix-blend-screen opacity-25"
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

      {/* 4. Left scrim for text readability */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent md:from-slate-950/80 md:via-slate-950/55" />

      {/* 5. CONTENT */}
      <div className="relative z-[6] mx-auto max-w-7xl px-4 sm:px-6">
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

      {/* Only move the BG on desktop; leave overlay centered to cover */}
      <style jsx>{`
        @media (min-width: 768px) {
          video[data-kind="bg"] { object-position: ${posDesktop}; }
        }
      `}</style>
    </section>
  );
}




