"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function SampleVisual() {
  const r = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="sample-visual">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="sample-visual"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          What the output looks like
        </motion.h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <motion.div
            initial={r ? false : { opacity: 0, y: 12 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-2 ring-1 ring-gray-200 shadow-xl">
              <Image
                src="/images/syndicated/sample.jpg" // add an actual dashboard chart export or mock
                alt="Sample white-label chart export from the Interactive Dashboard"
                width={1280}
                height={800}
                className="h-auto w-full rounded-2xl object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
                White-label export
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
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="text-base font-semibold text-gray-900">
                Export in seconds
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Pull a chart, apply your segment cuts, and export a neutral PNG
                (or CSV for analysts). Optionally add your logo in the footer.
              </p>

              <div className="mt-4">
                <Link
                  href="/solutions/dashboard#demo"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  Watch Dashboard Demo
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
