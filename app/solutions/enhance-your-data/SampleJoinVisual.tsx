"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function SampleJoinVisual() {
  const r = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="sample-join">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="sample-join"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What the merged output looks like
        </motion.h2>

        <motion.div
          initial={r ? false : { opacity: 0, y: 12 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mt-6 max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-white p-2 ring-1 ring-gray-200 shadow-xl">
            <Image
              src="/images/integration/sample-join.jpg" // replace with a real joined-output visual
              alt="White-label visual of joined EcoFocus + client data"
              width={1360}
              height={900}
              className="h-auto w-full rounded-2xl object-cover"
            />
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
              White-label export
            </span>
          </div>
          <p className="mt-3 text-center text-xs text-gray-600">
            Neutral deck-ready style; client logo footer available. No EcoFocus brand colors in the export.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
