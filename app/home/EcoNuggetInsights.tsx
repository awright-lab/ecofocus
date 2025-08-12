'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function EcoNuggetInsights() {
  const reduceMotion = useReducedMotion();

  const featured = {
    title: '2025 Sustainability Outlook',
    excerpt: 'Discover key environmental trends shaping consumer behavior and business strategies in 2025.',
    category: 'Trends',
    time: '4 min read',
    image: '/images/blogs/789b87_124054fd6ae6426a8a3704ac7202498d~mv2.png',
    link: '/blog/2025-sustainability-outlook',
  };

  const posts = [
    {
      title: 'The Future of Packaging',
      category: 'Research',
      time: '3 min read',
      image: '/images/blogs/789b87_bb45408bfd124de4b8ee212b555dcb10~mv2.png',
      link: '/blog/future-of-packaging',
    },
    {
      title: 'Consumer Trust in ESG',
      category: 'Strategy',
      time: '5 min read',
      image: '/images/blogs/789b87_ccb5f325dfb94da3877531229248edc3~mv2.png',
      link: '/blog/consumer-trust-esg',
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white"
      aria-labelledby="econuggets-heading"
    >
      {/* spacing */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm mb-4"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-emerald-300">EcoNuggets</span>
        </motion.div>

        <h2
          id="econuggets-heading"
          className="mb-8 sm:mb-10 md:mb-12 font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.4rem)] md:text-[clamp(2rem,3.6vw,2.75rem)]"
        >
          Fresh Insights with{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            EcoNuggets
          </span>
        </h2>

        {/* Featured Card (entire card clickable; no nested Links) */}
        <Link href={featured.link} aria-label={`Read: ${featured.title}`} className="group block mb-12 md:mb-16">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-xl shadow-2xl"
          >
            <div className="relative aspect-[16/9] sm:aspect-[21/9]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority={false}
                sizes="(min-width: 1024px) 1100px, (min-width: 768px) 90vw, 92vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Readability overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/40 to-transparent" />
            </div>

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <span className="mb-2 inline-flex w-fit items-center rounded-full bg-emerald-800 px-3 py-1 text-xs uppercase tracking-wide text-emerald-300">
                Featured • {featured.category}
              </span>
              <h3 className="mb-2 text-[clamp(1.25rem,4.5vw,2rem)] font-bold">{featured.title}</h3>
              <p className="mb-4 max-w-2xl text-sm text-gray-200 sm:text-base">{featured.excerpt}</p>
              <div className="text-xs text-gray-300">{featured.time}</div>

              {/* Button look (but no nested anchor) */}
              <span
                className="mt-4 inline-block w-fit rounded-full bg-[#FFC107] px-5 py-2 text-sm font-semibold text-black relative overflow-hidden
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                           before:scale-0 before:transition-transform before:duration-500 group-hover:before:scale-110 before:z-0"
                aria-hidden="true"
              >
                <span className="relative z-10">Read More →</span>
              </span>
            </div>

            {/* Hover shimmer (disabled if reduced motion) */}
            {!reduceMotion && (
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            )}
          </motion.article>
        </Link>

        {/* Secondary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {posts.map((post, i) => (
            <Link key={post.title} href={post.link} aria-label={`Read: ${post.title}`} className="group block">
              <motion.article
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative overflow-hidden rounded-xl shadow-xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 92vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="mb-1 text-xs uppercase tracking-wide text-emerald-300">{post.category}</span>
                  <h4 className="text-[clamp(1.05rem,3.6vw,1.4rem)] font-bold transition-colors duration-300 group-hover:text-emerald-400">
                    {post.title}
                  </h4>
                  <div className="mt-1 text-xs text-gray-300">{post.time}</div>
                </div>

                {!reduceMotion && (
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}
              </motion.article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="relative inline-flex items-center justify-center rounded-full bg-[#FFC107] px-5 py-2.5 text-sm font-semibold text-black overflow-hidden transition-all duration-300
                       before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            aria-label="See all insights"
          >
            <span className="relative z-10">See All Insights</span>
          </Link>
        </div>
      </div>

      {/* Floating gradient orbs (toned for mobile; disabled motion if user prefers) */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl"
        style={reduceMotion ? undefined : { animation: 'pulse 2.5s ease-in-out infinite' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl"
        style={reduceMotion ? undefined : { animation: 'pulse 3s ease-in-out infinite' }}
        aria-hidden="true"
      />
    </section>
  );
}









