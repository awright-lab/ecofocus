'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StoreHero() {
  // Breadcrumb JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ecofocusresearch.netlify.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Reports & Store',
        item: 'https://ecofocusresearch.netlify.app/reports',
      },
    ],
  };

  return (
    <section className="relative min-h-[60svh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-950 text-white z-0">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover brightness-[0.9]"
          poster="/images/storefront-hero-poster.jpg"
        >
          <source
            src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-10.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Diagonal Gradient Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="w-full h-full bg-gradient-to-br from-emerald-900/80 to-blue-900/80"
          style={{ clipPath: 'polygon(0% 0%, 40% 0%, 70% 100%, 0% 100%)' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-7xl px-6 py-28 grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/50">
                /
              </li>
              <li aria-current="page" className="font-medium text-white">
                Reports &amp; Store
              </li>
            </ol>
          </nav>

          {/* Kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Storefront
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
            Sustainability Intelligence <br className="hidden md:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8] animate-gradient">
              Packaged for Action
            </span>
          </h1>

          {/* Subcopy (no services language) */}
          <p className="text-lg text-gray-300 max-w-2xl">
            Explore the full Sustainability Insights Report or choose focused subsections.
            Eligible purchases include read-only dashboard access.
          </p>
        </motion.div>

        {/* Optional Right Visual Placeholder (kept for balance/responsiveness) */}
        <motion.div
          className="hidden md:block md:col-span-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full aspect-square" />
        </motion.div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

