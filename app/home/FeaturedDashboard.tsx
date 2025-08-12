'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedDashboard() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="dashboard-highlight"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,white_0%,#E0F4FF_80%)]"
    >
      {/* spacing */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
          {/* Right Image on desktop, stacked on mobile */}
          <motion.div
            className="relative order-1 md:order-2 md:col-span-6 flex md:justify-end"
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* soft glows (subtle on mobile) */}
            <div className="pointer-events-none absolute -right-10 -bottom-8 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl md:h-96 md:w-96" />
            <div className="pointer-events-none absolute -left-6 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-3xl md:h-64 md:w-64" />

            {/* Image wrapper with aspect ratio so it scales nicely */}
            <div className="relative z-10 mx-auto w-full max-w-[560px] overflow-hidden rounded-xl shadow-2xl">
              <div className="relative aspect-[5/3]">
                <Image
                  src="/images/dashboard.png" // swap to your actual asset/CMS URL
                  alt="EcoFocus Interactive Dashboard preview"
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Left Content on desktop, second on mobile */}
          <motion.div
            className="order-2 md:order-1 md:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-0.5 text-[10px] uppercase tracking-wide text-emerald-700">
                Dashboard Highlight
              </span>
            </div>

            <h2
              id="dashboard-highlight"
              className="mb-4 font-bold leading-tight text-gray-900 text-[clamp(1.75rem,5.5vw,2.5rem)] md:mb-6"
            >
              Explore the EcoFocus Interactive Dashboard
            </h2>

            <p className="mb-6 text-sm text-gray-700 sm:text-base md:mb-8">
              Instantly access over <strong>90,000 sustainability data points</strong>. Segment by demographics,
              compare trends, and build custom insights in real time — all in one place.
            </p>

            <ul className="mb-8 space-y-3 md:mb-10">
              {[
                'Real-time filtering by demographics & behaviors',
                'Custom crosstabs & chart generation',
                'Export-ready insights & visualizations',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#ef9601] bg-white">
                    <span className="h-2 w-2 rounded-full bg-[#ef9601]" />
                  </span>
                  <span className="text-gray-800 text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              aria-label="View Dashboard Demo"
            >
              <span className="relative z-10">View Dashboard Demo</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}







