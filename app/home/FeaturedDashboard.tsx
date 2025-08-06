'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedDashboard() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          className="md:col-span-6 bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-gray-200 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4">
            <span className="uppercase text-xs tracking-widest bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-300">
              Dashboard Highlight
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore the EcoFocus Interactive Dashboard
          </h2>

          <p className="text-lg text-gray-700 mb-8">
            Instantly access over <strong>90,000 sustainability data points</strong>. Segment by demographics, compare trends, and build custom insights in real time — all in one place.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              'Real-time filtering by demographics & behaviors',
              'Custom crosstabs & chart generation',
              'Export-ready insights & visualizations',
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold shadow-md">
                  ✓
                </span>
                <span className="text-gray-700 text-sm md:text-base">{text}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">View Dashboard Demo</span>
          </Link>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="md:col-span-6 relative"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glow Behind Image */}
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl -top-10 -left-10"></div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/images/dashboard.png"
              alt="EcoFocus Interactive Dashboard Preview"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}



