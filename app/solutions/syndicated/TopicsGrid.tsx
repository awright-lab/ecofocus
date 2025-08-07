'use client';

import { motion } from 'framer-motion';
import { Lightbulb, PackageSearch, Leaf, Users, ScanSearch, TrendingUp } from 'lucide-react';

const topics = [
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    title: 'Consumer Priorities',
    description: 'Understand which sustainability issues are top-of-mind for today’s shoppers.',
  },
  {
    icon: <PackageSearch className="w-6 h-6 text-emerald-500" />,
    title: 'Packaging Preferences',
    description: 'Discover how material types, labeling, and formats impact purchase behavior.',
  },
  {
    icon: <Leaf className="w-6 h-6 text-green-500" />,
    title: 'Sustainable Lifestyles',
    description: 'Track adoption of low-impact habits across key demographics and regions.',
  },
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: 'Demographic Segmentation',
    description: 'Analyze differences in attitude and behavior across generations, incomes, and more.',
  },
  {
    icon: <ScanSearch className="w-6 h-6 text-cyan-500" />,
    title: 'Label & Certification Trust',
    description: 'Which logos, seals, and claims do consumers recognize and rely on most?',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
    title: 'Year-over-Year Trends',
    description: 'Identify which sustainability behaviors are growing, declining, or staying stable.',
  },
];

export default function TopicsGrid() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Sample Topics{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">
            Covered
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-100 hover:border-blue-300 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center mb-4">{topic.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{topic.title}</h3>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
