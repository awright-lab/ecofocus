'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Logo = { src: string; alt: string };

const LOGOS_ROW_1: Logo[] = [
  { src: '/images/logos/Avery Logo_Light Backgrounds.png', alt: 'Client 1' },
  { src: '/images/logos/CGLR-Icon.png', alt: 'Client 2' },
  { src: '/images/logos/clean_label.png', alt: 'Client 3' },

];

const LOGOS_ROW_2: Logo[] = [
  { src: '/images/logos/duraflame-logo.png', alt: 'Client 4' },
  { src: '/images/logos/Site_GPI Logo 2_0.png', alt: 'Client 5' },
  { src: '/images/logos/thinkPARALLAX_Logos_RBW-01-bug.png', alt: 'Client 6' },
  // add more as needed
];

// Reusable marquee row
function LogosMarquee({
  logos,
  duration = 20,
  reverse = false,
}: {
  logos: Logo[];
  duration?: number;
  reverse?: boolean;
}) {
  // Duplicate the list so the loop has no gap
  const repeated = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        aria-hidden
        className="flex gap-10 items-center py-4"
        initial={{ x: 0 }}
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {repeated.map((logo, i) => (
          <div
            key={i}
            className="relative h-10 w-32 md:h-12 md:w-40 grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition"
            role="img"
            aria-label={logo.alt}
            title={logo.alt}
          >
            <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
          </div>
        ))}
      </motion.div>
      {/* Gradient fade edges for polish (optional) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent" />
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Who We Work With</h2>
          <p className="text-gray-600 mt-3">
            Trusted by brands, agencies, and organizations leading the way in sustainability.
          </p>
        </div>

        {/* Logo carousels */}
        <div className="space-y-6">
          <LogosMarquee logos={LOGOS_ROW_1} duration={24} reverse={false} />
          <LogosMarquee logos={LOGOS_ROW_2} duration={28} reverse={true} />
        </div>

        {/* Testimonials (blocked out for now) */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm text-gray-500">
            Testimonials coming soon.
          </div>
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm text-gray-500">
            Testimonials coming soon.
          </div>
        </div>

        {/* If you want to hide testimonials completely, just remove the block above. */}
      </div>
    </section>
  );
}
