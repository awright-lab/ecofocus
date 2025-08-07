"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function SyndicatedResearchPage() {
  return (
    <section className="bg-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Syndicated Research
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg text-gray-600 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Our annual syndicated study gathers insights from over 4,000 U.S. consumers
          to uncover the evolving trends, motivations, and behaviors shaping sustainability
          in today’s marketplace.
        </motion.p>

        {/* Image */}
        <motion.div
          className="w-full h-[300px] relative rounded-xl overflow-hidden shadow-lg mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/images/solutions/syndicated.jpg"
            alt="Syndicated Research"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "National Sample",
              text: "Data from 4,000+ U.S. consumers ensures strong representation across demographics.",
            },
            {
              title: "Annual Trends",
              text: "Track year-over-year shifts in sustainability attitudes and behaviors.",
            },
            {
              title: "Cross-Category Insights",
              text: "Explore how sustainability perceptions vary across food, beverage, home, and lifestyle.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/contact"
            className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-md hover:bg-emerald-700 transition"
          >
            Request a Preview Report
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
