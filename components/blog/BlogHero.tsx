'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { cx } from '@/lib/utils'

type CTA = {
  href: string
  label: string
  variant?: 'primary' | 'secondary'
}

type Props = {
  label?: string
  title?: React.ReactNode
  sub?: string
  ctas?: CTA[]

  // Background media (optional; mirrors AboutHero API)
  videoMp4?: string
  videoWebm?: string
  poster?: string

  // Layout tweaks
  align?: 'left' | 'center'
  className?: string
}

export default function BlogHero({
  label = 'EcoNuggets',
  title = (
    <>
      Fresh sustainability insights that move <span className="text-emerald-200">decisions</span>
    </>
  ),
  sub = 'Bite-size reads from our syndicated research and workflows—built to convert learnings into action.',
  ctas = [
    { href: '/reports', label: 'Explore Reports', variant: 'secondary' },
    { href: '/contact?type=demo', label: 'View Dashboard Demo', variant: 'primary' },
  ],

  videoMp4 = 'https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-8.mp4',
  videoWebm = '',
  poster = '/images/hero-cover.png',

  align = 'left',
  className = '',
}: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="blog-hero"
      className={cx(
        'relative isolate overflow-hidden text-white',
        'min-h-[60svh] md:min-h-[70vh] lg:min-h-[80vh]',
        'flex items-center',
        className
      )}
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
            'h-full w-full bg-gradient-to-br from-emerald-900/50 to-blue-900/50',
            'md:from-emerald-900/90 md:to-blue-900/90',
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
          className={cx('max-w-[52rem]', align === 'center' && 'mx-auto text-center')}
        >
          <div className={cx(
            'mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm',
            align === 'center' && 'justify-center'
          )}>
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {label}
          </div>

          <h1
            id="blog-hero"
            className={cx(
              'mb-3 font-bold leading-[1.05]',
              'text-[clamp(2rem,6vw,3.5rem)]',
              '[text-wrap:balance]',
              'drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
            )}
          >
            {title}
          </h1>

          {sub && (
            <p className={cx('max-w-[40rem] text-gray-100/90', align === 'center' && 'mx-auto')}>
              {sub}
            </p>
          )}

          {!!ctas.length && (
            <div className={cx('mt-6 flex flex-wrap gap-3', align === 'center' && 'justify-center')}>
              {ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={cx(
                    'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition',
                    cta.variant === 'primary'
                      ? 'bg-white text-emerald-800 hover:bg-emerald-50'
                      : 'bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20'
                  )}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
