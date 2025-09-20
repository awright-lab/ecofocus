"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function DashboardDemo() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="demo" className="relative section-slab-emerald" aria-labelledby="dash-demo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="mb-6 flex items-center justify-between">
          <motion.h2
            id="dash-demo"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            See the dashboard in action
          </motion.h2>
          <span className="hidden sm:inline-flex items-center rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-300/30">
            Demo video
          </span>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10 shadow-2xl"
        >
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
              src="/videos/dashboard-demo.mp4"               // <- replace with your asset
              poster="/images/dashboard/demo-poster.jpg"     // <- replace with your poster
            />
          </div>
        </motion.div>

        <p className="mt-3 text-center text-xs text-white/75">
          Feature availability may vary by license and modules.
        </p>
      </div>
    </section>
  );
}

