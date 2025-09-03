'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  videoMp4?: string;
  videoWebm?: string;
  poster?: string;
};

export default function PaidHero({
  videoMp4 = 'https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-8.mp4',
  videoWebm = '/videos/about-hero.webm',
  poster = '/images/about/hero-poster.jpg',
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="about-hero"
      className="
        relative isolate overflow-hidden text-white
        min-h-[60svh] md:min-h-[70vh] lg:min-h-[80vh]
        flex items-center
      "
    >
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
            // If your subject crowds the left, push it right:
            className="h-full w-full object-cover object-[30%_50%] brightness-[1.1] contrast-[1.05] saturate-[1.05]"
          >
            {videoWebm ? <source src={videoWebm} type="video/webm" /> : null}
            <source src={videoMp4} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={poster}
            alt=""
            fill
            priority
            className="object-cover object-[30%_50%] brightness-[1.08] contrast-[1.05] saturate-[1.05]"
          />
        )}
      </div>

      {/* Diagonal color wash (lighter on mobile; clipped, stronger on md+) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className={[
            // mobile: softer wash, no clip
            'h-full w-full bg-gradient-to-br from-emerald-900/50 to-blue-900/50',
            // md+: apply diagonal wedge and deepen opacity
            'md:from-emerald-900/90 md:to-blue-900/90',
            // Tailwind arbitrary property for clip-path (JIT required)
            'md:[clip-path:polygon(0%_0%,_40%_0%,_70%_100%,_0%_100%)]',
          ].join(' ')}
        />
      </div>

      {/* Soft scrim */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-br from-black/45 via-emerald-950/35 to-blue-950/45" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 py-14 sm:py-16 md:py-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[52rem]" /* wider column so lines don’t break every word */
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Our Story
          </div>

          <h1
            id="about-hero"
            className="
              mb-3 font-bold leading-[1.05]
              text-[clamp(2rem,6vw,3.5rem)]
              [text-wrap:balance] /* balances headline lines for nicer wraps */
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]
            "
          >
            
            Decision-Ready {' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            Reports
            </span>
            .
          </h1>

          <p className="max-w-[40rem] text-gray-100/90">
          Focused analyses and flagship deliverables designed to move decisions forward.
          </p>
        </motion.div>
      </div>
    </section>
  );
}


