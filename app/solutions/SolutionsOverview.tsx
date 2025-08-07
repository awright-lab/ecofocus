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
      image: '/images/solutions-syndicated.png',
      overlayColor: 'bg-[#00767a]/60', // deep teal
    },
    {
      title: 'Custom Research',
      description: 'Tailored studies designed to answer your brand-specific questions.',
      link: '/solutions/custom',
      image: '/images/solutions-custom.png',
      overlayColor: 'bg-[#dd803e]/60', // warm orange
    },
    {
      title: 'Data Infusion',
      description: 'Blend your internal data with EcoFocus insights for enhanced sustainability context.',
      link: '/solutions/data-infusion',
      image: '/images/solutions-infusion.png',
      overlayColor: 'bg-[#9bbd3f]/60', // green
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
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative w-full h-48 md:h-56">
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={`absolute inset-0 ${solution.overlayColor} mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-black/20"></div> {/* optional dark overlay */}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{solution.title}</h3>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                </div>
                <Link
                  href={solution.link}
                  className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
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


