'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function SolutionsOverview() {
  const solutions = [
    {
      title: 'Syndicated Research',
      description: 'Annual study with 4000+ U.S. consumers covering key sustainability trends.',
      link: '/solutions/syndicated',
      image: '/images/solution-syndicated.jpg',
    },
    {
      title: 'Custom Research',
      description: 'Tailored studies designed to answer your brand-specific questions.',
      link: '/solutions/custom',
      image: '/images/solution-custom.jpg',
    },
    {
      title: 'Data Infusion',
      description: 'Blend your internal data with EcoFocus insights for enhanced sustainability context.',
      link: '/solutions/data-infusion',
      image: '/images/solution-infusion.jpg',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Core Solutions
        </motion.h2>
        <p className="text-gray-600 text-lg mb-16 text-center">
          Explore how EcoFocus helps brands harness the power of data to lead in sustainability.
        </p>

        <div className="grid gap-12">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <Link
                  href={solution.link}
                  className="inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

