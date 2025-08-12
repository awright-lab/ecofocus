'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroData } from './Hero';

export default function HeroContent({ heroData }: { heroData: HeroData }) {
  const {
    headline,
    subheadline,
    highlightedWord,
    description,
    backgroundImage,
    backgroundVideo,
    ctaButtons,
  } = heroData;

  return (
    <section className="relative overflow-hidden text-white">
      {/* Background media */}
      <div className="absolute inset-0 -z-20">
        {backgroundVideo?.url ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            // If you have one, add a mobile-friendly poster:
            // poster="/images/hero_poster.jpg"
            className="h-full w-full object-cover brightness-[1.15] contrast-[1.05] saturate-[1.05]"
          >
            <source src={backgroundVideo.url} type="video/mp4" />
          </video>
        ) : backgroundImage?.url ? (
          <Image
            src={backgroundImage.url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[1.1] contrast-[1.05] saturate-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-neutral-900" />
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

      {/* Readability scrim */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-br from-black/35 via-emerald-950/30 to-blue-950/35" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          // Use svh to avoid mobile URL bar jumps; scale height by breakpoint
          className="flex min-h-[60svh] items-end py-16 sm:py-20 md:min-h-[70vh] lg:min-h-[80vh]"
        >
          <div className="max-w-3xl">
            {/* Eyebrow */}
            {subheadline && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs sm:text-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {subheadline}
              </div>
            )}

            {/* Headline (fluid clamp so it never overwhelms) */}
            <h1 className="mb-4 font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-[clamp(1.9rem,6vw,2.75rem)] md:text-[clamp(2.5rem,4.5vw,3.75rem)]">
              {headline}{' '}
              {highlightedWord && (
                <span className="bg-clip-text text-transparent animate-gradient bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500">
                  {highlightedWord}
                </span>
              )}
            </h1>

            {/* Description */}
            {description && (
              <p className="mb-8 text-base text-gray-100/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] sm:text-lg md:mb-10">
                {description}
              </p>
            )}

            {/* CTAs (ensure ≥44px targets) */}
            {ctaButtons?.length ? (
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {ctaButtons.map((b, i) => {
                  const isPrimary = i === 0;
                  return (
                    <Link
                      key={b.id}
                      href={b.url}
                      className={[
                        'relative inline-flex items-center justify-center rounded-full text-sm font-semibold',
                        'px-5 py-2.5 sm:text-base', // ~44px+ height
                        'overflow-hidden transition-all duration-300',
                        isPrimary
                          ? 'text-white bg-emerald-600 before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]'
                          : 'text-neutral-900 bg-[#FFC107] before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]',
                        'before:absolute before:inset-0 before:rounded-full before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0',
                      ].join(' ')}
                    >
                      <span className="relative z-10">{b.label}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}





