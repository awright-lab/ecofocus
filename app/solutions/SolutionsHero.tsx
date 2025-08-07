'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SolutionsHero() {
  return (
    <section className="relative max-h-[65vh] flex items-center justify-center overflow-hidden bg-neutral-950 text-white z-0">
      {/* ✅ Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover brightness-[0.4]"
        >
          <source
            src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-5.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* ✅ Diagonal Gradient Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="w-full h-full bg-gradient-to-br from-emerald-900/80 to-blue-900/80"
          style={{
            clipPath: 'polygon(0% 0%, 40% 0%, 70% 100%, 0% 100%)'
          }}
        />
      </div>

      {/* ✅ Main Content */}
      <div className="relative z-20 w-full max-w-7xl px-6 py-28 grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Solutions for a Sustainable Future
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
            Expert-Led Sustainability <br className="hidden md:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8] animate-gradient">
              Research & Strategy
            </span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl">
            We empower brands with syndicated research, custom studies, and data infusion strategies
            to make sustainability your competitive edge.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#syndicated"
              className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
                before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">Explore Solutions</span>
            </Link>
            <Link
              href="/contact"
              className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full border border-white/30 hover:bg-white/10 transition-all"
            >
              <span className="relative z-10">Start a Conversation</span>
            </Link>
          </div>
        </motion.div>

        {/* Optional Right Visual (Placeholder) */}
        <motion.div
          className="hidden md:block md:col-span-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full aspect-square" />
        </motion.div>
      </div>
    </section>
  );
}





