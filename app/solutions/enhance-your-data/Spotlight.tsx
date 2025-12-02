'use client';

import {
  Layers,
  Users,
  BarChart3,
  Binary,
  BrainCircuit,
  LineChart
} from 'lucide-react';

import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ---------- Spotlight Topics (Integration Version) ----------
type Topic = { icon: ComponentType<{ className?: string }>; title: string; description: string };

const topics: Topic[] = [
  {
    icon: Layers,
    title: 'Wrap EcoFocus Onto Your Data',
    description:
      'Layer sustainability attitudes, behaviors, values, and trust signals onto your sales, CRM, segmentation, or tracking data — adding the missing context behind performance.'
  },
  {
    icon: Users,
    title: 'Build Sustainability Personas',
    description:
      'Combine EcoFocus psychographics with your segments to create complete personas that reveal motivation, expectations, and values-driven loyalty.'
  },
  {
    icon: BarChart3,
    title: 'Explain the “Why” Behind KPIs',
    description:
      'Diagnose shifts in conversion, loyalty, or perception by tying KPIs to sustainability expectations, packaging reactions, material concerns, and message trust.'
  },
  {
    icon: Binary,
    title: 'Enrich Models & Predictive Analytics',
    description:
      'Add sustainability intelligence as a predictive layer on top of your existing models for targeting, forecasting, churn reduction, and demand sensitivity.'
  },
  {
    icon: BrainCircuit,
    title: 'Reduce Bias & Strengthen Insights',
    description:
      'Anchor your proprietary data to EcoFocus’ nationally representative baseline, improving reliability and reducing false positives in small or noisy datasets.'
  },
  {
    icon: LineChart,
    title: 'See Trends Through a New Lens',
    description:
      'Reveal hidden drivers by comparing your trendlines against 13+ years of EcoFocus sustainability movements, preferences, and cultural momentum.'
  }
];

export default function Spotlight() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (reduce || paused) return;
    timerRef.current = window.setInterval(() => setIdx(v => (v + 1) % topics.length), 10000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [reduce, paused]);

  const visible = useMemo(() => {
    const center = topics[idx % topics.length];
    const left   = topics[(idx - 1 + topics.length) % topics.length];
    const right  = topics[(idx + 1) % topics.length];
    return [left, center, right] as const;
  }, [idx]);

  return (
    <section className="relative section-slab-deep" aria-labelledby="integration-spotlight-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* LEFT COPY */}
          <div className="md:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] tracking-wide mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-emerald-300">Integration Framework</span>
            </span>

            <h2
              id="integration-spotlight-title"
              className="mt-3 font-bold leading-tight text-white text-[clamp(1.8rem,4.5vw,2.5rem)]"
            >
              How We Elevate Your Data.{` `}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Built for Real Decisions.
              </span>
            </h2>

            <p className="mt-3 text-white/85 text-sm sm:text-base">
              We transform your datasets by infusing EcoFocus sustainability intelligence—so you see not only
              what your data says, but why behavior shifts, where opportunity exists, and how to act with clarity.
            </p>
          </div>

          {/* RIGHT: Spotlight Carousel */}
          <div
            className="md:col-span-7 hidden sm:block"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-center md:translate-y-2">
              <div className="w-full max-w-[980px]">
                <div className="flex items-stretch justify-center gap-6">
                  {visible.map((topic, i) => {
                    const active = i === 1;
                    return (
                      <SpotCard
                        key={`${topic.title}-${idx}-${i}`}
                        topic={topic}
                        active={active}
                        reduce={!!reduce}
                        onClick={() =>
                          setIdx(v =>
                            active
                              ? (v + 1) % topics.length
                              : i === 0
                              ? (v - 1 + topics.length) % topics.length
                              : (v + 1) % topics.length
                          )
                        }
                      />
                    );
                  })}
                </div>

                {/* Controls */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <DeckBtn onClick={() => setIdx(v => (v - 1 + topics.length) % topics.length)}>Prev</DeckBtn>
                  <DeckBtn onClick={() => setIdx(v => (v + 1) % topics.length)}>Next</DeckBtn>
                  <DeckBtn aria-pressed={paused} onClick={() => setPaused(p => !p)}>
                    {paused ? 'Resume' : 'Pause'}
                  </DeckBtn>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE LIST */}
          <div className="sm:hidden grid gap-6 grid-cols-1">
            {topics.map(t => (
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

// ---------- Spotlight Card ----------

function SpotCard({
  topic,
  active,
  onClick,
  reduce
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
      <div className="relative rounded-3xl p-[6px] ring-1 ring-white bg-slate-800 shadow-2xl">
        <article
          className={`overflow-hidden rounded-2xl ring-1 ring-white ${
            active ? 'bg-slate-800' : 'bg-slate-800/90'
          }`}
        >
          <div className="p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
              <Icon className="h-5 w-5" />
            </div>

            <h3 className="font-semibold text-white leading-snug">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          </div>
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

