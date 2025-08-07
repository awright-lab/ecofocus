'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function DataSnapshotPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            See the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">Data in Action</span>
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            Our syndicated study includes access to an interactive dashboard with real-time filtering by demographic and behavioral criteria. Spot trends, explore deep crosstabs, and export actionable visuals.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
            <li>Explore over 90,000 data points</li>
            <li>Compare insights by generation, gender, region & more</li>
            <li>Export ready-made graphs and charts</li>
          </ul>

          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold shadow hover:bg-emerald-700 transition-all"
          >
            Explore the Dashboard
          </Link>
        </motion.div>

        {/* Right Image / Chart Preview */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/images/dashboard-preview.png"
              alt="EcoFocus Data Dashboard Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
