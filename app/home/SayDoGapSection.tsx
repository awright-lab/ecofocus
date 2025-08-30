'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  BrainCircuit,
  Megaphone,
  Store,
  Tag,
  Search,
  FlaskConical,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

type Props = {
  ctaHref?: string;
  ctaLabel?: string;
};

export default function SayDoGapSection({
  ctaHref = '/solutions/syndicated#methodology',
  ctaLabel = 'See How We Measure What Matters',
}: Props) {
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
            Turning Intent into Action: Closing the{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Say–Do Gap
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto mt-3 max-w-2xl text-sm text-gray-700 sm:text-base"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            People say they care about sustainability—sales don’t always reflect it. Don’t dismiss it; diagnose it.
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12 md:gap-8">
          {/* Left: levers + copy + CTA */}
          <motion.div
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-6 sm:p-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            {/* Three key levers (positive framing) */}
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Megaphone className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Message clarity & proof</div>
                  <p className="text-sm text-gray-600">
                    Clear sustainability value props with credible support—no greenhushing, no jargon.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Store className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Availability at the moment of choice</div>
                  <p className="text-sm text-gray-600">
                    Presence on shelf and online where shoppers decide—plus easy findability.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Tag className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Perceived value</div>
                  <p className="text-sm text-gray-600">
                    Pricing, pack, and claims that make the sustainable choice feel like the smart choice.
                  </p>
                </div>
              </li>
            </ul>

            {/* Short explanation */}
            <div className="mt-5 flex items-start gap-3">
              <BrainCircuit className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm text-gray-700">
                We blend stated attitudes with real behaviors to find the specific levers that convert intent to purchase.
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

          {/* Right: 4-Step Roadmap (no numbers, process-focused) */}
          <motion.div
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-6 sm:p-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            role="img"
            aria-label="How EcoFocus turns intent into action"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900">Our roadmap to close the gap</div>
              <div className="text-xs text-gray-500">
                A practical sequence we tailor by category and audience.
              </div>
            </div>

            <ol className="relative ml-6 space-y-5">
              {/* vertical line */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-1 h-[calc(100%-0.25rem)] w-px bg-gradient-to-b from-emerald-200 to-sky-200"
              />

              <Step
                icon={<Search className="h-4 w-4" />}
                title="Diagnose reality"
                body="Combine attitudes, purchase patterns, and shelf/SEO presence to map the real barriers."
              />
              <Step
                icon={<FlaskConical className="h-4 w-4" />}
                title="Design for conversion"
                body="Sharpen messaging & claims; right-size pack, price, and placement; create clear trade-ups."
              />
              <Step
                icon={<CheckCircle2 className="h-4 w-4" />}
                title="Validate in market"
                body="Quick tests and pilots—quant + qual—to confirm the levers that move behavior."
              />
              <Step
                icon={<TrendingUp className="h-4 w-4" />}
                title="Scale & monitor"
                body="Roll out and track progress with dashboards & regular readouts; iterate as conditions change."
              />
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="relative">
      {/* node */}
      <span
        aria-hidden="true"
        className="absolute -left-[1.0625rem] top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-emerald-100 text-white"
      >
        {icon}
      </span>
      <div className="rounded-lg border border-gray-200 bg-white/80 p-3">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <p className="mt-1 text-sm text-gray-700">{body}</p>
      </div>
    </li>
  );
}



