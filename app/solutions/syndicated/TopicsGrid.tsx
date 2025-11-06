'use client';

import { CloudSun, Recycle, HeartPulse, Shield, FlaskConical, PackageSearch } from 'lucide-react';
import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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

  // Auto-advance every 10s (pause on hover; respect Reduced Motion)
  useEffect(() => {
    if (reduce || paused) return;
    timerRef.current = window.setInterval(() => setIdx((v) => (v + 1) % topics.length), 10000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [reduce, paused]);

  // Visible trio: left, center (active), right
  const visible = useMemo(() => {
    const center = topics[idx % topics.length];
    const left   = topics[(idx - 1 + topics.length) % topics.length];
    const right  = topics[(idx + 1) % topics.length];
    return [left, center, right] as const;
  }, [idx]);

  return (
    <section className="relative section-slab-deep" aria-labelledby="topics-grid-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* LEFT COPY */}
          <div className="md:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] tracking-wide mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-emerald-300">Measurement Framework</span>
            </span>
            <h2 id="topics-grid-title" className="mt-3 font-bold leading-tight text-white text-[clamp(1.8rem,4vw,2.6rem)]">
              How We Measure Sustainability.{` `}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Built for Real Decisions.
              </span>
            </h2>
            <p className="mt-3 text-white/85 text-sm sm:text-base">
              Our coverage spans environmental and health dimensions that shape real-world choices—so you can align
              strategy, packaging, and claims with what actually moves consumers.
            </p>
          </div>

          {/* RIGHT: Hybrid 3-up spotlight carousel */}
          <div
            className="md:col-span-7 hidden sm:block"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-center md:translate-y-2">
              <div className="w-full max-w-[980px]">
                <div className="flex items-stretch justify-center gap-6">
                  {visible.map((t, i) => {
                    const active = i === 1; // center
                    return (
                      <SpotCard
                        key={`${t.title}-${idx}-${i}`}
                        topic={t}
                        active={active}
                        onClick={() =>
                          setIdx((v) =>
                            active
                              ? (v + 1) % topics.length
                              : i === 0
                              ? (v - 1 + topics.length) % topics.length
                              : (v + 1) % topics.length
                          )
                        }
                        reduce={!!reduce}
                      />
                    );
                  })}
                </div>

                {/* Controls */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <DeckBtn onClick={() => setIdx((v) => (v - 1 + topics.length) % topics.length)}>Prev</DeckBtn>
                  <DeckBtn onClick={() => setIdx((v) => (v + 1) % topics.length)}>Next</DeckBtn>
                  <DeckBtn aria-pressed={paused} onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</DeckBtn>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: simple list */}
          <div className="sm:hidden grid gap-6 grid-cols-1">
            {topics.map((t) => (
              <div key={t.title} className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white shadow-2xl">
                <article className="overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white">
                  <CardBody {...t} />
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Spotlight Card (solid white ring, no bottom bar, full copy) ---------- */
function SpotCard({
  topic,
  active,
  onClick,
  reduce,
}: {
  topic: Topic;
  active: boolean;
  onClick: () => void;
  reduce: boolean;
}) {
  const { icon: Icon, title, description } = topic;
  const scale = active ? 1 : 0.94;
  const y = active ? 0 : 8;
  const opacity = active ? 1 : 0.78;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ scale, y, opacity }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 0.8, 0.36, 1] }}
      className="w-[300px] cursor-pointer focus:outline-none text-left"
      style={{ willChange: 'transform' }}
      aria-label={title}
    >
      {/* Solid white ring on outer wrapper */}
      <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white shadow-2xl">
        {/* Solid white ring on inner card as well */}
        <article className={`overflow-hidden rounded-2xl ${active ? 'bg-slate-800' : 'bg-slate-800/90'} ring-1 ring-white`}>
          <div className="p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
              <Icon className="h-5 w-5" />
            </div>
            {/* No line clamps — show full copy */}
            <h3 className="font-semibold text-white leading-snug">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          </div>
          {/* bottom accent bar removed */}
        </article>
      </div>
    </motion.button>
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

function DeckBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
    />
  );
}








