'use client';

import Link from 'next/link';

export default function CustomCTA() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="cta-custom">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <h2
          id="cta-custom"
          className="text-center font-bold text-slate-900 text-[clamp(1.6rem,5vw,2.1rem)]"
        >
          Let’s Design the Right Custom Study Together
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          We start with a short discovery call to clarify your decisions, audiences, and timing.
          From there, we’ll scope options—from lean concept tests to full multi-market programs.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white shadow hover:bg-emerald-700 active:translate-y-[1px] transition"
          >
            Book a discovery call
          </Link>
        </div>
      </div>
    </section>
  );
}


