// app/(site)/_components/HomeHero.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVideoPlaybackRate } from "@/hooks/useVideoPlaybackRate";

/**
 * DROP-IN CUSTOM HERO
 * - Right-leaning composition (objectPosition pushes focal motion to the RIGHT)
 * - Two stacked videos (background + optional overlay)
 * - Playback slowed via reusable hook
 * - Left gradient scrim guarantees text readability
 * - Accessible, responsive, minimal and clean
 */
export default function HomeHero() {
  // ⬇️ Replace with your NEW background video + poster
  const BG_VIDEO_SRC = "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/74a06e80-80e1-47e4-963c-db953564b8d3_0.mp4";
  const BG_POSTER_SRC = "/images/new-hero-poster.jpg";

  // Optional subtle overlay video (your existing one)
  const OVERLAY_VIDEO_SRC =
    "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4";
  const OVERLAY_POSTER_SRC = "/images/hero-6-poster.jpg";

  // Control playback rate(s)
  const bgRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLVideoElement>(null);
  useVideoPlaybackRate(bgRef, 0.6);      // 0.6 = 40% slower (tweak to taste)
  useVideoPlaybackRate(overlayRef, 0.6); // slow overlay to match

  // Push focal area RIGHT to keep left side clean for headline/subhead
  const objectPosition = "80% center"; // try "85% center" if you need more bias

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* Background video */}
      <video
        ref={bgRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={BG_POSTER_SRC}
      >
        <source src={BG_VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Overlay video (subtle data-ish highlights) */}
      <video
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-35"
        style={{ objectPosition }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={OVERLAY_POSTER_SRC}
      >
        <source src={OVERLAY_VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Left gradient scrim → readable text over motion (stronger on mobile) */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-transparent sm:from-slate-950/80 sm:via-slate-950/50" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[62vh] items-center py-16 sm:py-24">
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

            <p className="mt-5 max-w-2xl text-lg sm:text-xl text-slate-200">
              Reliable Sustainability Data to Support Your Next Big Marketing Decision
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/benefits"
                className="inline-flex items-center rounded-xl bg-emerald-500/90 px-5 py-3 text-slate-950 font-semibold hover:bg-emerald-400 transition"
              >
                Explore Benefits
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-white hover:bg-white/15 transition"
              >
                Request Details
              </Link>
            </div>
          </div>

          {/* spacer so right side stays visually dominant for the video */}
          <div className="hidden lg:block flex-1" />
        </div>
      </div>
    </section>
  );
}















































