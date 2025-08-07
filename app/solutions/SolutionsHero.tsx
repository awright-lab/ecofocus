'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function SolutionsHero() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Category Tag */}
          <div className="mb-4">
            <span className="uppercase text-[10px] tracking-wide bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full border border-emerald-200">
              Solutions Overview
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tailored Solutions for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8]">
              Sustainability-Driven Brands
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-600 mb-8">
            EcoFocus offers a suite of research-backed solutions that help brands decode consumer behavior, uncover new trends, and build smarter sustainability strategies.
          </p>

          {/* CTA */}
          <Link
            href="#solutions"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Explore Our Solutions
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
          {/* Soft Glow */}
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

          {/* Hero Image */}
          <Image
            src="/images/solutions-hero.png"
            alt="EcoFocus Solutions Graphic"
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



