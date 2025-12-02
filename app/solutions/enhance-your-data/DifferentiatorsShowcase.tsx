'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DifferentiatorsShowcase() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const items = [
    {
      title: 'Sustainability Intelligence You Can’t Get Anywhere Else',
      body:
        'EcoFocus is the only syndicated dataset built entirely around sustainability attitudes, behaviors, and trust signals. Every integration, custom module, and persona is powered by 13+ years of purpose-driven insight—not generic consumer data.',
    },
    {
      title: 'Transform Your Data Into Strategic Clarity',
      body:
        'We enrich your CRM, sales, segmentation, and trackers with behavioral context, revealing the why behind movement. Your existing datasets become sharper, more predictive, and more actionable for brand, packaging, claims, and innovation teams.',
    },
    {
      title: 'Seamless Extension From Syndicated → Bespoke',
      body:
        'Most needs are solved by our deep syndicated insights—but when you require nuance, we extend seamlessly into custom fielding, proprietary questions, and integration dashboards with zero handoff friction.',
    },
  ];

  // Auto-advance every 8s unless reduced motion is enabled
  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [reduce, items.length]);

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50" aria-labelledby="diff-showcase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <h2
          id="diff-showcase"
          className="text-center font-bold text-slate-900 text-[clamp(1.8rem,4.5vw,2.5rem)]"
        >
          What Makes{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            EcoFocus
          </span>{' '}
          Different
        </h2>

        <p className="mt-4 text-center text-slate-600 max-w-3xl mx-auto">
          Each differentiator is part of our DNA—linking sustainability depth with brand-ready agility.
        </p>

        {/* Carousel */}
        <div className="relative mt-12 flex items-center justify-center overflow-hidden h-[300px] sm:h-[280px] md:h-[260px]">
          {items.map((item, i) => {
            const isActive = i === index;
            const offset = (i - index + items.length) % items.length;

            return (
              <motion.div
                key={item.title}
                animate={{
                  x: offset * 340 - (offset > 1 ? items.length * 340 : 0),
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.3,
                  rotateY: isActive ? 0 : offset === 1 ? -15 : 15,
                }}
                transition={{
                  duration: reduce ? 0 : 0.9,
                  ease: [0.25, 0.8, 0.4, 1],
                }}
                className="absolute w-[320px] sm:w-[340px] rounded-3xl bg-white ring-1 ring-gray-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-center text-center"
                style={{
                  zIndex: isActive ? 10 : 1,
                  transformStyle: 'preserve-3d',
                }}
              >
                <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-10 flex justify-center gap-3">
          <button
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Prev
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
