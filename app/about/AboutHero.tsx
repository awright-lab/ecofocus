'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  title?: string;
  eyebrow?: string;
  blurb?: string;
  /** Public paths (e.g. in /public/videos and /public/images) */
  videoMp4?: string;
  videoWebm?: string;
  poster?: string;
};

export default function AboutHero({
  title = 'Turning sustainability data into ',
  eyebrow = 'Our Story',
  blurb = 'Since 2010, EcoFocus has helped organizations see the signal in the noise—connecting attitudes, behaviors, and outcomes so teams can move from insight to impact.',
  videoMp4 = 'https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-7.mp4',     // <- add your file
  videoWebm = '/videos/about-hero.webm',   // <- optional, for better compression
  poster = '/images/about/hero-poster.jpg' // <- fallback poster
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden text-white" aria-labelledby="about-hero">
      {/* Background media */}
      <div className="absolute inset-0 -z-20">
        {!reduceMotion ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={poster}
            className="h-full w-full object-cover brightness-[1.1] contrast-[1.05] saturate-[1.05]"
          >
            {videoWebm ? <source src={videoWebm} type="video/webm" /> : null}
            <source src={videoMp4} type="video/mp4" />
            {/* If the browser can’t play the sources, it’ll show the poster. */}
          </video>
        ) : (
          <Image
            src={poster}
            alt=""
            fill
            priority
            className="object-cover brightness-[1.08] contrast-[1.05] saturate-[1.05]"
          />
        )}
      </div>

      {/* Diagonal polygon overlay (same look as home) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="h-full w-full bg-gradient-to-br from-emerald-900/95 to-blue-900/95"
          style={{ clipPath: 'polygon(0% 0%, 40% 0%, 70% 100%, 0% 100%)' }}
        />
      </div>

      {/* Soft scrim for readability */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-br from-black/45 via-emerald-950/35 to-blue-950/45" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16 md:py-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Eyebrow pill */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {eyebrow}
          </div>

          {/* Headline */}
          <h1 id="about-hero" className="mb-3 font-bold leading-tight text-[clamp(1.9rem,5.6vw,3.2rem)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {title}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              action
            </span>
            .
          </h1>

          <p className="max-w-2xl text-gray-100/90">{blurb}</p>
        </motion.div>
      </div>
    </section>
  );
}

