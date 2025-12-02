"use client";

import {
  ClipboardList,
  FileCheck,
  PackageCheck,
  Users,
  Lightbulb,
  SearchCheck
} from "lucide-react";

import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Benefit = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

/* ---------------------------
   CUSTOM STUDIES BENEFITS
---------------------------- */
const benefits: Benefit[] = [
  {
    icon: ClipboardList,
    title: "Messaging & Claims Validation",
    description:
      "Understand which sustainability claims resonate, which read as greenwashing, and which motivate real behavior."
  },
  {
    icon: PackageCheck,
    title: "Packaging & Label Testing",
    description:
      "Evaluate material cues, recyclability indicators, and on-pack phrasing that increase pickup and brand trust."
  },
  {
    icon: FileCheck,
    title: "Evidence for Key Decisions",
    description:
      "Give leadership clear, data-backed confidence when making product, ESG, or communication decisions."
  },
  {
    icon: Users,
    title: "Workforce & EVP Insights",
    description:
      "Measure how sustainability expectations shape talent attraction, retention, and internal cultural alignment."
  },
  {
    icon: Lightbulb,
    title: "Innovation & Concept Testing",
    description:
      "Validate early ideas and see how sustainability attributes impact purchase intent or competitive positioning."
  },
  {
    icon: SearchCheck,
    title: "Audience-Specific Clarity",
    description:
      "Discover how your exact consumers, shoppers, or employees interpret sustainability in the context of your brand."
  }
];

/* ---------------------------
   MAIN COMPONENT
---------------------------- */
export default function BenefitsGrid() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (reduce || paused) return;
    timerRef.current = window.setInterval(
      () => setIdx((v) => (v + 1) % benefits.length),
      10000
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [reduce, paused]);

  // Visible 3 cards (left, active center, right)
  const visible = useMemo(() => {
    const center = benefits[idx % benefits.length];
    const left = benefits[(idx - 1 + benefits.length) % benefits.length];
    const right = benefits[(idx + 1) % benefits.length];
    return [left, center, right] as const;
  }, [idx]);

  return (
    <section className="relative section-slab-deep" aria-labelledby="benefits-grid-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">

          {/* LEFT COPY */}
          <div className="md:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] tracking-wide mb-4">
              <span
                className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"
                aria-hidden="true"
              />
              <span className="text-emerald-300">Custom Study Benefits</span>
            </span>

            <h2
              id="benefits-grid-title"
              className="mt-3 font-bold leading-tight text-white text-[clamp(1.8rem,4.5vw,2.5rem)]"
            >
              Why Custom Research Matters.{` `}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent animate-gradient">
                Built for Accuracy and Impact.
              </span>
            </h2>

            <p className="mt-3 text-white/85 text-sm sm:text-base">
              Custom Studies provide granular, decision-ready insight into how
              sustainability expectations shape reactions to your messaging,
              packaging, product innovation, and employer brand — for your exact
              audience, not generic benchmarks.
            </p>
          </div>

          {/* RIGHT SIDE: Spotlight Carousel */}
          <div
            className="md:col-span-7 hidden sm:block"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-center md:translate-y-2">
              <div className="w-full max-w-[980px]">
                <div className="flex items-stretch justify-center gap-6">

                  {visible.map((b, i) => {
                    const active = i === 1;
                    return (
                      <SpotCard
                        key={`${b.title}-${idx}-${i}`}
                        benefit={b}
                        active={active}
                        reduce={!!reduce}
                        onClick={() =>
                          setIdx((v) =>
                            active
                              ? (v + 1) % benefits.length
                              : i === 0
                              ? (v - 1 + benefits.length) % benefits.length
                              : (v + 1) % benefits.length
                          )
                        }
                      />
                    );
                  })}

                </div>

                {/* CONTROLS */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <DeckBtn onClick={() => setIdx((v) => (v - 1 + benefits.length) % benefits.length)}>
                    Prev
                  </DeckBtn>

                  <DeckBtn onClick={() => setIdx((v) => (v + 1) % benefits.length)}>
                    Next
                  </DeckBtn>

                  <DeckBtn aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                    {paused ? "Resume" : "Pause"}
                  </DeckBtn>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE LIST */}
          <div className="sm:hidden grid gap-6 grid-cols-1">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white shadow-2xl"
              >
                <article className="overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white">
                  <CardBody {...b} />
                </article>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------------------
   Spotlight Card Component
---------------------------- */
function SpotCard({
  benefit,
  active,
  onClick,
  reduce
}: {
  benefit: Benefit;
  active: boolean;
  onClick: () => void;
  reduce: boolean;
}) {
  const { icon: Icon, title, description } = benefit;
  const scale = active ? 1 : 0.94;
  const y = active ? 0 : 8;
  const opacity = active ? 1 : 0.78;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ scale, y, opacity }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 0.8, 0.36, 1] }
      }
      className="w-[300px] cursor-pointer focus:outline-none text-left"
      style={{ willChange: "transform" }}
      aria-label={title}
    >
      <div className="relative rounded-3xl p-[6px] ring-1 ring-white bg-slate-800 shadow-2xl">
        <article
          className={`overflow-hidden rounded-2xl ring-1 ring-white ${
            active ? "bg-slate-800" : "bg-slate-800/90"
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

/* ---------------------------
   Mobile CardBody
---------------------------- */
function CardBody({ icon: Icon, title, description }: Benefit) {
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

/* ---------------------------
   Deck Button
---------------------------- */
function DeckBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
    />
  );
}

