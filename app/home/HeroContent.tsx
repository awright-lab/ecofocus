// app/components/Hero/HeroContent.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroData } from './Hero'; // adjust if your path differs

export default function HeroContent({ heroData }: { heroData: HeroData }) {
  const reduceMotion = useReducedMotion();

  const {
    headline,
    subheadline,
    highlightedWord,
    description,
    backgroundImage,
    backgroundVideo,
    ctaButtons = [],
  } = heroData;

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
      {/* Background layer (behind content) */}
      <div className="absolute inset-0 -z-10">
        {/* Media sits at z-0 inside this -z-10 container */}
        {backgroundVideo?.url ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={backgroundVideo.url} />
          </video>
        ) : backgroundImage?.url ? (
          <Image
            src={backgroundImage.url}
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
            className="absolute inset-0 object-cover"
          />
        ) : null}

        {/* Gradient overlay ABOVE media but BELOW content */}
        <div
          aria-hidden="true"
          className={[
            'absolute inset-0', // ensure it covers
            // mobile: softer wash, no clip
            'bg-gradient-to-br from-emerald-900/50 to-blue-900/50',
            // md+: deepen and add wedge
            'md:from-emerald-900/90 md:to-blue-900/90',
            'md:[clip-path:polygon(0%_0%,_40%_0%,_70%_100%,_0%_100%)]',
            'z-10', // <-- key: OVER the video/image within this container
          ].join(' ')}
        />
      </div>

      {/* Foreground content (desktop height restored) */}
      <div className="
        mx-auto max-w-7xl px-4 sm:px-6
        min-h-[60svh] md:min-h-[70vh] lg:min-h-[80vh]   /* restore desktop height */
        flex items-center
        py-8 sm:py-10                                  /* mobile tightened only */
        md:py-16                                       /* desktop padding unchanged vs before */
      ">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {subheadline ? (
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="opacity-90">{subheadline}</span>
            </div>
          ) : null}

          <h1 className="font-bold leading-tight text-[clamp(1.75rem,6vw,3rem)]">
            {headline}{' '}
            {highlightedWord ? (
              <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                {highlightedWord}
              </span>
            ) : null}
          </h1>

          {description ? (
            <p className="mt-3 text-sm sm:text-base text-white/90 line-clamp-4 sm:line-clamp-none">
              {description}
            </p>
          ) : null}

          {ctaButtons.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {ctaButtons.map((btn) => (
                <Link
                  key={btn.id}
                  href={btn.url}
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}





