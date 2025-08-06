'use client';

import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';
import Link from 'next/link';
import Image from 'next/image';

export default function CoreServices() {
  const services = [
    {
      title: 'Syndicated Research',
      icon: 'ri-bar-chart-box-line',
      color: 'from-emerald-400 via-blue-400 to-emerald-500',
      text: 'Comprehensive annual studies capturing sustainability trends and consumer behaviors.',
    },
    {
      title: 'Custom Research',
      icon: 'ri-search-line',
      color: 'from-blue-400 via-cyan-400 to-emerald-400',
      text: 'Tailored qualitative and quantitative research for B2C and B2B insights.',
    },
    {
      title: 'Data Infusion',
      icon: 'ri-database-2-line',
      color: 'from-emerald-400 via-blue-400 to-cyan-400',
      text: 'Enrich your existing datasets with sustainability intelligence for deeper context.',
    },
    {
      title: 'Consulting',
      icon: 'ri-user-settings-line',
      color: 'from-emerald-400 via-green-400 to-blue-400',
      text: 'Expert guidance and strategic consulting to help you meet sustainability goals.',
    },
  ];

  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute inset-0 z-0">
        <FloatingOrbs />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Tag */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="uppercase text-[11px] tracking-wide bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full border border-emerald-200">
            Solutions
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-snug"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Powerful Solutions to Drive{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-500 bg-[length:200%_auto] animate-[gradientMove_6s_linear_infinite]">
            Sustainability Success
          </span>
        </motion.h2>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          Explore a range of research-driven services designed to position your brand at the forefront of sustainability.
        </p>

        {/* Banner Image */}
        <div className="mb-14 relative w-full h-[260px] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/images/solutions-banner.png" // ✅ Replace with actual optimized image
            alt="EcoFocus Solutions"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/50 via-blue-500/30 to-transparent"></div>
        </div>

        {/* Service Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="group flex flex-col justify-between h-full p-8 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl relative overflow-hidden transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mb-6`}
                >
                  <i className={`${service.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.text}</p>
              </div>

              {/* Explore Button */}
              <Link
                href={`/solutions#${service.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="relative overflow-hidden inline-block rounded-full px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:scale-105 transition-transform duration-300"
              >
                Explore
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}










