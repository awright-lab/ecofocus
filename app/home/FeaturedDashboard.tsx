'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedDashboard() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#124734] to-[#1D3557] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <span className="inline-block uppercase text-xs tracking-wide bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Dashboard Highlight
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Explore the EcoFocus{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Interactive Dashboard
            </span>
          </h2>

          <p className="text-lg text-gray-200 max-w-2xl">
            Instantly access over <strong className="text-white">90,000 sustainability data points</strong>. Segment by demographics, compare trends, and build custom insights in real time — all in one place.
          </p>

          <ul className="space-y-4">
            {[
              'Real-time filtering by demographics & behaviors',
              'Custom crosstabs & chart generation',
              'Export-ready insights & visualizations',
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-xs font-bold shadow-md">
                  ✓
                </div>
                <span className="text-gray-100">{text}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="relative inline-block px-6 py-3 text-sm md:text-base font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#4CAF50,_#2C7FB8)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">View Dashboard Demo</span>
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
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl" />
          <Image
            src="/images/dashboard.png"
            alt="EcoFocus Interactive Dashboard Preview"
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


