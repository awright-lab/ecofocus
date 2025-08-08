'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function TrustedBy() {
  const logos = [
    { src: '/images/logos/Avery Logo_Light Backgrounds.png', alt: 'Avery' },
    { src: '/images/logos/CGLR-Icon.png', alt: 'Council of the Great Lakes Region' },
    { src: '/images/logos/clean_label.png', alt: 'Clean Label Project' },
    { src: '/images/logos/duraflame-logo.png', alt: 'Duraflame' },
    { src: '/images/logos/Site_GPI Logo 2_0.png', alt: 'Glass Packaging Institute' },
    { src: '/images/logos/thinkPARALLAX_Logos_RBW-01-bug.png', alt: 'thinkPARALLAX' },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tag */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="uppercase text-xs tracking-wide bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full border border-emerald-200">
            Partners
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
        Trusted by{' '}
        <span className="bg-clip-text text-transparent animate-gradient bg-gradient-to-r from-[#ffbf2f] via-[#FFA000] to-[#ef9601]">
        Leading Organizations
        </span>
        </motion.h2>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              className="relative bg-white rounded-xl p-4 flex items-center justify-center border border-gray-200 shadow-sm group hover:shadow-md hover:border-emerald-300 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={60}
                className="object-contain grayscale group-hover:grayscale-0 transition duration-500 max-h-16"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/partners"
            className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Become a Partner →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}




