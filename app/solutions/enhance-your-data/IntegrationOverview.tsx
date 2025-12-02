'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function IntegrationOverview() {
  const r = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="integration-overview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">

        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-black/60">What It Is</span>
        </div>

        {/* Headline + body */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-4 md:gap-6">
          <motion.h2
            id="integration-overview"
            initial={r ? false : { opacity: 0, y: -12 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45 }}
            className="md:col-span-6 font-bold leading-tight text-slate-900
                       text-[clamp(1.8rem,4.5vw,2.6rem)] tracking-tight"
          >
            Everything You Need to Give Your Data{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 
                             bg-clip-text text-transparent animate-gradient">
              Sustainability Intelligence
            </span>
          </motion.h2>

          <motion.p
            initial={r ? false : { opacity: 0 }}
            whileInView={r ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="md:col-span-6 text-slate-600 text-base md:text-lg"
          >
            EcoFocus strengthens your existing datasets by infusing them with 13+ years of sustainability-specific
            consumer intelligence—revealing the “why” behind your KPIs and turning everyday metrics into actionable
            drivers for brand, innovation, and ESG decisions.
          </motion.p>
        </div>

        <motion.p
          initial={r ? false : { opacity: 0 }}
          whileInView={r ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-5 max-w-3xl text-slate-600"
        >
          We wrap EcoFocus trend data around your internal datasets—sales, personas, trackers, loyalty files,
          qualitative insights, or segmentation—to add sustainability context, behavioral depth, and meaning your
          teams can act on with confidence.
        </motion.p>
      </div>
    </section>
  );
}
