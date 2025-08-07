'use client';

import { motion } from 'framer-motion';
import { Briefcase, Lightbulb, BarChart3 } from 'lucide-react';

const useCases = [
  {
    icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
    title: 'Marketing & Brand Strategy',
    description:
      'Uncover the sustainability drivers that shape consumer perception and build campaigns that resonate with conscious buyers.',
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-blue-600" />,
    title: 'Product Innovation',
    description:
      'Validate new ideas or pivot existing product lines using emerging trends in consumer behavior and sustainability concerns.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-cyan-600" />,
    title: 'Investor & ESG Communications',
    description:
      'Leverage data-backed narratives to showcase alignment with environmental priorities and consumer demand shifts.',
  },
];

export default function UseCasesGrid() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">
            Real-World Applications
          </span>{' '}
          of Syndicated Insights
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, i) => (
            <motion.div
              key={i}
              className="bg-white border border-gray-100 hover:border-emerald-300 rounded-2xl shadow-md hover:shadow-xl p-6 text-center transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="flex justify-center mb-4">{useCase.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{useCase.title}</h3>
              <p className="text-sm text-gray-600">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
