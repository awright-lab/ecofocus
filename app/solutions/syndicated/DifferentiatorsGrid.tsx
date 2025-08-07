'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, BarChart, Layers3 } from 'lucide-react';

const differentiators = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    title: 'Trusted Since 2010',
    description:
      'Over a decade of experience in sustainability research, serving some of the most recognized brands and organizations in the space.',
  },
  {
    icon: <BarChart className="w-6 h-6 text-blue-600" />,
    title: 'Depth & Breadth',
    description:
      'Rich datasets across dozens of behavioral, attitudinal, and demographic dimensions — updated annually and continuously refined.',
  },
  {
    icon: <Layers3 className="w-6 h-6 text-cyan-600" />,
    title: 'Multi-Sector Relevance',
    description:
      'From CPG to retail to public policy, our research is built to drive strategy across verticals without losing specificity.',
  },
];

export default function DifferentiatorsGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Makes Our Research{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">
            Unmatched
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {differentiators.map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 border border-gray-100 hover:border-emerald-300 rounded-2xl shadow-sm hover:shadow-md p-6 text-center transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
