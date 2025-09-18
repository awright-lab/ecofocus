"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type HeroVariant = "home" | "report" | "solutions";

type CTA = { label: string; href: string };

interface HeroProps {
  variant?: HeroVariant;
  badge?: string;
  headline: ReactNode;
  subhead?: ReactNode;
  ctaPrimary?: CTA;
  ctaSecondary?: CTA;
  rightVisual?: ReactNode;
  videoSrc?: string;         // background motion
  posterSrc?: string;        // LCP + reduced-motion fallback
  overlay?: "none" | "light" | "dense";
}

export default function Hero({
  variant = "home",
  badge,
  headline,
  subhead,
  ctaPrimary,
  ctaSecondary,
  rightVisual,
  videoSrc,
  posterSrc,
  overlay = "light",
}: HeroProps) {
  return (
    <section
      className={clsx(
        "relative flex items-center justify-center overflow-hidden bg-neutral-950 text-white z-0",
        variant === "home" ? "py-24 sm:py-32" : "py-16 sm:py-24",
      )}
    >
      {/* Background video / image */}
      <div className="absolute inset-0 z-0">
        {videoSrc ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover brightness-[0.40] motion-reduce:hidden"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            {/* Reduced motion & first-paint poster */}
            {posterSrc && (
              <Image
                src={posterSrc}
                alt=""
                fill
                priority={variant === "home"}
                className="object-cover brightness-[0.40] hidden motion-reduce:block"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-blue-900" />
        )}
      </div>

      {/* Overlay tint */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className={clsx(
            "w-full h-full",
            overlay === "none" && "bg-transparent",
            overlay === "light" && "bg-gradient-to-br from-emerald-900/40 to-blue-900/40",
            overlay === "dense" && "bg-gradient-to-br from-emerald-900/70 to-blue-900/70",
          )}
        />
      </div>

      {/* Content grid */}
      <div className="relative z-20 w-full max-w-7xl px-6 grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          className={clsx(variant === "home" ? "md:col-span-7" : "md:col-span-7")}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              {badge}
            </div>
          )}

          <h1
            className={clsx(
              "font-bold leading-tight text-white",
              variant === "home" ? "text-4xl md:text-6xl" : "text-4xl md:text-5xl",
            )}
          >
            {headline}
          </h1>

          {subhead && (
            <p className="text-lg text-gray-200/90 mt-5 max-w-2xl">
              {subhead}
            </p>
          )}

          {(ctaPrimary || ctaSecondary) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.href}
                  className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">{ctaPrimary.label}</span>
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full border border-white/30 hover:bg-white/10 transition-all"
                >
                  <span className="relative z-10">{ctaSecondary.label}</span>
                </Link>
              )}
            </div>
          )}
        </motion.div>

        {/* Right visual slot */}
        <motion.div
          className="hidden md:block md:col-span-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {rightVisual}
        </motion.div>
      </div>
    </section>
  );
}
