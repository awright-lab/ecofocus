'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedReport() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="featured-report-heading" className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
          {/* === Desktop image (hidden on mobile) === */}
          <motion.div
            className="relative order-2 md:order-2 md:col-span-6 hidden md:flex md:justify-end"
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="pointer-events-none absolute -right-8 -bottom-6 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl md:h-80 md:w-80" />
            <div className="relative z-10 mx-auto w-full max-w-[560px] overflow-hidden rounded-xl shadow-2xl">
              <div className="relative aspect-[5/3]">
                <Image
                  src="/images/report-cover.png"
                  alt="EcoFocus Sustainability Insights Report cover"
                  fill
                  priority={false}
                  sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* === Copy / CTA === */}
          <motion.div
            className="order-1 md:order-1 md:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, x: -40 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-100 px-3 py-1 text-[10px] tracking-wide text-black/60">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Report Highlight
              </span>
            </div>

            <h2
              id="featured-report-heading"
              className="mb-3 font-bold leading-tight text-gray-900 text-[clamp(1.75rem,5.5vw,2.5rem)] md:mb-6"
            >
              Sustainability Insights Report
            </h2>

            {/* === Mobile image (sits directly under the title) === */}
            <motion.div
              className="md:hidden mb-4"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/images/report-cover.png"
                    alt="EcoFocus Sustainability Insights Report cover"
                    fill
                    sizes="(max-width: 767px) 92vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              </div>
            </motion.div>

            <p className="mb-6 max-w-xl text-sm text-gray-700 sm:text-base md:mb-8">
            Our flagship report distills complex data into clear takeaways. Track consumer attitudes, behaviors, and expectations — and understand the forces driving tomorrow’s marketplace.
            </p>

            <Link
              href="/reports"
              className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              aria-label="Get the Sustainability Insights Report"
            >
              <span className="relative z-10">Get the Report</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}









