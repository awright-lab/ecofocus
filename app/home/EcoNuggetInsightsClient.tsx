'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Card = {
  title: string;
  excerpt?: string;
  category?: string;
  time?: string;
  image: string;
  link: string;
};

export default function EcoNuggetInsightsClient({
  featured,
  posts,
}: {
  featured: Card;
  posts: Card[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white"
      aria-labelledby="econuggets-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-16 relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] tracking-wide mb-4"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
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

        {/* Featured */}
        <Link href={featured.link} aria-label={`Read: ${featured.title}`} className="group block mb-10 sm:mb-12 md:mb-16">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-xl shadow-2xl"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 1100px, (min-width: 768px) 90vw, 92vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-900/45 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <span className="mb-2 inline-flex w-fit items-center rounded-full bg-emerald-800 px-3.5 py-1.5 text-[11px] sm:text-xs uppercase tracking-wide text-emerald-300">
                Featured{featured.category ? ` • ${featured.category}` : ''}
              </span>
              <h3 className="mb-2 text-[clamp(1.25rem,4.5vw,2rem)] font-bold">{featured.title}</h3>
              {featured.excerpt && <p className="mb-4 max-w-2xl text-[15px] sm:text-base">{featured.excerpt}</p>}
              {featured.time && <div className="text-xs text-gray-300">{featured.time}</div>}

              <span
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#FFC107] px-5 py-2.5 text-[15px] sm:text-base font-semibold text-black relative overflow-hidden min-h-[44px]
                           before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                           before:scale-0 before:transition-transform before:duration-500 group-hover:before:scale-110 before:z-0"
                aria-hidden="true"
              >
                <span className="relative z-10">Read More →</span>
              </span>
            </div>

            {!reduceMotion && (
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            )}
          </motion.article>
        </Link>

        {/* Mobile pager */}
        <MobilePager posts={posts} reduceMotion={!!reduceMotion} />

        {/* Desktop grid */}
        {!!posts.length && (
          <div className="hidden md:grid grid-cols-2 gap-6 md:gap-8">
            {posts.map((post, i) => (
              <Link key={post.link} href={post.link} aria-label={`Read: ${post.title}`} className="group block">
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
                    {post.category && (
                      <span className="mb-1 text-xs uppercase tracking-wide text-emerald-300">{post.category}</span>
                    )}
                    <h4 className="text-[clamp(1.05rem,3.6vw,1.4rem)] font-bold transition-colors duration-300 group-hover:text-emerald-400">
                      {post.title}
                    </h4>
                    {post.time && <div className="mt-1 text-xs text-gray-300">{post.time}</div>}
                  </div>

                  {!reduceMotion && (
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  )}
                </motion.article>
              </Link>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/blog"
            className="relative inline-flex items-center justify-center rounded-full bg-[#FFC107] px-5 py-2.5 text-sm sm:text-base font-semibold text-black overflow-hidden transition-all duration-300 min-h-[44px]
                       before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            aria-label="See all insights"
          >
            <span className="relative z-10">See All Insights</span>
          </Link>
        </div>
      </div>

      {/* Decorative orbs */}
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

/* -------------------- Mobile Pager -------------------- */
function MobilePager({
  posts,
  reduceMotion,
}: {
  posts: Card[];
  reduceMotion: boolean;
}) {
  const [idx, setIdx] = React.useState(0);
  if (!posts.length) return null;

  const prev = () => setIdx((i) => (i === 0 ? posts.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % posts.length);

  return (
    <div className="md:hidden" role="region" aria-label="More insights">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="relative h-full">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={posts[idx].link}
              initial={reduceMotion ? false : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <Link href={posts[idx].link} aria-label={`Read: ${posts[idx].title}`} className="block">
                <div className="relative aspect-[16/10]">
                  <Image src={posts[idx].image} alt={posts[idx].title} fill sizes="92vw" className="object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="text-xs opacity-85">
                    {posts[idx].category}{posts[idx].time ? ` • ${posts[idx].time}` : ''}
                  </div>
                  <h4 className="mt-1 text-base font-semibold leading-snug">{posts[idx].title}</h4>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={prev}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow ring-1 ring-white/20 active:scale-95"
              aria-label="Previous insight"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow ring-1 ring-white/20 active:scale-95"
              aria-label="Next insight"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Select insight">
        {posts.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Go to insight ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === idx ? 'bg-emerald-400' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
