'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedDashboard() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <span className="uppercase text-[10px] tracking-wide bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full border border-emerald-200">
              Dashboard Highlight
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Explore the EcoFocus Interactive Dashboard
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Instantly access over <strong>90,000 sustainability data points</strong>. Segment by demographics, compare trends, and build custom insights in real time — all in one place.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              'Real-time filtering by demographics & behaviors',
              'Custom crosstabs & chart generation',
              'Export-ready insights & visualizations',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-4 h-4 rounded-full border-2 border-[#ef9601] bg-white flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#ef9601]" />
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
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
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />
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

