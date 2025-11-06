'use client';

import { CloudSun, Recycle, HeartPulse, Shield, FlaskConical, PackageSearch } from 'lucide-react';
import { type ComponentType } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Topic = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const topics: Topic[] = [
  { icon: CloudSun,      title: 'Climate & Environment',     description: 'Climate change beliefs, extreme weather experiences, and attitudes toward emissions and fossil fuel extraction.' },
  { icon: FlaskConical,  title: 'Chemical Safety',           description: 'Awareness and avoidance of BPA, phthalates, PFAS, VOCs, microplastics—across food, personal care, and home.' },
  { icon: Recycle,       title: 'Circularity Behaviors',     description: 'Recycling, composting, waste reduction, and preferences for reusable, refillable, and recyclable packaging.' },
  { icon: PackageSearch, title: 'Sustainable Consumption',   description: 'Willingness to pay, organic/local buying, and the role of certifications in building consumer trust.' },
  { icon: Shield,        title: 'Corporate Responsibility',  description: 'Expectations for commitments, transparency, and accountability (e.g., Extended Producer Responsibility).' },
  { icon: HeartPulse,    title: 'Health–Environment Link',   description: 'How personal wellness and environmental stewardship connect in choices about materials, ingredients, and labels.' },
];

export default function TopicsGrid() {
  const reduce = useReducedMotion();

  return (
    <section className="relative section-slab-deep" aria-labelledby="topics-grid-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Copy column — mimics InteractiveDashboardShowcase */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] tracking-wide mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-emerald-300">Measurement Framework</span>
            </span>

            <h2
              id="topics-grid-title"
              className="mt-3 font-bold leading-tight text-white text-[clamp(1.8rem,4vw,2.6rem)]"
            >
              How We Measure Sustainability.{' '}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Built for Real Decisions.
              </span>
            </h2>

            <p className="mt-3 text-white/85 text-sm sm:text-base">
              Our coverage spans environmental and health dimensions that shape real-world choices—so you can align
              strategy, packaging, and claims with what actually moves consumers.
            </p>
          </motion.div>

          {/* Cards column — outer ring style identical to InteractiveDashboardShowcase */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="md:col-span-7"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {topics.map(({ icon: Icon, title, description }) => (
                <div key={title} className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                  <article className="h-full overflow-hidden rounded-2xl bg-slate-800/80 ring-1 ring-white/20">
                    <div className="p-6">
                      {/* icon block (subtle emerald on dark) */}
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="font-semibold text-white leading-snug">{title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{description}</p>
                    </div>

                    {/* bottom accent bar (emerald on hover) */}
                    <div className="h-[4px] w-full bg-slate-700 transition-colors" />
                  </article>
                </div>
              ))}
            </div>

            <p className="mt-3 text-center text-xs text-white/70">
              Topics shown represent core coverage areas; full detail varies by module.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}




