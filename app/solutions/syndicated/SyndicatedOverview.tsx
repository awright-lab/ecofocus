'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SyndicatedOverview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Actionable Insights You Can Trust
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Our syndicated research provides a foundational view of evolving consumer sustainability
            behaviors. Each report is built from a decade of experience, combining behavioral
            tracking, attitudinal segmentation, and environmental influence measurement.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <span className="mt-1 w-3 h-3 bg-emerald-600 shrink-0 rounded-full"></span>
              <span className="text-gray-700">
                Updated annually to reflect current sustainability sentiment and shifting behaviors
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 w-3 h-3 bg-blue-600 shrink-0 rounded-full"></span>
              <span className="text-gray-700">
                Ideal for benchmarking, trendspotting, and identifying whitespace opportunities
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 w-3 h-3 bg-cyan-600 shrink-0 rounded-full"></span>
              <span className="text-gray-700">
                Trusted by brands, agencies, packaging firms, and NGOs
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/syndicated-overview.png" // Replace with real asset path
              alt="Syndicated Research Overview"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
