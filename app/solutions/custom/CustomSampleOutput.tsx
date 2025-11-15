'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function CustomSampleOutput() {
  const r = useReducedMotion();

  return (
    <section
      className="relative bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="custom-sample-output"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="custom-sample-output"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-slate-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What Custom Outputs Look Like
        </motion.h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <motion.div
            initial={r ? false : { opacity: 0, y: 12 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-2 ring-1 ring-slate-200 shadow-xl">
              <Image
                src="/images/custom-output.gif"
                alt="Sample custom study output"
                width={1280}
                height={800}
                className="h-auto w-full rounded-2xl object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
                Example deliverable
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={r ? false : { opacity: 0, y: 12 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="md:col-span-5 flex items-center"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="text-base font-semibold text-slate-900">
                Executive-ready, team-ready.
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                Whether it’s a board deck, category story, or working session toolkit,
                we build outputs that plug directly into how your organization makes
                decisions—not just a PDF that gathers dust.
              </p>

              <div className="mt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full relative min-h-[44px] bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                           touch-manipulation
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                           before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">See example deliverables</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
