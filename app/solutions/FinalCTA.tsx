'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  /** Optional background image path. If omitted, uses abstract gradient */
  bgImageSrc?: string;
  /** Optional alt text for background image */
  bgImageAlt?: string;
};

export default function FinalCTA({ bgImageSrc, bgImageAlt = 'EcoFocus background' }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* Background: image (optional) */}
      {bgImageSrc && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={bgImageSrc}
            alt={bgImageAlt}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Gradient overlay (always on, to unify brand + improve contrast) */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-emerald-900/80 via-teal-900/70 to-blue-900/80" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs md:text-sm mb-5 backdrop-blur-sm">
              Let’s Build Your Next Insight Together
            </span>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Turn Sustainability Signals into Strategic Advantage
            </h2>

            <p className="text-gray-200/90 max-w-2xl mx-auto mb-10">
              Whether you need tailored research or want to explore our latest findings,
              we’ll help you move from questions to confident, data‑backed decisions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact?type=custom-project"
                className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#124734]
                           overflow-hidden transition-all duration-300
                           before:absolute before:inset-0 before:rounded-full
                           before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                           before:scale-0 hover:before:scale-110 before:transition-transform before:duration-500"
              >
                <span className="relative z-10">Start a Custom Project</span>
              </Link>

              <Link
                href="/reports/latest"
                className="inline-block px-6 py-3 text-sm font-semibold text-white rounded-full border border-white/40 hover:bg-white/10 transition-all"
              >
                View Our Latest Report
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Soft vignette edges for depth (optional) */}
      <div className="pointer-events-none absolute inset-0 bg-black/10 mix-blend-multiply" />
    </section>
  );
}

