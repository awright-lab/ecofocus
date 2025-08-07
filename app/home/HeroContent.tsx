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
    <section className="relative max-h-[65vh] flex flex-col justify-between bg-black text-white overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {bgVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-label="Hero background video"
            className="w-full h-full object-cover brightness-[0.6]"
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        ) : bgImage ? (
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center brightness-[0.6]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/30 via-[#2C7FB8]/20 to-transparent z-0" />
      </div>

      <FloatingOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {heroData?.headline && <span className="block">{heroData.headline}</span>}
            {heroData?.subheadline && (
              <span className="block">
                {heroData.subheadline}{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-900 to-slate-900 gradientMove bg-[length:200%_200%]">
                    {heroData.highlightedWord || 'Action.'}
                </span>

              </span>
            )}
          </h1>
          {heroData?.description && (
            <p className="text-lg text-gray-200 mb-8 max-w-xl">{heroData.description}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {heroData?.ctaButtons?.map((btn) => (
              <Link
                key={btn.id}
                href={btn.url}
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-md transition-transform hover:scale-105"
              >
                <span className="relative z-10">{btn.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}



