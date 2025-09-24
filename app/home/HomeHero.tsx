// app/(site)/_components/HomeHero.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import { useVideoPlaybackRate } from "@/hooks/useVideoPlaybackRate";

export default function HomeHero() {
  // ⬇⬇ Replace with your NEW background video + poster
  const BG_VIDEO_SRC = "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/74a06e80-80e1-47e4-963c-db953564b8d3_0.mp4";
  const BG_POSTER_SRC = "/images/new-hero-poster.jpg";

  // Existing overlay video (subtle “data glow”)
  const OVERLAY_VIDEO_SRC =
    "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4";
  const OVERLAY_POSTER_SRC = "/images/hero-6-poster.jpg";

  // Control playback rate on the overlay video
  const overlayRef = useRef<HTMLVideoElement>(null);
  useVideoPlaybackRate(overlayRef, 0.8); // 0.6 = 40% slower (tweak to taste)

  return (
    <section className="relative">
      {/* Base Hero: uses the NEW background video */}
      <Hero
        variant="home"
        size="tall"
        headline={
          <>
            Decoding the Purpose-Driven{" "}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Generation
            </span>
          </>
        }
        subhead="Reliable Sustainability Data to Support Your Next Big Marketing Decision"
        ctaPrimary={{ label: "Explore Benefits", href: "/benefits" }}
        ctaSecondary={{ label: "Request Details", href: "/contact" }}
        videoSrc={BG_VIDEO_SRC}
        posterSrc={BG_POSTER_SRC}
        overlay="none"
        // If your <Hero> exposes a ref to its <video>, you can also slow it:
        // videoRef={bgRef}  ← then apply useVideoPlaybackRate(bgRef, 0.6)
        // If not, leave as-is and we’ll slow only the overlay below.
      />

      {/* Left gradient scrim → guaranteed text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-transparent sm:from-slate-950/80 sm:via-slate-950/50" />

      {/* Overlay video stacked above Hero (adds subtle highlights/data feel) */}
      <video
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-35"
        style={{
          // Push focal action to the RIGHT to keep left side clean for text
          objectPosition: "80% center",
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={OVERLAY_POSTER_SRC}
      >
        <source src={OVERLAY_VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Content container spacing (optional if your <Hero> already handles this) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="hidden lg:block h-[62vh]" />
      </div>

      {/* Optional: CTA duplicates if your <Hero> doesn't render buttons internally */}
      {/* Remove this block if your Hero already renders the CTAs above */}
      <div className="sr-only">
        <div className="mt-8 flex gap-3">
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
    </section>
  );
}














































