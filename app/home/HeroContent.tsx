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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
      {/* Background Media */}
      <div className="absolute inset-0 -z-10">
        {bgVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-[0.4]"
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        ) : bgImage ? (
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover brightness-[0.4]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/30 via-[#2C7FB8]/20 to-black/50" />
      </div>

      <FloatingOrbs />

      <div className="relative z-10 w-full max-w-7xl px-6 py-28 grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {heroData?.headline && (
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
              {heroData.headline}
            </h1>
          )}
          {heroData?.subheadline && (
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-6">
              {heroData.subheadline}{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8]">
                {heroData.highlightedWord || 'Action.'}
              </span>
            </h2>
          )}
          {heroData?.description && (
            <p className="text-lg text-gray-300 mb-10 max-w-2xl">
              {heroData.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {heroData?.ctaButtons?.map((btn) => (
              <Link
                key={btn.id}
                href={btn.url}
                className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#4CAF50] overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#4CAF50,_#2C7FB8)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
              >
                <span className="relative z-10">{btn.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block md:col-span-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full aspect-square">
            <Image
              src="/images/hero-graphic.png"
              alt="EcoFocus Visual Insight"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}




