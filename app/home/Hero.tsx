'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// ---- Hard-coded content ----
const SUBHEAD = 'EcoFocus';
const H1_LEFT = 'Market Research';
const H1_HIGHLIGHT = 'Insights into';
const H1_BOTTOM = 'Sustainability';
const DESCRIPTION =
  'Your Best Resource for Sustainability Research with Actionable Insights';

const CTAS = [
  { id: 'dash', label: 'Explore Dashboard Demo', url: '/dashboard-demo' },
  { id: 'help', label: 'How We Can Help', url: '/solutions' },
];

// ---- Media (set one or both; leave video empty to use image) ----
const backgroundVideoUrl = ''; // e.g. '/media/hero-forest.mp4'
const backgroundImageUrl = '/images/hero-forest.jpg'; // put file in /public/images

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
      {/* Background layer */}
      <div className="absolute inset-0 -z-10">
        {backgroundVideoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={backgroundVideoUrl} />
          </video>
        ) : backgroundImageUrl ? (
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
            className="absolute inset-0 object-cover"
          />
        ) : null}

        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          className={[
            'absolute inset-0',
            'bg-gradient-to-br from-emerald-900/50 to-blue-900/50',
            'md:from-emerald-900/90 md:to-blue-900/90',
            'md:[clip-path:polygon(0%_0%,_40%_0%,_70%_100%,_0%_100%)]',
            'z-10',
          ].join(' ')}
        />
      </div>

      {/* Foreground content */}
      <div className="
        mx-auto max-w-7xl px-4 sm:px-6
        min-h-[60svh] md:min-h-[65vh] lg:min-h-[70vh] xl:min-h-[65vh]
        flex items-center
        py-8 sm:py-10 md:py-14
      ">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {/* Pill */}
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="opacity-90">{SUBHEAD}</span>
          </div>

          {/* Headline */}
          <h1 className="font-bold text-[clamp(1.75rem,6vw,3rem)] leading-snug">
            {H1_LEFT}
            <br />
            {H1_HIGHLIGHT}{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              {H1_BOTTOM}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base text-white/90">
            {DESCRIPTION}
          </p>

          {/* CTAs */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {CTAS.map((btn) => (
              <Link
                key={btn.id}
                href={btn.url}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}









































