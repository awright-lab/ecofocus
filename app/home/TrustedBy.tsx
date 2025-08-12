'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function TrustedBy() {
  const reduceMotion = useReducedMotion();

  const logos = [
    { src: '/images/logos/Avery Logo_Light Backgrounds.png', alt: 'Avery' },
    { src: '/images/logos/CGLR-Icon.png', alt: 'Council of the Great Lakes Region' },
    { src: '/images/logos/clean_label.png', alt: 'Clean Label Project' },
    { src: '/images/logos/duraflame-logo.png', alt: 'Duraflame' },
    { src: '/images/logos/Site_GPI Logo 2_0.png', alt: 'Glass Packaging Institute' },
    { src: '/images/logos/thinkPARALLAX_Logos_RBW-01-bug.png', alt: 'thinkPARALLAX' },
  ];

  return (
    <section
      aria-labelledby="trusted-by-heading"
      className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        {/* Tag */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-4 py-1.5 text-xs sm:text-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-gray-700">Partners</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          id="trusted-by-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.4rem)] md:mb-12"
        >
          Trusted by{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Leading Organizations
          </span>
        </motion.h2>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-6">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.alt}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              {/* Aspect box ensures no layout shift; Image uses fill+sizes */}
              <div className="relative aspect-[5/2] w-full">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="(min-width: 1024px) 14vw, (min-width: 640px) 28vw, 44vw"
                  className="object-contain p-2 grayscale transition duration-500 group-hover:grayscale-0"
                  priority={false}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/partners"
            className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                       before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            aria-label="Become a Partner"
          >
            <span className="relative z-10">Become a Partner →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}





