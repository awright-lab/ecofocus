'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
//import Image from 'next/image';

export default function SolutionsHero() {
  return (
    <section className="relative bg-white py-28 overflow-hidden">
      {/* Animated Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 via-white to-blue-50 z-0"></div>
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-to-br from-emerald-300/20 to-blue-300/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-2xl z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6"
        >
          Solutions That Power <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">Purpose-Driven Growth</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10"
        >
          From syndicated research to fully custom projects and proprietary data infusion, our solutions are designed to give your brand the sustainability edge.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            href="#solutions-overview"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Explore Our Solutions
          </Link>
          <Link
            href="/contact"
            className="bg-white border-2 border-emerald-600 text-emerald-700 font-semibold px-8 py-4 rounded-full shadow-md hover:bg-emerald-50 transition-transform hover:scale-105"
          >
            Start a Project
          </Link>
        </motion.div>
      </div>
    </section>
  );
}



