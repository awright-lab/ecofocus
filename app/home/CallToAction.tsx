'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function CallToAction() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-white"
    >
      {/* spacing */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        {/* subtle floating accents (toned for mobile; no pointer events) */}
        <div
          className="pointer-events-none absolute -top-20 -left-24 h-56 w-56 rounded-full bg-emerald-100 blur-3xl opacity-30"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-28 h-60 w-60 rounded-full bg-blue-100 blur-3xl opacity-30"
          aria-hidden="true"
        />

        <motion.div
          className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left: Heading + Subheading */}
          <motion.div
            className="text-center md:text-left md:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            <h2
              id="cta-heading"
              className="mb-4 md:mb-6 font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
            >
              Ready to Elevate Your Sustainability Strategy?
            </h2>
            <p className="mx-auto md:mx-0 max-w-xl text-sm text-gray-600 sm:text-base">
              Book a consultation with our experts today and start turning data into actionable impact.
            </p>
          </motion.div>

          {/* Right: CTA Buttons */}
          <motion.div
            className="md:col-span-5 flex flex-col items-center gap-3 sm:flex-row md:justify-end sm:gap-4 mt-6 md:mt-0"
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              aria-label="Request a Consultation"
            >
              <span className="relative z-10">Request a Consultation</span>
            </Link>

            <Link
              href="/solutions"
              className="relative inline-flex items-center justify-center rounded-full bg-[#FFC107] px-5 py-2.5 text-sm font-semibold text-black overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              aria-label="Explore Solutions"
            >
              <span className="relative z-10">Explore Solutions</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}





