'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const items = [
  {
    title: 'Integrated Dashboard',
    description:
      'Blend EcoFocus trend data with your internal KPIs in a unified, interactive dashboard—real-time cuts, filters, and visualizations built for decision-makers.',
    image: '/images/integration-dashboard.png',
  },
  {
    title: 'Sustainability Enrichment Files',
    description:
      'We wrap EcoFocus attitudes, behaviors, sentiment, and trust data around your existing datasets—turning them into richer, more explanatory intelligence.',
    image: '/images/enrichment-file.png',
  },
  {
    title: 'Executive Summary & Consulting',
    description:
      'Connect enhanced data to messaging, packaging, innovation, personas, and ESG strategy through optional advisory and activation workshops.',
    image: '/images/integration-consulting.png',
  },
];

export default function DataAccessOptions() {
  return (
    <section className="relative bg-white" aria-labelledby="integration-access">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <motion.h2
          id="integration-access"
          className="text-[clamp(1.8rem,4.5vw,2.5rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]
                     tracking-tight font-bold text-gray-900 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Multiple Access Points
          </span>{' '}
          to Integrated Sustainability Insights
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((i) => (
            <div
              key={i.title}
              className="group relative h-full overflow-hidden rounded-2xl
                         bg-gradient-to-br from-white to-gray-50 ring-1 ring-black/5
                         shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)]
                         transition hover:-translate-y-0.5 hover:shadow-[0_22px_72px_-22px_rgba(2,12,27,.32)]"
            >
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
