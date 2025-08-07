'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function SolutionsOverview() {
  const solutions = [
    {
      title: 'Syndicated Research',
      description: 'Annual study with 4000+ U.S. consumers covering key sustainability trends.',
      image: '/images/solutions/syndicated.jpg', // placeholder path
      link: '/solutions/syndicated',
    },
    {
      title: 'Custom Research',
      description: 'Tailored studies designed to answer your brand-specific questions.',
      image: '/images/solutions/custom.jpg', // placeholder path
      link: '/solutions/custom',
    },
    {
      title: 'Data Infusion',
      description: 'Blend your internal data with EcoFocus insights for enhanced sustainability context.',
      image: '/images/solutions/data-infusion.jpg', // placeholder path
      link: '/solutions/data-infusion',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Core Solutions
        </motion.h2>
        <p className="text-gray-600 text-lg mb-16">
          Explore how EcoFocus helps brands harness the power of data to lead in sustainability.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="p-6 text-left flex flex-col justify-between flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <Link
                  href={solution.link}
                  className="inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700 mt-auto"
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

