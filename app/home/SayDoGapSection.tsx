'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  BrainCircuit,
  Megaphone,
  Store,
  Tag,
} from 'lucide-react';

type Props = {
  sayPct?: number; // % who say they prefer sustainable products
  doPct?: number;  // % who actually buy them
  ctaHref?: string;
  ctaLabel?: string;
};

export default function SayDoGapSection({
  sayPct = 78,
  doPct = 22,
  ctaHref = '/solutions/syndicated#methodology',
  ctaLabel = 'See How We Measure What Matters',
}: Props) {
  const say = Math.min(100, Math.max(0, sayPct));
  const doV = Math.min(100, Math.max(0, doPct));
  const gap = Math.max(0, say - doV);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-amber-50/50 via-emerald-50/40 to-white md:from-amber-50/70 md:via-emerald-50/60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <motion.h2
            className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Closing the{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Say–Do Gap
            </span>{' '}
            in Sustainability
          </motion.h2>

          {/* 1–liner hook from Jerry's email */}
          <motion.p
            className="mx-auto mt-3 max-w-2xl text-sm text-gray-700 sm:text-base"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            People say they care about sustainability—but sales don’t always reflect it. Don’t dismiss it; diagnose it.
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12 md:gap-8">
          {/* Left: factors + copy + CTA */}
          <motion.div
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-6 sm:p-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            {/* Three key factors (concise, scannable) */}
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Megaphone className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Awareness (aka “greenhushing”)</div>
                  <p className="text-sm text-gray-600">
                    Are consumers even aware of your sustainability message—or is it hidden, muted, or not cutting through?
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Store className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Availability where they shop</div>
                  <p className="text-sm text-gray-600">
                    Do sustainable options actually show up on shelf and online in the moments your buyers choose?
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Tag className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Price & value</div>
                  <p className="text-sm text-gray-600">
                    Some are willing to pay more—but it varies by category. Competitive pricing and value proof matter.
                  </p>
                </div>
              </li>
            </ul>

            {/* Expandable detail: Jerry's longer copy, mobile-first */}
            <Details summary="Why well-intended consumers fail to follow through (read more)">
              <div className="mt-3 space-y-3 text-sm text-gray-700">
                <p>
                  Let’s be honest: this Say–Do Gap is one of the most frustrating challenges in consumer marketing.
                  It’s tempting to dismiss it as hypocrisy—or dismiss sustainability as a sales driver altogether.
                </p>
                <p>
                  The key to addressing it is first understanding what consumers are looking for—their sustainability
                  attitudes and intended behaviors—and having a clear picture of how sustainability influences their
                  aspirations and desires.
                </p>
                <p>
                  At EcoFocus, we have the data (or can get the data) you need to identify sustainability personas for
                  your target audience to help you build strategies—backed by data—to gain market share and reduce churn.
                </p>
                <p className="font-medium text-gray-900">
                  Don’t speculate about your eco-minded customer. Understand them. Influence them. Win them.
                </p>
              </div>
            </Details>

            {/* Proof that we blend attitudes + actions (kept succinct) */}
            <div className="mt-5 flex items-start gap-3">
              <BrainCircuit className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm text-gray-700">
                We combine stated attitudes with real behaviors to identify the levers that convert intent to purchase.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Link
                href={ctaHref}
                className="relative inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                aria-label={ctaLabel}
              >
                <span className="relative z-10">{ctaLabel}</span>
                <ArrowRight className="relative z-10 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Right: mini “Say vs Do” visual (unchanged) */}
          <motion.div
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-6 sm:p-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            role="img"
            aria-labelledby="saydo-title"
            aria-describedby="saydo-desc"
          >
            <div className="mb-4">
              <div id="saydo-title" className="text-sm font-semibold text-gray-900">
                Say vs. Do (example)
              </div>
              <div id="saydo-desc" className="text-xs text-gray-500">
                Percentage who say they prefer eco-friendly options vs. those who actually purchase them.
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-5">
              {/* SAY */}
              <div>
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-xs font-medium text-gray-700">Say</span>
                  <span className="text-xs text-gray-500" aria-live="polite">{say}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#dd9e37] via-[#FFC107] to-[#dd803e]"
                    initial={reduceMotion ? { width: `${say}%` } : { width: 0 }}
                    whileInView={reduceMotion ? undefined : { width: `${say}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              </div>

              {/* DO */}
              <div>
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-xs font-medium text-gray-700">Do</span>
                  <span className="text-xs text-gray-500" aria-live="polite">{doV}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600"
                    initial={reduceMotion ? { width: `${doV}%` } : { width: 0 }}
                    whileInView={reduceMotion ? undefined : { width: `${doV}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Gap callout */}
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="text-sm text-gray-800">
                <span className="font-semibold">{gap}% gap</span> between intention and action. EcoFocus helps quantify it—and close it.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Collapsible details (mobile-first) ---------- */
function Details({ summary, children }: { summary: string; children: React.ReactNode }) {
  const [open, setOpen] = useStateSafe(false);
  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-semibold text-emerald-700 underline"
        aria-expanded={open}
        aria-controls="saydo-details"
      >
        {open ? 'Show less' : summary}
      </button>
      {open && (
        <div id="saydo-details" className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}

import * as ReactNS from 'react';
function useStateSafe<T>(initial: T) {
  const [v, setV] = ReactNS.useState(initial);
  return [v, setV] as const;
}


