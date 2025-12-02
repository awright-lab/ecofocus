"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const accessItems = [
  {
    title: "Custom Survey Dashboard",
    description:
      "Track results in real-time, filter by segment, and explore diagnostics built around your study design.",
    image: "/images/custom-dashboard.png", // replace with your asset
  },
  {
    title: "Exportable Crosstabs & Deliverables",
    description:
      "Download crosstabs, respondent profiles, and full data exports—aligned to your audiences and priorities.",
    image: "/images/custom-crosstab.png", // replace with your asset
  },
  {
    title: "Executive Debrief & Advisory",
    description:
      "Executive-ready summary decks, insight narratives, and optional advisory support to align teams and guide activation.",
    image: "/images/custom-report.png", // replace with your asset
  },
];

export default function AccessOptions() {
  return (
    <section
      className="relative bg-white"
      aria-labelledby="custom-access-options"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        {/* HEADLINE */}
        <motion.h2
          id="custom-access-options"
          className="text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]
                     tracking-tight font-bold text-gray-900 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Multiple Access Points
          </span>{" "}
          to the Insights You Need
        </motion.h2>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {accessItems.map((item) => (
            <div
              key={item.title}
              className="group relative h-full overflow-hidden rounded-2xl
                         bg-gradient-to-br from-white to-gray-50
                         ring-1 ring-black/5
                         shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)]
                         transition hover:-translate-y-0.5
                         hover:shadow-[0_22px_72px_-22px_rgba(2,12,27,.32)]"
            >
              {/* TEXT BLOCK */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>

              {/* IMAGE STRIP */}
              <div className="relative h-40 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}