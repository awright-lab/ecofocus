'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SyndicatedCTA() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-600 to-blue-700 py-24 text-white overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-blue-300/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-400/30 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Unlock Powerful Sustainability Insights?
        </motion.h2>

        <motion.p
          className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Access the full EcoFocus Syndicated Research study today — and turn complex data into clear, actionable strategy for your brand.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="relative inline-block px-8 py-4 text-sm md:text-base font-semibold text-white rounded-full bg-[#4CAF50] overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#4CAF50,_#2C7FB8)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Get Full Access</span>
          </Link>

          <Link
            href="/reports"
            className="relative inline-block px-8 py-4 text-sm md:text-base font-semibold text-white rounded-full border border-white/40 hover:bg-white/10 transition-all"
          >
            <span className="relative z-10">View Sample Report</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
