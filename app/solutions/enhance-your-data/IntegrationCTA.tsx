"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function IntegrationCTA() {
  const r = useReducedMotion();

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="integration-cta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="integration-cta"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Ready to enhance your data?
        </motion.h2>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300
                       before:content-[''] before:absolute before:inset-0 before:rounded-full
                       before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Talk to us</span>
          </Link>
          <Link
            href="/solutions/dashboard"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC107] px-6 py-3 text-sm font-semibold text-emerald-950 shadow-md transition-all duration-300
                       before:content-[''] before:absolute before:inset-0 before:rounded-full
                       before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">See dashboard in action</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
