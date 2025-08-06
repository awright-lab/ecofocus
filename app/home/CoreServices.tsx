'use client';

import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    title: 'Syndicated Research',
    description:
      'Annual study with 4000+ U.S. consumers covering sustainability trends.',
    icon: 'icons/research.svg',
    link: '/solutions#syndicated-research'
  },
  {
    title: 'Custom Research',
    description:
      'Tailored studies designed to answer your brand-specific questions.',
    icon: 'icons/custom.svg',
    link: '/solutions#custom-research'
  },
  {
    title: 'Data Infusion',
    description:
      'Blend your existing data with our insights for deeper sustainability context.',
    icon: 'icons/infusion.svg',
    link: '/solutions#data-infusion'
  }
];

export default function CoreServices() {
  return (
    <section className="relative bg-neutral-50 py-24 overflow-hidden">
      <FloatingOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Your Gateway to <span className="text-[#2F5D3A]">Sustainability Intelligence</span>
        </motion.h2>

        <motion.p
          className="text-lg text-neutral-600 text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover the research solutions that power brand success in a purpose-driven world.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200 hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 mb-4">
                <Image src={`/${service.icon}`} alt={service.title} width={56} height={56} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                {service.title}
              </h3>
              <p className="text-neutral-600 mb-4 text-sm leading-relaxed">
                {service.description}
              </p>
              <Link
                href={service.link}
                className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-[#2F5D3A] overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              >
                <span className="relative z-10">Learn More</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}












