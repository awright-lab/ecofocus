'use client';

import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    title: 'Syndicated Research',
    description: 'Annual study with 4000+ U.S. consumers covering key sustainability trends.',
    link: '/solutions/syndicated',
    image: '/images/solutions-syndicated.png',
    overlayColor: 'bg-[#00767a]/20', // lighter teal overlay
  },
  {
    title: 'Custom Research',
    description: 'Tailored studies designed to answer your brand-specific questions.',
    link: '/solutions/custom',
    image: '/images/solutions-custom.png',
    overlayColor: 'bg-[#dd803e]/20', // lighter orange overlay
  },
  {
    title: 'Data Infusion',
    description: 'Blend your internal data with EcoFocus insights for enhanced sustainability context.',
    link: '/solutions/data-infusion',
    image: '/images/solutions-infusion.png',
    overlayColor: 'bg-[#9bbd3f]/20', // lighter green overlay
  },
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
          Your Gateway to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-900 to-slate-900 gradientMove bg-[length:200%_200%]">
            Sustainability Intelligence
          </span>
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
              className="bg-white rounded-2xl shadow-xl p-0 border border-neutral-200 hover:shadow-2xl transition-shadow flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Image fills top half */}
              <div className="relative w-full h-64 md:h-[50%]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover brightness-110 saturate-125"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={`absolute inset-0 ${service.overlayColor} mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-black/5"></div>
              </div>

              {/* Text + CTA */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-neutral-600 mb-4 text-sm leading-relaxed flex-grow">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
                    before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                    before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">Learn More</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}













