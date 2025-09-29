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
  size?: "short" | "normal" | "tall";   // ← height control
  badge?: string;
  headline: ReactNode;                  // ← accepts JSX or string
  subhead?: ReactNode;                  // ← allows JSX if needed
  ctaPrimary?: CTA;
  ctaSecondary?: CTA;
  rightVisual?: ReactNode;
  videoSrc?: string;
  posterSrc?: string;
  overlay?: "none" | "light" | "dense";
}

export default function Hero({
  variant = "home",
  size = "normal",
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
        "relative overflow-hidden bg-neutral-950 text-white z-0",
        size === "short" ? "py-10 sm:py-14"
        : size === "tall" ? "py-24 sm:py-32"
        : "py-16 sm:py-24"
      )}
    >
      {/* Background video / image */}
      <div className="absolute inset-0 -z-10">
        {videoSrc ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover brightness-[0.80] motion-reduce:hidden"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            {posterSrc && (
              <Image
                src={posterSrc}
                alt=""
                fill
                priority={variant === "home"}
                className="hidden object-cover brightness-[0.40] motion-reduce:block"
              />
            )}
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-900 to-blue-900" />
        )}
      </div>

      {/* Overlay tint */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className={clsx(
            "h-full w-full",
            overlay === "none" && "bg-transparent",
            overlay === "light" && "bg-gradient-to-br from-emerald-900/40 to-blue-900/40",
            overlay === "dense" && "bg-gradient-to-br from-emerald-900/70 to-blue-900/70"
          )}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className={clsx(
          "grid items-center gap-10",
          rightVisual ? "md:grid-cols-12" : "place-items-center text-center"
        )}>
          <motion.div
            className={rightVisual ? "md:col-span-7" : "max-w-3xl"}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {badge && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {badge}
              </div>
            )}

            <h1 className={clsx(
              "font-bold leading-tight text-white",
              size === "short" ? "text-3xl md:text-5xl" : "text-4xl md:text-5xl"
            )}>
              {headline}
            </h1>

            {subhead && (
              <p className={clsx(
                "mt-4 text-gray-200/90",
                size === "short" ? "text-base" : "text-lg"
              )}>
                {subhead}
              </p>
            )}

            {(ctaPrimary || ctaSecondary) && (
              <div className={clsx(
                "mt-8 flex flex-wrap gap-4",
                rightVisual ? "" : "justify-center"
              )}>
                {ctaPrimary && (
                  <Link
                    href={ctaPrimary.href}
                    className="relative inline-block rounded-full bg-emerald-600  overflow-hidden px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all
                    before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                    before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                  >
                    <span className="relative z-10">{ctaPrimary.label}</span>
                  </Link>
                )}
                {ctaSecondary && (
                  <Link
                    href={ctaSecondary.href}
                    className="inline-block rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/95 hover:bg-white/10"
                  >
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          {rightVisual && (
            <motion.div
              className="hidden md:col-span-5 md:block"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {rightVisual}
            </motion.div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 animate-gradient" />
    </section>
  );
}
