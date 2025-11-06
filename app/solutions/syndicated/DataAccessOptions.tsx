'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const dataAccessItems = [
  {
    title: 'Interactive Dashboard',
    description:
      'Explore trends, filter by audience, and build custom views—24/7/365 access to tens of thousands of data points.',
    image: '/images/dashboard-card.png',
  },
  {
    title: 'Exportable Crosstabs',
    description:
      'Download robust crosstabs aligned to your priorities—no manual slicing. Great for quick internal share-outs.',
    image: '/images/crosstab-card.png',
  },
  {
    title: 'Executive Summary & Consulting',
    description:
      'Executive summaries, insights, and optional consulting to connect findings to strategy, planning, and activation.',
    image: '/images/report-card.png',
  },
];

export default function DataAccessOptions() {
  return (
    <section className="relative bg-white" aria-labelledby="data-access-options">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          className="text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)] tracking-tight font-bold text-gray-900 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Multiple Access Points
          </span>{' '}
          to the Insights You Need
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {dataAccessItems.map((i) => (
            <div key={i.title} className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 ring-1 ring-black/5 shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_72px_-22px_rgba(2,12,27,.32)]">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900">{i.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{i.description}</p>
              </div>
              <div className="relative h-40 w-full">
                <Image src={i.image} alt={i.title} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

