'use client';

import Link from 'next/link';

export default function IntegrationCTA() {
  return (
    <section className="relative bg-gray-50" aria-labelledby="cta-integration">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <h2
          id="cta-integration"
          className="text-center font-bold text-gray-900 text-[clamp(1.6rem,5vw,2.1rem)]"
        >
          Let’s Find the Right Way to Enhance Your Data
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          We begin with a no-cost discovery call to understand the datasets you have, the gaps you’re seeing,
          and what decisions your teams need to make. From there, we’ll shape the right integration path for your
          goals and budget.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 font-medium 
                       text-white shadow hover:bg-emerald-700"
          >
            Book a discovery call
          </Link>
        </div>
      </div>
    </section>
  );
}


