// app/(site)/_components/HomeHero.tsx  (or wherever you keep it)
"use client";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-labelledby="home-hero-title"
    >
      {/* Background video (RIGHT-LEANING COMPOSITION) */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          // nudge the composition so interesting motion sits on the RIGHT
          objectPosition: "70% center",
        }}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-bg-poster.jpg"
      >
        {/* ⬇️ Replace with your NEW background video */}
        <source src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/a95636518d0b_2.mp4" type="video/mp4" />
      </video>

      {/* Overlay video (your existing one), subtle + blend */}
      <video
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-35 pointer-events-none"
        style={{ objectPosition: "70% center" }}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-6-poster.jpg"
      >
        {/* ⬇️ Your current video as the overlay */}
        <source
          src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
          type="video/mp4"
        />
      </video>

      {/* Left gradient scrim = readable text area / negative space */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent" />

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
              Reliable Sustainability Data to Support Your Next Big Marketing
              Decision
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
          {/* spacer ensures right side stays visually dominant for video */}
          <div className="hidden lg:block flex-1" />
        </div>
      </div>
    </section>
  );
}











































