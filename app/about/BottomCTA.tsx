'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function BottomCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="cta" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-20 -left-24 h-56 w-56 rounded-full bg-emerald-100 blur-3xl opacity-30" />
      <div className="pointer-events-none absolute -bottom-24 -right-28 h-60 w-60 rounded-full bg-blue-100 blur-3xl opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10"
        >
          <div className="text-center md:col-span-7 md:text-left">
            <h2 id="cta" className="mb-4 font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)]">
              Ready to put the data to work?
            </h2>
            <p className="mx-auto max-w-xl text-sm text-gray-600 sm:text-base md:mx-0">
              Book a consultation and we’ll map the fastest path from insight to impact.
            </p>
          </div>

          <div className="md:col-span-5 flex items-center justify-center gap-3 sm:justify-end">
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">Request a Consultation</span>
            </Link>
            <Link
              href="/solutions"
              className="relative inline-flex items-center justify-center rounded-full bg-[#FFC107] px-5 py-2.5 text-sm font-semibold text-black overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">Explore Solutions</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
