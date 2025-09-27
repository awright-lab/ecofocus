// app/components/SayDoGapSection.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

/* ---------- Bridge animation (sleek + deterministic) ---------- */
function GapBridge({
  colors = ['#213F97', '#10B981', '#EF9601'], // slate blue, emerald, marigold
  lanes = 3,
  maxWidth = 560,
  laneHeight = 22,
  capsuleW = 22,
  capsuleH = 10,
  spacing = 26,          // horizontal hop between capsules
  duration = 3.2,        // one duration for all
  delayStep = 0.18,      // stagger between capsules
  offsetX = 6,           // small nudge so it sits perfectly under title
}: {
  colors?: string[];
  lanes?: number;
  maxWidth?: number;
  laneHeight?: number;
  capsuleW?: number;
  capsuleH?: number;
  spacing?: number;
  duration?: number;
  delayStep?: number;
  offsetX?: number;
}) {
  // number of capsules per lane (enough to cross the width)
  const perLane = 10;
  const colorAt = (i: number) => colors[i % colors.length];

  return (
    <div
      className="gap-bridge mx-auto"
      aria-hidden
      style={{
        maxWidth: `${maxWidth}px`,
        transform: `translateX(${offsetX}px)`,
        ['--laneH' as any]: `${laneHeight}px`,
        ['--capsuleW' as any]: `${capsuleW}px`,
        ['--capsuleH' as any]: `${capsuleH}px`,
        ['--spacing' as any]: `${spacing}px`,
        ['--dur' as any]: `${duration}s`,
        ['--delayStep' as any]: `${delayStep}s`,
      }}
    >
      {/* End labels */}
      <div className="labels">
        <span className="label-left">Intent</span>
        <span className="label-right">Action</span>
      </div>

      {/* Center “bridge” axis with subtle pulse */}
      <div className="axis">
        <span className="pulse" />
      </div>

      {/* Lanes */}
      <div className="lanes">
        {Array.from({ length: lanes }).map((_, laneIdx) => (
          <div key={laneIdx} className="lane">
            {Array.from({ length: perLane }).map((__, i) => (
              <div
                key={i}
                className="capsule"
                style={{
                  // position start; animation moves it across by spacing each cycle
                  left: `calc(${i} * var(--spacing))`,
                  top: '6px',
                  background: `linear-gradient(180deg, ${colorAt(i + laneIdx)} 0%, ${colorAt(i + laneIdx)} 70%, rgba(255,255,255,0.18) 100%)`,
                  boxShadow: `0 6px 18px -10px ${colorAt(i + laneIdx)}33`,
                  animationDelay: `calc((${i} + ${laneIdx}) * var(--delayStep))`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .gap-bridge { width: 100%; position: relative; }
        .labels {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #334155; /* slate-700 */
          margin-bottom: 6px;
          opacity: 0.9;
        }
        .label-left::before,
        .label-right::after {
          content: '';
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 999px;
          background: #cbd5e1; /* slate-300 dot */
          margin: 0 6px;
        }

        .axis {
          position: relative;
          height: 2px;
          width: 100%;
          background: rgba(33, 63, 151, 0.85); /* slate blue */
          border-radius: 999px;
          overflow: visible;
        }
        .pulse {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 8px; height: 8px;
          border-radius: 999px;
          background: #10b981; /* emerald */
          transform: translate(-50%, -50%);
          animation: pulse 1.8s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35);
        }

        .lanes {
          position: relative;
          width: 100%;
          margin-top: 8px;
          display: grid;
          gap: 8px;
        }
        .lane {
          position: relative;
          height: var(--laneH);
          width: 100%;
          overflow: hidden;
        }
        .lane::before,
        .lane::after {
          /* slight fade at edges for polish */
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 24px;
          pointer-events: none;
        }
        .lane::before {
          left: 0;
          background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0) 100%);
        }
        .lane::after {
          right: 0;
          background: linear-gradient(270deg, #fff 0%, rgba(255,255,255,0) 100%);
        }

        .capsule {
          position: absolute;
          width: var(--capsuleW);
          height: var(--capsuleH);
          border-radius: 999px;
          transform: translateX(0) scaleY(1);
          animation: glide var(--dur) cubic-bezier(0.33, 0, 0.23, 1) infinite;
          will-change: transform;
          backface-visibility: hidden;
        }

        /* smooth GPU transforms only */
        @keyframes glide {
          0%   { transform: translateX(0)                     scaleY(0.92); }
          45%  { transform: translateX(calc(50% - var(--capsuleW))) scaleY(1.05); } /* slight lift mid-bridge */
          100% { transform: translateX(100%)                  scaleY(0.92); }
        }

        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); }
          70%  { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .capsule { animation: none; transform: translateX(0) scaleY(1); opacity: 0.8; }
          .pulse { animation: none; }
        }

        @media (max-width: 480px) {
          .labels { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}

/* ----------------------------- Section ----------------------------- */
export default function SayDoGapSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate bg-white">
      {/* Optional soft tint; remove for pure white */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-amber-50/50 via-emerald-50/40 to-white" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <motion.h2
          className="font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
        >
          From Intent to Action: Closing the{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Say–Do Gap
          </span>
        </motion.h2>

        {/* NEW: bridge animation directly beneath the title */}
        <div className="mt-5 md:mt-6">
          <GapBridge
            colors={['#213F97', '#10B981', '#EF9601']}
            lanes={3}
            maxWidth={560}
            laneHeight={22}
            capsuleW={22}
            capsuleH={10}
            spacing={26}
            duration={3.2}    // slower / smooth; try 3.4–3.8 for calmer
            delayStep={0.18}
            offsetX={6}
          />
        </div>

        <motion.p
          className="mt-6 sm:mt-8 text-base sm:text-[17px] leading-7 text-gray-800 max-w-none"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          Let’s be honest: this Say–Do Gap is one of the most frustrating challenges in consumer marketing.
          It’s tempting to dismiss it as hypocrisy—or dismiss sustainability as a sales driver altogether.
          The key to addressing it is first understanding what consumers are looking for—their sustainability
          attitudes and intended behaviors—and having a clear picture of how sustainability influences their
          aspirations and desires. At EcoFocus, we have the data (or can get the data) you need to identify
          sustainability personas for your target audience to help you build strategies—backed by data—to gain
          market share and reduce churn. <span className="font-semibold text-gray-900">Don’t speculate about your
          eco-minded customer. Understand them. Influence them. Win them.</span>
        </motion.p>
      </div>
    </section>
  );
}








