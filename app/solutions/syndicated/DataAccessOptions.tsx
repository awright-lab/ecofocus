'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const dataAccessItems = [
  {
    title: 'Interactive Dashboard',
    description:
      'Explore trends, filter data by audience, and build custom views using our web-based insights platform.',
    image: '/images/dashboard-card.png',
  },
  {
    title: 'Exportable Crosstabs',
    description:
      'Download robust crosstabs tailored to your organization’s priorities — no manual slicing needed.',
    image: '/images/crosstabs-card.png',
  },
  {
    title: 'Annual Reports',
    description:
      'Receive detailed PDF reports highlighting core findings, trends, and year-over-year comparisons.',
    image: '/images/reports-card.png',
  },
];

export default function DataAccessOptions() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">
            Multiple Access Points
          </span>{' '}
          to the Insights You Need
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {dataAccessItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-100 hover:border-emerald-300 transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="h-48 w-full relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
