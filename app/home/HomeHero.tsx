// app/(site)/_components/HomeHero.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVideoPlaybackRate } from "@/hooks/useVideoPlaybackRate";

export default function HomeHero() {
  // Videos you already use
  const BG =
    "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/74a06e80-80e1-47e4-963c-db953564b8d3_0.mp4"; // leaf video
  const BG_POSTER = "/images/new-hero-poster.jpg";
  const OVER =
    "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"; // overlay texture
  const OVER_POSTER = "/images/hero-6-poster.jpg";

  const bgRef = useRef<HTMLVideoElement>(null);
  const overRef = useRef<HTMLVideoElement>(null);
  useVideoPlaybackRate(bgRef, 0.6);
  useVideoPlaybackRate(overRef, 0.6);

  // Background position: show more image on the right/bottom
  const posMobile = "100% 78%";
  const posDesktop = "100% 82%";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* 0) Base dark wash to hide letterbox from object-contain */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,#021515_0%,#021a19_60%,#03070f_100%)]" />

      {/* 1) Background video (pinned to right/bottom) */}
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

      {/* 2) Subtle texture overlay (keeps highlights lively) */}
      <video
        ref={overRef}
        data-kind="overlay"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover mix-blend-screen opacity-20"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={OVER_POSTER}
      >
        <source src={OVER} type="video/mp4" />
      </video>

      {/* 3) Curved gradient overlay system (reference style) */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {/* A) Unique curved left panel (polygon clipPath) */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[68%] bg-gradient-to-br from-emerald-400/95 via-emerald-500/90 to-sky-500/85"
          style={{
            // polygon gives the “swooped wedge” like the reference
            clipPath:
              "polygon(0% 0%, 72% 0%, 48% 50%, 62% 100%, 0% 100%)",
          }}
        />

        {/* B) Soft elliptical glow for depth under the panel edge */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[44%] bg-gradient-to-br from-emerald-300/35 to-sky-400/20"
          style={{
            clipPath: "ellipse(80% 100% at 0% 50%)",
            filter: "blur(0.5px)",
          }}
        />

        {/* C) Gentle teal wash feather (improves text legibility; no seams) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(3,94,78,0.55) 8%, rgba(8,145,128,0.35) 38%, rgba(3,7,15,0) 72%)",
          }}
        />

        {/* D) Very subtle dot texture on left half only */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.2px)",
            backgroundSize: "22px 22px",
            opacity: 0.25,
            WebkitMaskImage:
              "linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* E) Long, soft bottom vignette (no harsh band) */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgba(5,9,11,0.8)_0%,rgba(5,9,11,0.5)_35%,rgba(5,9,11,0.12)_75%,rgba(5,9,11,0)_100%)]" />
      </div>

      {/* 4) Content */}
      <div className="relative z-[5] mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[68vh] md:min-h-[62vh] items-center py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1
              id="home-hero-title"
              className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white"
            >
              Decoding the Purpose-Driven{" "}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Generation
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/90">
              Reliable Sustainability Data to Support Your Next Big Marketing Decision
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/benefits"
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 font-semibold text-white transition"
              >
                Explore Benefits
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-white hover:bg-white/15 transition"
              >
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








