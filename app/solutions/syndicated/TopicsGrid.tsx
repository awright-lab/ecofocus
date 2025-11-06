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
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Slower auto-advance: every 9s (pause on hover, respect reduced motion)
  useEffect(() => {
    if (reduce || paused) return;
    timerRef.current = window.setInterval(() => setIdx((v) => (v + 1) % topics.length), 9000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [reduce, paused]);

  // Top/mid/back cards for the stack
  const stack = useMemo(() => {
    const a = topics[idx % topics.length];
    const b = topics[(idx + 1) % topics.length];
    const c = topics[(idx + 2) % topics.length];
    return [a, b, c];
  }, [idx]);

  return (
    <section className="relative section-slab-deep" aria-labelledby="topics-grid-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* LEFT copy (kept to match InteractiveDashboardShowcase) */}
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

          {/* RIGHT: stacked deck — centered vertically & nudged lower */}
          <div
            className="md:col-span-7 hidden sm:flex items-center justify-center md:translate-y-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-live="polite"
          >
            <div className="relative h-[380px] w-full">
              <AnimatePresence initial={false} mode="popLayout">
                {/* Back layer (straight, slightly smaller, lower) */}
                <StackLayer key={`back-${stack[2].title}-${idx}`} depth="back">
                  <Card {...stack[2]} depth="back" />
                </StackLayer>

                {/* Mid layer */}
                <StackLayer key={`mid-${stack[1].title}-${idx}`} depth="mid">
                  <Card {...stack[1]} depth="mid" />
                </StackLayer>

                {/* Top layer — new card rises from below and lands */}
                <StackLayer key={`top-${stack[0].title}-${idx}`} depth="top" entering={!reduce}>
                  <Card {...stack[0]} depth="top" />
                </StackLayer>
              </AnimatePresence>

              {/* Controls */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3">
                <DeckBtn onClick={() => setIdx((v) => (v - 1 + topics.length) % topics.length)}>Prev</DeckBtn>
                <DeckBtn onClick={() => setIdx((v) => (v + 1) % topics.length)}>Next</DeckBtn>
                <DeckBtn aria-pressed={paused} onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</DeckBtn>
              </div>
            </div>
          </div>

          {/* Mobile fallback: simple list */}
          <div className="sm:hidden grid gap-6 grid-cols-1">
            {topics.map((t) => (
              <div key={t.title} className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
                <article className="overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white/15">
                  <CardBody {...t} />
                  <div className="h-[4px] w-full bg-slate-700" />
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Layer (now perfectly straight) ====== */
function StackLayer({
  children,
  depth,
  entering = false,
}: {
  children: React.ReactNode;
  depth: 'top' | 'mid' | 'back';
  entering?: boolean;
}) {
  // Straight stack (no rotation). Subtle size/offset to show layers.
  const cfg =
    depth === 'top'
      ? { z: 30, y: 0,   scale: 1.0,   shadow: 'shadow-2xl', initialY: 68, dur: 1.0 }
      : depth === 'mid'
      ? { z: 20, y: 18,  scale: 0.992, shadow: 'shadow-xl',  dur: 0.9 }
      : {   z: 10, y: 32,  scale: 0.984, shadow: 'shadow-lg',  dur: 0.85 };

  return (
    <motion.div
      className={`absolute inset-x-0 mx-auto max-w-[640px] ${cfg.shadow}`}
      style={{ zIndex: cfg.z, willChange: 'transform' }}
      initial={
        entering
          ? { opacity: 0, y: cfg.initialY, scale: 0.985 }
          : { opacity: 1, y: cfg.y, scale: cfg.scale }
      }
      animate={{ opacity: 1, y: cfg.y, scale: cfg.scale }}
      exit={{ opacity: 0, y: cfg.y + 10, scale: cfg.scale * 0.99 }}
      transition={{ type: 'spring', stiffness: 240, damping: 32, mass: 0.9, duration: cfg.dur }}
    >
      {children}
    </motion.div>
  );
}

/* ====== Card chrome (top fully opaque; others dimmed slightly) ====== */
function Card(t: Topic & { depth: 'top' | 'mid' | 'back' }) {
  const outer = 'relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10';
  const inner =
    t.depth === 'top'
      ? 'overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white/15'
      : 'overflow-hidden rounded-2xl bg-slate-800/90 ring-1 ring-white/10';

  return (
    <div className={outer}>
      <article className={inner} aria-hidden={t.depth !== 'top'}>
        <CardBody {...t} muted={t.depth !== 'top'} />
        <div className="h-[4px] w-full bg-slate-700" />
      </article>
    </div>
  );
}

function CardBody({
  icon: Icon,
  title,
  description,
  muted = false,
}: Topic & { muted?: boolean }) {
  return (
    <div className={`p-6 ${muted ? 'opacity-75' : 'opacity-100'}`}>
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-white leading-snug line-clamp-1">{title}</h3>
      <p className="mt-2 text-sm text-slate-300 line-clamp-2">{description}</p>
    </div>
  );
}

function DeckBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
    />
  );
}







