'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, ShoppingCart } from 'lucide-react';

type Props = {
  // Example stat — tweak these from CMS if you want
  sayPct?: number; // % who say they prefer sustainable products
  doPct?: number;  // % who actually buy them
  ctaHref?: string;
  ctaLabel?: string;
};

export default function SayDoGapSection({
  sayPct = 78,
  doPct = 31,
  ctaHref = '/solutions/syndicated#methodology',
  ctaLabel = 'See How We Measure What Matters',
}: Props) {
  const gap = Math.max(0, sayPct - doPct);

  return (
    <section className="relative py-20 bg-white">
      {/* Soft background gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-amber-50/50 via-emerald-50/40 to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Closing the <span className="bg-clip-text text-transparent animate-gradient bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500">Say–Do Gap</span> in Sustainability
          </motion.h2>
          <motion.p
            className="text-gray-600 mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            Consumers often tell one story and act out another. We blend stated attitudes with real behaviors to reveal the
            truth that drives market change.
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-12 gap-8 items-stretch">
          {/* Left: Copy points */}
          <motion.div
            className="md:col-span-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <BrainCircuit className="w-5 h-5 text-emerald-600" />
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
                  <ShoppingCart className="w-5 h-5 text-amber-600" />
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
                  <ArrowRight className="w-5 h-5 text-sky-600" />
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
                className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              >
                {ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Mini “Say vs Do” visual */}
          <motion.div
            className="md:col-span-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900">Say vs. Do (example)</div>
              <div className="text-xs text-gray-500">
                Percentage of consumers who say they prefer eco‑friendly options vs. those who actually purchase them
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-5">
              {/* SAY */}
              <div>
                <div className="flex items-end justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Say</span>
                  <span className="text-xs text-gray-500">{sayPct}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#dd9e37] via-[#FFC107] to-[#dd803e]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${sayPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* DO */}
              <div>
                <div className="flex items-end justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Do</span>
                  <span className="text-xs text-gray-500">{doPct}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${doPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Gap callout */}
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="text-sm text-gray-800">
                <span className="font-semibold">{gap}% gap</span> between intention and action. EcoFocus helps quantify it and close it.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
