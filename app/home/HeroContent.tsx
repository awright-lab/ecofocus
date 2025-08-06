'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import FloatingOrbs from '@/components/FloatingOrbs';
import { HeroData } from './Hero';

interface HeroContentProps {
  heroData: HeroData | null;
}

export default function HeroContent({ heroData }: HeroContentProps) {
  const bgVideo = heroData?.backgroundVideo?.url || null;
  const bgImage = heroData?.backgroundImage?.url || null;

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {bgVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-label="Background video"
            className="w-full h-full object-cover object-center brightness-110"
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        ) : bgImage ? (
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center brightness-110"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center brightness-110"
          >
            <source src="/videos/hero-4.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-400/15 to-emerald-500/20"></div>
      </div>

      {/* Floating Elements */}
      <FloatingOrbs />

      {/* Accent Top Bar */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-25"></div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {heroData ? (
              <>
                {heroData.headline && (
                  <span className="block">{heroData.headline}</span>
                )}
                {heroData.subheadline && (
                  <span className="block">
                    {heroData.subheadline}{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-[length:200%_auto] animate-[gradientMove_6s_linear_infinite]">
                      {heroData.highlightedWord || 'Action.'}
                    </span>
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="opacity-50">Loading headline...</span>
              </>
            )}
          </h1>

          {heroData?.description && (
            <p className="text-lg text-gray-200 mb-8">{heroData.description}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {heroData?.ctaButtons?.length ? (
              heroData.ctaButtons.map((btn) => (
                <Link
                  key={btn.id}
                  href={btn.url}
                  className="relative overflow-hidden rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:scale-105 transition-transform duration-300"
                >
                  {btn.label}
                </Link>
              ))
            ) : (
              <span className="text-gray-400">Loading actions...</span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}



