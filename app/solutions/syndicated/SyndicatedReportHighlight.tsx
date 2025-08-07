'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function SyndicatedReportHighlight() {
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
          <div className="mb-4">
            <span className="uppercase text-xs tracking-wide bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full border border-emerald-200">
              Report Highlight
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            EcoFocus Sustainability Insights Report
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Our flagship report delivers deep, actionable insights into U.S. consumer sustainability attitudes and behaviors — backed by 15 years of syndicated data. Discover emerging trends, changing priorities, and what it all means for your brand.
          </p>

          <Link
            href="/reports"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Get the Report
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
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <Image
            src="/images/report-cover.png"
            alt="EcoFocus Featured Sustainability Report"
            width={500}
            height={350}
            className="rounded-xl shadow-2xl relative z-10"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
