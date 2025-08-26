// components/solutions/custom/CustomHero.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

export default function CustomHero() {
  const reduceMotion = useReducedMotion()
  const poster = '/images/about/hero-poster.jpg'
  const videoMp4 = 'https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-8.mp4'

  return (
    <section
      aria-labelledby="custom-hero"
      className="relative isolate overflow-hidden text-white min-h-[54svh] md:min-h-[62vh] lg:min-h-[68vh] flex items-center"
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
            className="h-full w-full object-cover object-[30%_50%] brightness-[1.1] contrast-[1.05] saturate-[1.05]"
          >
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

      {/* Diagonal color wash */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="h-full w-full bg-gradient-to-br from-emerald-900/50 to-blue-900/50 md:from-emerald-900/90 md:to-blue-900/90 md:[clip-path:polygon(0%_0%,_40%_0%,_70%_100%,_0%_100%)]" />
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
          className="max-w-[52rem]"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Custom Research
          </div>

          <h1
            id="custom-hero"
            className="mb-3 font-bold leading-[1.05] text-[clamp(2rem,6vw,3.5rem)] [text-wrap:balance] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            Decision-ready consumer sustainability intelligence — tailored to you
          </h1>

          <p className="max-w-[42rem] text-gray-100/90">
            Bespoke studies for the exact decisions in front of your team — from claims &amp; pack tests to segmentation
            refreshes — delivered as stakeholder-ready outputs.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#benefits"
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20"
            >
              Explore Benefits
            </Link>
            <Link
              href="/contact?type=custom"
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Request a Proposal
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


