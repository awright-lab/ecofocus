// app/components/ResearchToAction.tsx
'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

type Variant = 'rotator' | 'build';

export default function ResearchToAction({ variant = 'rotator' }: { variant?: Variant }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950">
      {/* ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl bg-emerald-600/20" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl bg-sky-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(16,185,129,0.18),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        {variant === 'rotator' ? <Rotator reduce={!!reduce} /> : <BuildAndLock reduce={!!reduce} />}
      </div>
    </section>
  );
}

/* --------------------- Variant A: ROTATOR --------------------- */
const WORDS = ['Market Research', 'Data', 'Knowledge', 'Informed Decisions'];

function Rotator({ reduce }: { reduce: boolean }) {
  // Tuneables
  const ROTATE_MS = 3200;        // how long each word stays on screen
  const ANIM_SEC  = 1.1;         // in/out animation length

  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIdx(i => (i + 1) % WORDS.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs tracking-wider uppercase text-white/50 mb-4">
        From Research to Action
      </p>

      {/* More vertical room + no clipping */}
      <div className="relative overflow-visible
                      min-h-[5.8rem] sm:min-h-[7.2rem] md:min-h-[8.4rem] lg:min-h-[9.6rem]">
        <AnimatePresence mode="wait">
          <motion.h2
            key={idx}
            initial={
              reduce ? false : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }
            }
            animate={
              reduce
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: 1,
                    scale: [0.96, 1.06, 1.0],
                    filter: ['blur(10px)', 'blur(2px)', 'blur(0px)'],
                  }
            }
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: ANIM_SEC, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center font-extrabold tracking-tight
                       leading-[0.95] text-[clamp(2.25rem,9vw,6rem)]
                       bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-300
                       bg-clip-text text-transparent
                       drop-shadow-[0_1px_12px_rgba(16,185,129,0.25)]"
            aria-live="polite"
          >
            {WORDS[idx]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* removed: progress dots */}
      {/* optional subline kept */}
      <div className="mt-6 hidden sm:flex items-center gap-2 text-white/60">
        <span>We turn</span>
        <span className="inline-flex items-center gap-2">
          <em className="not-italic text-white/90">research</em>
          <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80"><path fill="currentColor" d="M13 5l7 7l-7 7v-5H4v-4h9z"/></svg>
          <em className="not-italic text-white/90">action</em>
        </span>
      </div>
    </div>
  );
}

/* ------------------ Variant B: BUILD & LOCK ------------------- */
function BuildAndLock({ reduce }: { reduce: boolean }) {
  const [stage, setStage] = React.useState(0); // 0..4 (how many words are shown)

  React.useEffect(() => {
    if (reduce) { setStage(4); return; }
    let s = 0;
    const tick = () => { s += 1; setStage(s); if (s < 4) setTimeout(tick, 650); };
    setTimeout(tick, 200);
  }, [reduce]);

  return (
    <div className="text-center">
      <p className="text-xs tracking-wider uppercase text-white/50 mb-4">
        From Research to Action
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        {WORDS.map((w, i) => (
          <motion.span
            key={w}
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.9 }}
            animate={stage > i ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.9 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="font-extrabold leading-none text-[clamp(1.6rem,6.5vw,4rem)] bg-gradient-to-r
                       from-emerald-300 via-sky-300 to-amber-300 bg-clip-text text-transparent"
          >
            {w}
          </motion.span>
        ))}

        {/* arrows between words */}
        <div className="basis-full h-0" />
        <div className="mt-4 flex items-center justify-center gap-2 text-white/60">
          <span className="hidden sm:inline">Market Research</span>
          <ArrowRight className="hidden sm:inline h-4 w-4" />
          <span className="hidden sm:inline">Data</span>
          <ArrowRight className="hidden sm:inline h-4 w-4" />
          <span className="hidden sm:inline">Knowledge</span>
          <ArrowRight className="hidden sm:inline h-4 w-4" />
          <span className="hidden sm:inline">Informed Decisions</span>
        </div>
      </div>
    </div>
  );
}
