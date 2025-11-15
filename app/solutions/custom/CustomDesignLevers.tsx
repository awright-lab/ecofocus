'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CloudSun, PackageSearch, Recycle, HeartPulse, Shield, FlaskConical } from 'lucide-react';

const topics = [
  {
    icon: CloudSun,
    title: 'Category & Occasion',
    description: 'Everyday staples, emerging categories, out-of-home, and special occasions where sustainability shows up differently.',
  },
  {
    icon: PackageSearch,
    title: 'Propositions & Packs',
    description: 'Benefit ladders, claims, formats, and visual cues that shoppers notice—and act on—in your aisle.',
  },
  {
    icon: Recycle,
    title: 'Path to Purchase',
    description: 'From discovery to repeat: understand how sustainability can nudge trial, trade-up, and loyalty.',
  },
  {
    icon: HeartPulse,
    title: 'Wellness & Values',
    description: 'Clarify where health, safety, and environmental impact intersect for your priority audiences.',
  },
  {
    icon: Shield,
    title: 'Trust & Proof Points',
    description: 'See which certifications, partners, and proof signals reduce skepticism and build confidence.',
  },
  {
    icon: FlaskConical,
    title: 'Innovation Territories',
    description: 'Spot white space areas where your brand can lead on sustainability with new offerings.',
  },
];

export default function CustomDesignLevers() {
  const reduce = useReducedMotion();

  return (
    <section className="relative section-slab-deep" aria-labelledby="custom-design-levers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 md:py-18">
        <div className="grid grid-cols-1 gap-10 md:gap-14 md:grid-cols-12 md:items-center">
          {/* Copy side – mirrors “How We Measure Sustainability” */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] tracking-wide mb-4 text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Design Levers
            </span>

            <h2
              id="custom-design-levers"
              className="font-bold leading-tight text-white text-[clamp(1.8rem,4vw,2.6rem)]"
            >
              How We Design Custom Work.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
                Built on the Same Framework.
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-white/85">
              We start from the EcoFocus sustainability framework, then tune the design knobs for your decision:
              audiences, occasions, concepts, channels, and metrics. The result is custom work that still ladders up
              to a consistent view of purpose-driven consumers.
            </p>
          </motion.div>

          {/* Grid of compact cards – cleaner than the old stacked glass effect */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="md:col-span-7"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {topics.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-slate-900/70 p-4 sm:p-5 ring-1 ring-white/15 shadow-[0_22px_60px_-28px_rgba(0,0,0,0.7)]"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
