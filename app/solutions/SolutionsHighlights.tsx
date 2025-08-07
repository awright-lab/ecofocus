'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Sparkles,
  Layers3,
  BrainCog,
  SearchCheck
} from 'lucide-react';

const solutions = [
  {
    title: 'Syndicated Research',
    gradient: 'from-[#4CAF50] to-[#2C7FB8]',
    bullets: [
      { icon: <BarChart3 className="w-5 h-5 text-emerald-600" />, text: 'Track consumer trends year-over-year' },
      { icon: <SearchCheck className="w-5 h-5 text-emerald-600" />, text: 'Reliable data across key sustainability areas' },
      { icon: <Users className="w-5 h-5 text-emerald-600" />, text: 'Built from 4,000+ U.S. consumer responses' },
    ],
    link: '/solutions/syndicated',
  },
  {
    title: 'Custom Research',
    gradient: 'from-[#FF8743] to-[#FFD26F]',
    bullets: [
      { icon: <Sparkles className="w-5 h-5 text-orange-500" />, text: 'Tailored insights for your business goals' },
      { icon: <Users className="w-5 h-5 text-orange-500" />, text: 'Qual + quant methodologies for any audience' },
      { icon: <Layers3 className="w-5 h-5 text-orange-500" />, text: 'Deep discovery process ensures alignment' },
    ],
    link: '/solutions/custom',
  },
  {
    title: 'Data Infusion',
    gradient: 'from-[#9bbd3f] to-[#56a96f]',
    bullets: [
      { icon: <BrainCog className="w-5 h-5 text-lime-600" />, text: 'Augment your internal data with our insights' },
      { icon: <BarChart3 className="w-5 h-5 text-lime-600" />, text: 'Generate smarter personas and segments' },
      { icon: <Sparkles className="w-5 h-5 text-lime-600" />, text: 'Uncover hidden patterns with enriched context' },
    ],
    link: '/solutions/data-infusion',
  },
];

export default function SolutionsHighlights() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Makes Our Solutions Different?
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {solutions.map((solution, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <h3
                className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${solution.gradient} mb-6`}
              >
                {solution.title}
              </h3>

              <ul className="space-y-4 flex-1">
                {solution.bullets.map((bullet, j) => (
                  <li key={j} className="flex gap-3 items-start text-gray-700 text-sm">
                    {bullet.icon}
                    <span>{bullet.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={solution.link}
                className="mt-6 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Learn More →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
