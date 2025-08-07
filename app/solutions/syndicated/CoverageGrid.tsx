// Next Section: Coverage Grid

import { motion } from 'framer-motion';
import Image from 'next/image';

const coverageAreas = [
  {
    title: 'Consumer Lifestyles',
    description: 'Uncover how sustainability values influence everyday choices and brand loyalty.',
    image: '/images/icons/lifestyle.png',
  },
  {
    title: 'Product Categories',
    description: 'Gain insight into sustainability expectations across key food, beverage, and household sectors.',
    image: '/images/icons/categories.png',
  },
  {
    title: 'Packaging Preferences',
    description: 'See what materials, claims, and formats resonate with eco-conscious consumers.',
    image: '/images/icons/packaging.png',
  },
  {
    title: 'Sustainability Labels',
    description: 'Explore the impact of certifications, eco-labels, and third-party trustmarks.',
    image: '/images/icons/labels.png',
  },
];

export default function CoverageGrid() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Coverage You Can Act On
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our syndicated research dives deep into the areas that matter most for sustainable success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {coverageAreas.map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex gap-6 items-start shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center">
                <Image src={item.image} alt={item.title} width={32} height={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
