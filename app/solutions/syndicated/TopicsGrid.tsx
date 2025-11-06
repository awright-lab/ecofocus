'use client';

import { CloudSun, Recycle, HeartPulse, Shield, FlaskConical, PackageSearch } from 'lucide-react';
import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Topic = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const topics: Topic[] = [
  { icon: CloudSun,      title: 'Climate & Environment',   description: 'Climate change beliefs, extreme weather experiences, and attitudes toward emissions and fossil fuel extraction.' },
  { icon: FlaskConical,  title: 'Chemical Safety',         description: 'Awareness and avoidance of BPA, phthalates, PFAS, VOCs, microplastics—across food, personal care, and home.' },
  { icon: Recycle,       title: 'Circularity Behaviors',   description: 'Recycling, composting, waste reduction, and preferences for reusable, refillable, and recyclable packaging.' },
  { icon: PackageSearch, title: 'Sustainable Consumption', description: 'Willingness to pay, organic/local buying, and the role of certifications in building consumer trust.' },
  { icon: Shield,        title: 'Corporate Responsibility',description: 'Expectations for commitments, transparency, and accountability (e.g., Extended Producer Responsibility).' },
  { icon: HeartPulse,    title: 'Health–Environment Link', description: 'How personal wellness and environmental stewardship connect in choices about materials, ingredients, and labels.' },
];

export default function TopicsGrid() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto-advance every 5s (unless paused or reduced motion)
  useEffect(() => {
    if (reduce || paused) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % topics.length);
    }, 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [reduce, paused]);

  // Compute top 3 cards in stack: current, next, next2
  const stack = useMemo(() => {
    const a = topics[index % topics.length];
    const b = topics[(index + 1) % topics.length];
    const c = topics[(index + 2) % topics.length];
    return [a, b, c];
  }, [index]);

  // Variants for stacked layers (foreground, mid, back)
  const layers = [
    { // top card
      z: 30,
      y: 0,
      scale: 1,
      rotate: 0,
      shadow: 'shadow-2xl',
      ringOuter: 'ring-white/10',
      ringInner: 'ring-white/20',
      bgInner: 'bg-slate-800/80',
      opacity: 1,
    },
    { // middle peek
      z: 20,
      y: 14,
      scale: 0.98,
      rotate: -1.5,
      shadow: 'shadow-xl',
      ringOuter: 'ring-white/10',
      ringInner: 'ring-white/10',
      bgInner: 'bg-slate-800/70',
      opacity: 0.9,
    },
    { // back peek
      z: 10,
      y: 26,
      scale: 0.96,
      rotate: 1.5,
      shadow: 'shadow-lg',
      ringOuter: 'ring-white/10',
      ringInner: 'ring-white/10',
      bgInner: 'bg-slate-800/60',
      opacity: 0.8,
    },
  ] as const;

  return (
    <section className="relative section-slab-deep" aria-labelledby="topics-grid-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Copy column (matches InteractiveDashboardShowcase) */}
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

            <h2 id="topics-grid-title" className="mt-3 font-bold leading-tight text-white text-[clamp(1.8rem,4vw,2.6rem)]">
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

          {/* Cards column — stacked rotating deck */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="md:col-span-7"
          >
            {/* Desktop: stacked deck */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-live="polite"
            >
              {/* Fixed height to hold the stack */}
              <div className="relative h-[360px]">
                <AnimatePresence initial={false}>
                  {stack.map((card, layerIndex) => {
                    const L = layers[layerIndex];
                    const Icon = card.icon;
                    // key ensures animation on index change but keeps layers stable
                    return (
                      <motion.div
                        key={`${card.title}-${layerIndex}-${index}`}
                        className={`absolute inset-x-0 mx-auto max-w-[640px] ${L.shadow}`}
                        style={{ zIndex: L.z }}
                        initial={{ opacity: 0, y: L.y + 12, scale: L.scale * 0.98, rotate: L.rotate * 0.5 }}
                        animate={{ opacity: L.opacity, y: L.y, scale: L.scale, rotate: L.rotate }}
                        exit={{ opacity: 0, y: L.y - 10, scale: L.scale * 0.98 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.7 }}
                      >
                        {/* Outer ring wrapper (matches InteractiveDashboardShowcase) */}
                        <div className={`relative rounded-3xl bg-white/5 p-2 ring-1 ${L.ringOuter}`}>
                          {/* Inner card */}
                          <article className={`overflow-hidden rounded-2xl ${L.bgInner} ring-1 ${L.ringInner}`}>
                            <div className="p-6">
                              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                                <Icon className="h-5 w-5" />
                              </div>

                              <h3 className="font-semibold text-white leading-snug">{card.title}</h3>
                              <p className="mt-2 text-sm text-slate-300">{card.description}</p>
                            </div>
                            <div className="h-[4px] w-full bg-slate-700" />
                          </article>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Deck controls */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i - 1 + topics.length) % topics.length)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % topics.length)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                  aria-pressed={paused}
                >
                  {paused ? 'Resume' : 'Pause'}
                </button>
              </div>
            </div>

            {/* Mobile: simple 2-col grid fallback (no motion) */}
            <div className="sm:hidden grid gap-6 grid-cols-1">
              {topics.map(({ icon: Icon, title, description }) => (
                <div key={title} className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                  <article className="overflow-hidden rounded-2xl bg-slate-800/80 ring-1 ring-white/20">
                    <div className="p-6">
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-white leading-snug">{title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{description}</p>
                    </div>
                    <div className="h-[4px] w-full bg-slate-700" />
                  </article>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}




