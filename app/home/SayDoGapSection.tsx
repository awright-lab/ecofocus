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
import * as React from 'react';

type Props = {
  ctaHref?: string;
  ctaLabel?: string;
};

export default function SayDoGapSection({
  ctaHref = '/about/methodology',
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
            From Intent to Action: Closing the{' '}
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
            Millennials and Gen Z say they value sustainability — but their purchases don’t always match. For agencies, this gap can make or break a campaign. EcoFocus helps you diagnose what holds consumers back and design campaigns that move them forward.
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12 md:gap-8">
          {/* Left: levers + long-form message + CTA */}
          <motion.div
            className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm md:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            {/* Three key levers (positive framing) */}
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Megaphone className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 line-clamp-2 sm:line-clamp-none">
                  Diagnose the Blockers
                  </div>
                  <p className="text-sm text-gray-600">
                  price, access, clarity, authenticity.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Store className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 line-clamp-2 sm:line-clamp-none">
                  Design Campaigns that Convert
                  </div>
                  <p className="text-sm text-gray-600">
                  align messaging, optimize claims, position products clearly.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <Tag className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Validate Before Scaling</div>
                  <p className="text-sm text-gray-600">
                  test concepts, monitor reactions, iterate confidently.
                  </p>
                </div>
              </li>
            </ul>

            {/* Long-form message (kept, mobile-first collapsible) */}
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

            {/* Proof of approach */}
            <div className="mt-5 flex items-start gap-3">
              <BrainCircuit className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm text-gray-700">
                We blend stated attitudes with real behaviors to find the specific levers that convert intent to purchase.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 text-center sm:text-left">
              <Link
                href={ctaHref}
                className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                aria-label={ctaLabel}
              >
                <span className="relative z-10">{ctaLabel}</span>
                <ArrowRight className="relative z-10 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Right: 4-Step Roadmap (visual, no numbers) */}
          <motion.div
            className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm md:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            role="img"
            aria-label="How EcoFocus turns intent into action"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900">Our roadmap to close the gap</div>
              <div className="text-xs text-gray-500">A practical sequence we tailor by category and audience.</div>
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

/* ---------- Collapsible details (mobile-first) ---------- */
function Details({ summary, children }: { summary: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
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
      <span
        aria-hidden="true"
        className="absolute -left-[1.0625rem] top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-emerald-100 text-white"
      >
        {icon}
      </span>
      <div className="rounded-lg border border-gray-200 bg-white/80 p-3">
        <div className="text-sm sm:text-[15px] font-semibold text-gray-900">{title}</div>
        <p className="mt-1 text-sm sm:text-[15px] text-gray-700">{body}</p>
      </div>
    </li>
  );
}



