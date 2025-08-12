'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, ShoppingCart } from 'lucide-react';

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
  // Clamp values for safety
  const say = Math.min(100, Math.max(0, sayPct));
  const doV = Math.min(100, Math.max(0, doPct));
  const gap = Math.max(0, say - doV);

  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white">
      {/* Soft background gradient (lighter by default; deepens slightly on md+) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-amber-50/50 via-emerald-50/40 to-white md:from-amber-50/70 md:via-emerald-50/60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
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

          <motion.p
            className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            Consumers often tell one story and act out another. We blend stated attitudes with real behaviors
            to reveal the truth that drives market change.
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12 md:gap-8">
          {/* Left: Copy points */}
          <motion.div
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-6 sm:p-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <BrainCircuit className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Attitudes + Actions</div>
                  <p className="text-sm text-gray-600">
                    Surveys capture what people <em>say</em>. Behavioral data shows what they <em>do</em>. EcoFocus integrates both.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <ShoppingCart className="h-5 w-5 text-amber-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Fewer False Positives</div>
                  <p className="text-sm text-gray-600">
                    Avoid strategies built on aspirational claims or social desirability bias. We quantify where intent falls short.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <ArrowRight className="h-5 w-5 text-sky-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Actionable Levers</div>
                  <p className="text-sm text-gray-600">
                    Identify price, convenience, availability, and messaging levers that convert intent into purchase.
                  </p>
                </div>
              </li>
            </ul>

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

          {/* Right: Mini “Say vs Do” visual */}
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
                Percentage of consumers who say they prefer eco-friendly options vs. those who actually purchase them.
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-5">
              {/* SAY */}
              <div>
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-xs font-medium text-gray-700">Say</span>
                  <span className="text-xs text-gray-500" aria-live="polite">
                    {say}%
                  </span>
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
                  <span className="text-xs text-gray-500" aria-live="polite">
                    {doV}%
                  </span>
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
                <span className="font-semibold">{gap}% gap</span> between intention and action. EcoFocus helps quantify it and
                close it.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

