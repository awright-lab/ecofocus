'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedReport() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="uppercase text-[10px] tracking-wide bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full border border-emerald-200">
              Report Highlight
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Sustainability Insights Report
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Our latest report dives deep into consumer behavior and sustainability
            trends shaping the market in 2024 and beyond. Gain the knowledge you
            need to stay ahead of the curve.
          </p>

          <Link
            href="/reports"
            className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Get the Report</span>
          </Link>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Soft glow behind the image */}
          <div className="absolute w-[280px] h-[280px] bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />

          <Image
            src="/images/report-cover.png"
            alt="EcoFocus Featured Sustainability Report"
            width={500}
            height={350}
            className="rounded-xl shadow-2xl relative z-10 object-cover"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}







