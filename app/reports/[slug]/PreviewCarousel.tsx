"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Report } from "./data";

export default function PreviewCarousel({ report }: { report: Report }) {
  const r = useReducedMotion();
  if (!report.preview?.length) return null;

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="preview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-14">
        <motion.h2
          id="preview"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]"
        >
          Preview pages
        </motion.h2>

        <div className="mt-6 overflow-x-auto">
          <ul className="flex snap-x snap-mandatory gap-4 pb-2">
            {report.preview.map((src, i) => (
              <li key={src} className="snap-start">
                <div className="relative h-[300px] w-[210px] overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 shadow-md sm:h-[360px] sm:w-[252px]">
                  <Image
                    src={src}
                    alt={`Preview page ${i + 1} for ${report.title}`}
                    fill
                    className="object-contain"
                    sizes="(min-width:1280px) 252px, 210px"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 text-center text-xs text-gray-600">
          Previews show a subset of pages. Full report includes all chapters and appendices.
        </p>
      </div>
    </section>
  );
}
