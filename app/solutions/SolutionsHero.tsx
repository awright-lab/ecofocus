'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SolutionsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-neutral-950 text-white overflow-hidden">
      {/* Glowing Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-emerald-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-6 py-32 text-center relative z-10">
        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white mb-6"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          EcoFocus Solutions
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="block">Strategic Research</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] via-[#2C7FB8] to-[#4CAF50] animate-gradient-x">
            Tailored for Sustainability
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-300 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Explore custom solutions designed to help your organization lead in sustainability. From syndicated studies to proprietary data projects, EcoFocus delivers insights with impact.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/contact"
            className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#4CAF50] overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#4CAF50,_#2C7FB8)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Work With Us</span>
          </Link>

          <Link
            href="/reports"
            className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition"
          >
            <span className="relative z-10">See Our Research</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


