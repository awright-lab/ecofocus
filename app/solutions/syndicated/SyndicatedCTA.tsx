'use client';

import Link from 'next/link';

export default function SyndicatedCTA() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="cta-syndicated">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <h2 id="cta-syndicated" className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5vw,2.1rem)]">
          Let’s Find a Way to Work Together
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          We start with a no-cost, no-obligation discovery call to align objectives and define success. From there,
          we’ll tailor access and add-ons to your goals and budget.
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


