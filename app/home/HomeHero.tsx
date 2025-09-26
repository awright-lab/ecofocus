// app/(site)/_components/HomeHero.tsx
"use client";

import Link from "next/link";

export default function HomeHero() {
  const BG =
    "https://images.unsplash.com/photo-1550827783-07a572d03390?auto=format&fit=crop&w=1920&q=80";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* 0) Still background image (cover, bias right) */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${BG})`, backgroundPosition: "80% 40%" }}
      />

      {/* 1) Dark base wash so white text always reads */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#021515_0%,#021a19_55%,#071015_100%)]" />

      {/* 2) Animated gradient “swoosh” (soft, masked blob) */}
      <div
        className="pointer-events-none absolute -z-0 left-[-20%] top-[-30%] h-[120vmin] w-[120vmin] opacity-[0.85]"
        style={{
          background:
            "conic-gradient(from 210deg at 40% 40%, rgba(163,230,53,0.85), rgba(16,185,129,0.9), rgba(56,189,248,0.75))",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 45% 45%, #000 60%, rgba(0,0,0,0) 72%)",
          maskImage:
            "radial-gradient(70% 60% at 45% 45%, #000 60%, rgba(0,0,0,0) 72%)",
          filter: "blur(1px)",
          animation: "hero-drift 24s ease-in-out infinite",
        }}
      />

      {/* 3) Gentle teal wash left->center for legibility (non-seamed) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(3,94,78,0.75) 8%, rgba(8,145,128,0.45) 40%, rgba(3,7,15,0) 78%)",
        }}
      />

      {/* 4) Subtle moving sheen (very low opacity, slow) */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-20"
        style={{
          background:
            "linear-gradient(100deg, transparent 35%, rgba(56,189,248,0.18) 50%, transparent 65%)",
          backgroundSize: "200% 100%",
          animation: "hero-sheen 18s linear infinite",
        }}
      />

      {/* 5) Ultra-light grain for depth (SVG data URI) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.6'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "256px 256px",
        }}
      />

      {/* 6) Long soft bottom vignette (no harsh band) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgba(5,9,11,0.8)_0%,rgba(5,9,11,0.45)_40%,rgba(5,9,11,0)_100%)]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
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

      {/* Animations + reduced motion guard */}
      <style jsx>{`
        @keyframes hero-drift {
          0% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
          50% { transform: translate3d(2%, -1%, 0) rotate(6deg) scale(1.06); }
          100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
        }
        @keyframes hero-sheen {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="hero-drift"], div[style*="hero-sheen"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}









