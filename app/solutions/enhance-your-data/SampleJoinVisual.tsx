"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

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
          What the Merged Output Looks Like
        </motion.h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Visual */}
          <motion.div
            initial={r ? false : { opacity: 0, y: 12 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-2 ring-1 ring-gray-200 shadow-xl">
              <Image
                // Replace with your real white-label export (joined dataset) image or GIF
                src="/images/integration/white-label-join.gif"
                alt="White-label export showing a joined EcoFocus + client dataset"
                width={1280}
                height={800}
                className="h-auto w-full rounded-2xl object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
                White-label export
              </span>
            </div>
          </motion.div>

          {/* Copy card */}
          <motion.div
            initial={r ? false : { opacity: 0, y: 12 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="md:col-span-5 flex items-center"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="text-base font-semibold text-gray-900">
                Export in seconds
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Apply your segment cuts to the <em>joined</em> dataset and export a neutral PNG
                (or CSV/Parquet for analysts). No EcoFocus brand colors in the export—deck-ready,
                and you can optionally add a client logo footer.
              </p>

              <div className="mt-4">
                <Link
                  href="/solutions/dashboard#demo"
                  className="inline-flex items-center justify-center rounded-full relative min-h-[44px] bg-emerald-600 px-5 py-3 sm:py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                             touch-manipulation
                             before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                             before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">Watch Dashboard Demo</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="mt-3 text-center text-xs text-gray-500">
          Neutral, white-label styling for decks and briefs. Significance and small-base flags are preserved.
        </p>
      </div>
    </section>
  );
}

