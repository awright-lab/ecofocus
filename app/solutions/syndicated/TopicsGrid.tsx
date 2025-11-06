'use client';

import { CloudSun, Recycle, HeartPulse, Shield, FlaskConical, PackageSearch } from 'lucide-react';
import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Topic = { icon: ComponentType<{ className?: string }>; title: string; description: string };

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
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto-advance every 6s (respect reduced motion & pause on hover)
  useEffect(() => {
    if (reduce || paused) return;
    timerRef.current = window.setInterval(() => setI((v) => (v + 1) % topics.length), 6000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [reduce, paused]);

  // Visible stack: top + two peeks (middle/back)
  const stack = useMemo(() => {
    const a = topics[i % topics.length];
    const b = topics[(i + 1) % topics.length];
    const c = topics[(i + 2) % topics.length];
    return [a, b, c];
  }, [i]);

  return (
    <section className="relative section-slab-deep" aria-labelledby="topics-grid-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Copy column — unchanged */}
          <HeaderCopy />

          {/* Cards column — STACK animation */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            {/* Desktop: stacked deck */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-live="polite"
            >
              <div className="relative h-[360px]">
                <AnimatePresence initial={false} mode="popLayout">
                  {/* Back (bottom) layer */}
                  {stack.slice(2, 3).map((card) => (
                    <Layer key={`back-${card.title}-${i}`} depth="back">
                      <Card {...card} />
                    </Layer>
                  ))}
                  {/* Middle layer */}
                  {stack.slice(1, 2).map((card) => (
                    <Layer key={`mid-${card.title}-${i}`} depth="mid">
                      <Card {...card} />
                    </Layer>
                  ))}
                  {/* Top layer — NEW card slides up and lands */}
                  {stack.slice(0, 1).map((card) => (
                    <Layer key={`top-${card.title}-${i}`} depth="top" entering={!reduce}>
                      <Card {...card} />
                    </Layer>
                  ))}
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <Btn onClick={() => setI((v) => (v - 1 + topics.length) % topics.length)}>Prev</Btn>
                <Btn onClick={() => setI((v) => (v + 1) % topics.length)}>Next</Btn>
                <Btn aria-pressed={paused} onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</Btn>
              </div>
            </div>

            {/* Mobile: simple list */}
            <div className="sm:hidden grid gap-6 grid-cols-1">
              {topics.map((t) => (
                <div key={t.title} className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                  <article className="overflow-hidden rounded-2xl bg-slate-800/90 ring-1 ring-white/15">
                    <CardBody {...t} />
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

/* ------- Left column copied styling (InteractiveDashboardShowcase) ------- */
function HeaderCopy() {
  return (
    <div className="md:col-span-5">
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
    </div>
  );
}

/* ------- Layer wrapper with tidy stack motion (no blur/glass) ------- */
function Layer({
  children,
  depth,
  entering = false,
}: {
  children: React.ReactNode;
  depth: 'top' | 'mid' | 'back';
  entering?: boolean;
}) {
  // Clean offsets that look like a true stack
  const cfg =
    depth === 'top'
      ? { z: 30, y: 0, scale: 1, rotate: 0, className: 'shadow-2xl', initialY: 42 }
      : depth === 'mid'
      ? { z: 20, y: 14, scale: 0.985, rotate: -1.2, className: 'shadow-xl' }
      : { z: 10, y: 26, scale: 0.97, rotate: 1.2, className: 'shadow-lg' };

  return (
    <motion.div
      className={`absolute inset-x-0 mx-auto max-w-[640px] ${cfg.className}`}
      style={{ zIndex: cfg.z, willChange: 'transform' }}
      initial={
        entering
          ? { opacity: 0, y: cfg.initialY, scale: 0.985 }
          : { opacity: 1, y: cfg.y, scale: cfg.scale, rotate: cfg.rotate }
      }
      animate={{ opacity: 1, y: cfg.y, scale: cfg.scale, rotate: cfg.rotate }}
      exit={{ opacity: 0, y: cfg.y + 8, scale: cfg.scale * 0.99 }}
      transition={{ type: 'spring', stiffness: 520, damping: 36, mass: 0.7 }}
    >
      {children}
    </motion.div>
  );
}

/* ------- Card chrome matches InteractiveDashboardShowcase outer ring ------- */
function Card(t: Topic) {
  return (
    <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10">
      <article className="overflow-hidden rounded-2xl bg-slate-800/90 ring-1 ring-white/15">
        <CardBody {...t} />
        <div className="h-[4px] w-full bg-slate-700" />
      </article>
    </div>
  );
}

function CardBody({ icon: Icon, title, description }: Topic) {
  return (
    <div className="p-6">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-white leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </div>
  );
}

function Btn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
    />
  );
}




