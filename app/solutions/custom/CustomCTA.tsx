// app/solutions/custom/CustomCTA.tsx
'use client';

import Link from 'next/link';

export default function CustomCTA() {
  return (
    <section
      className="relative section-slab-deep"
      aria-labelledby="custom-cta"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="rounded-3xl bg-white/5 px-6 py-8 sm:px-10 sm:py-10 ring-1 ring-white/15 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2
              id="custom-cta"
              className="font-bold text-white text-[clamp(1.6rem,4.4vw,2.2rem)] leading-tight"
            >
              Have a Question the Syndicated Study Can’t Answer?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/85 max-w-xl">
              Let’s talk about the decision you’re trying to make and whether a custom engagement—or a
              tailored extension of the syndicated study—is the right fit.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">Schedule a conversation</span>
            </Link>
            <Link
              href="/solutions/syndicated"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore syndicated study
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

