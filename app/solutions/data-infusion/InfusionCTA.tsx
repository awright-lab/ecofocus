'use client';

import Link from 'next/link';

export default function InfusionCTA() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="cta-infusion">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <h2 id="cta-infusion" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5vw,2.1rem)]">
          Ready to Enrich Your Data With Sustainability Insight?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          We start with a no-cost discovery call to align on objectives, data formats, and deliverables.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white shadow hover:bg-emerald-700"
          >
            Book a discovery call
          </Link>
        </div>
      </div>
    </section>
  );
}
