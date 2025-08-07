'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SyndicatedBenefits() {
  const benefits = [
    {
      title: 'Immediate Access to Data',
      text: 'Get instant access to our comprehensive research archive with thousands of data points spanning key sustainability trends.',
      image: '/images/syndicated/access.png'
    },
    {
      title: 'Consistent Tracking Over Time',
      text: 'Leverage year-over-year insights to identify shifts in consumer behavior and emerging trends.',
      image: '/images/syndicated/trending.png'
    },
    {
      title: 'Category & Demographic Breakouts',
      text: 'Filter data by product category, generation, gender, lifestyle habits, and more.',
      image: '/images/syndicated/segments.png'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Syndicated Research?
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="relative h-40 mb-6">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
