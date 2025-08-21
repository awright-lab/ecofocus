// app/components/FeaturedDashboard.tsx
'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedDashboard() {
  const reduceMotion = useReducedMotion();

  function CollapsibleList({ items, initial = 3 }: { items: string[]; initial?: number }) {
    const [open, setOpen] = React.useState(false);
    const visible = open ? items : items.slice(0, initial);
    return (
      <div>
        <ul className="space-y-2">
          {visible.map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#ef9601] bg-white">
                <span className="h-2 w-2 rounded-full bg-[#ef9601]" />
              </span>
              <span className="text-gray-800 text-sm sm:text-base">{t}</span>
            </li>
          ))}
        </ul>
        {items.length > initial && (
          <button
            onClick={() => setOpen((x) => !x)}
            className="mt-3 text-sm font-medium text-emerald-700 underline"
          >
            {open ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  }

  const bullets = [
    'Real-time filtering by demographics & behaviors',
    'Custom crosstabs & chart generation',
    'Export-ready insights & visualizations',
    '13 years of trend history for context',
    'Fast, secure, 24/7 access',
  ];

  return (
    <section
      aria-labelledby="dashboard-highlight"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,white_0%,#E0F4FF_80%)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-16">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10">
          {/* Content first on mobile; left on desktop */}
          <motion.div
            className="order-1 md:order-1 md:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-0.5 text-[10px] uppercase tracking-wide text-emerald-700">
                Dashboard Highlight
              </span>
            </div>

            <h2
              id="dashboard-highlight"
              className="mb-3 font-bold leading-tight text-gray-900 text-[clamp(1.5rem,4.5vw,2.25rem)] md:mb-4"
            >
              Explore the EcoFocus Interactive Dashboard
            </h2>

            <p className="mb-4 text-sm text-gray-700 sm:text-base">
              Instantly access over <strong>90,000 sustainability data points</strong>. Segment by demographics,
              compare trends, and build custom insights in real time — all in one place.
            </p>

            <CollapsibleList items={bullets} initial={3} />

            <Link
              href="/dashboard"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
              aria-label="View Dashboard Demo"
            >
              View Dashboard Demo
            </Link>
          </motion.div>

          {/* Image second on mobile; right on desktop */}
          <motion.div
            className="relative order-2 md:order-2 md:col-span-6 flex md:justify-end"
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="pointer-events-none absolute -right-10 -bottom-8 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl md:h-96 md:w-96" />
            <div className="pointer-events-none absolute -left-6 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-3xl md:h-64 md:w-64" />

            <div className="relative z-10 mx-auto mt-4 md:mt-0 w-full max-w-[560px] overflow-hidden rounded-xl shadow-2xl">
              <div className="relative aspect-[5/3]">
                <Image
                  src="/images/dashboard.png"
                  alt="EcoFocus Interactive Dashboard preview"
                  fill
                  sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

