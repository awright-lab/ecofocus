'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroData } from './Hero';

export default function HeroContent({ heroData }: { heroData: HeroData }) {
  const { headline, subheadline, highlightedWord, description, backgroundImage, backgroundVideo, ctaButtons } = heroData;

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
            preload="auto"
            className="w-full h-full object-cover
                       brightness-[1.15] contrast-[1.05] saturate-[1.05]" /* brighter, punchier */
          >
            <source src={backgroundVideo.url} type="video/mp4" />
          </video>
        ) : backgroundImage?.url ? (
          <Image
            src={backgroundImage.url}
            alt=""
            fill
            priority
            className="object-cover brightness-[1.1] contrast-[1.05] saturate-[1.05]"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
      </div>

      {/* Full gradient scrim for readability (no glass box) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-br from-black/45 via-emerald-950/35 to-blue-950/45" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          {subheadline && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10
                            text-xs md:text-sm mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {subheadline}
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {headline}{' '}
            {highlightedWord && (
              <span
              className="bg-clip-text text-transparent animate-gradient 
                         bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500"
            >
              {highlightedWord}
            </span>            
            )}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg text-gray-100/90 mb-8 md:mb-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              {description}
            </p>
          )}

          {/* CTAs */}
{ctaButtons?.length ? (
  <div className="flex flex-wrap gap-4">
    {ctaButtons.map((b, i) => {
      const isPrimary = i === 0;
      return (
        <Link
          key={b.id}
          href={b.url}
          className={`relative inline-block px-5 py-2 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300
            ${isPrimary
              ? 'text-white bg-emerald-600 before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]'
              : 'text-neutral-900 bg-[#FFC107] before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]'
            }
            before:absolute before:inset-0 before:rounded-full
            before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0`}
        >
          <span className="relative z-10">{b.label}</span>
        </Link>
      );
    })}
  </div>
) : null}


        </motion.div>
      </div>
    </section>
  );
}




