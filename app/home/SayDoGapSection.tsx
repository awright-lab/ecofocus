// app/components/SayDoGapSection.tsx
'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export default function SayDoGapSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Headline */}
        <motion.h2
          className="font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
        >
          From Intent to Action: Closing the{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Say–Do Gap
          </span>
        </motion.h2>

        {/* Layout: image left with overlaid copy card (card on the LEFT now) */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Left: image with floating card */}
          <div className="md:col-span-6 relative">
            <div className="relative h-72 md:h-[22rem] w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/say-do-gap.jpg"   // <-- replace with your asset
                alt="Consumers bridging intent and action"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating card moved to the LEFT */}
            <div className="absolute left-3 top-3 md:-left-8 md:-top-6 w-[88%] md:w-[60%]">
              <div className="rounded-2xl bg-white/95 backdrop-blur-[2px] shadow-xl ring-1 ring-slate-200 p-5 md:p-6">
                <p className="text-[15px] md:text-base leading-relaxed text-slate-700">
                  The Say–Do Gap isn’t hypocrisy—it’s friction. We map where
                  intent stalls and which proof points (benefits, cues, claims)
                  actually unlock action for your audience.
                </p>
              </div>
            </div>
          </div>

          {/* Right: main body copy */}
          <motion.div
            className="md:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <p className="text-base sm:text-[17px] leading-7 text-slate-800">
              Let’s be honest: this Say–Do Gap is one of the most frustrating
              challenges in consumer marketing. It’s tempting to dismiss it as hypocrisy—or
              dismiss sustainability as a sales driver altogether. The key to addressing it is
              first understanding what consumers are looking for—their sustainability attitudes
              and intended behaviors—and having a clear picture of how sustainability influences
              their aspirations and desires.
            </p>
            <p className="mt-4 text-base sm:text-[17px] leading-7 text-slate-800">
              At EcoFocus, we have the data (or can get the data) you need to identify
              sustainability personas for your target audience to help you build strategies—backed
              by data—to gain market share and reduce churn.{' '}
              <span className="font-semibold text-slate-900">
                Don’t speculate about your eco-minded customer. Understand them. Influence them. Win them.
              </span>
            </p>
          </motion.div>
        </div>

        {/* Optional divider for polish */}
        <div className="mt-10 md:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}










