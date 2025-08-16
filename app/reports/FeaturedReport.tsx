"use client";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, BarChart2, Layers, PackageOpen, ArrowRight, ShieldCheck, Users } from "lucide-react";

type FeaturedReportProps = {
  title: string;
  subtitle?: string;
  price?: number;
  imageSrc?: string; // can be undefined; we’ll show a skeleton
  ctaPrimary?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: "primary" | "outline";
  };
  ctaSecondary?: {
    label: string;
    href: string;
    variant?: "primary" | "outline";
  };
  badge?: string; // e.g., "NEW • 2025"
  note?: string;  // e.g., "Includes read-only dashboard access"
};

export default function FeaturedReport({
  title,
  subtitle,
  price,
  imageSrc,
  ctaPrimary,
  ctaSecondary,
  badge,
  note,
}: FeaturedReportProps) {
  return (
    <section id="featured-report" className="container mx-auto px-4 py-10">
      {/* Section heading with subtle gradient strip */}
      <div className="mb-6 max-w-3xl">
        <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">Featured Report</h2>
        <p className="mt-2 text-gray-700">
          Our flagship release with slide-ready charts and takeaways your team can use immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT: Hero report card */}
        <article
          className="group relative rounded-2xl border bg-white/90 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
        >
          {/* Media */}
          <div className="relative aspect-[16/9]">
            {badge && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                {badge}
              </span>
            )}

            {/* Image or skeleton */}
            {imageSrc ? (
              <>
                <Image src={imageSrc} alt={title} fill className="object-cover" />
                {/* Soft overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="h-10 w-40 animate-pulse rounded-full bg-gray-300/70" />
              </div>
            )}

            {/* Floating price pill (if price provided) */}
            {typeof price === "number" && (
              <div className="absolute -bottom-4 left-4 z-10">
                <div className="rounded-xl bg-white shadow-md border px-4 py-2">
                  <span className="text-sm text-gray-500">Report</span>
                  <div className="text-xl font-bold text-emerald-700 leading-5">
                    ${price.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-5 pt-7"> {/* extra top space for price pill overlap */}
            <h3 className="text-lg md:text-xl font-semibold tracking-tight">
              {title}
            </h3>
            {subtitle && <p className="mt-1 text-sm text-gray-700">{subtitle}</p>}

            {/* At-a-glance metrics strip */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-gray-700">
                <BarChart2 className="h-3.5 w-3.5" />
                200+ charts
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-gray-700">
                <Users className="h-3.5 w-3.5" />
                Gen Pop + cohorts
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-gray-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                MOE ±1.55%
              </span>
            </div>

            {note && <p className="mt-2 text-xs text-gray-600">{note}</p>}

            {/* CTAs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {ctaPrimary &&
                (ctaPrimary.href ? (
                  <Link
                    href={ctaPrimary.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 ${
                      ctaPrimary.variant === "outline"
                        ? "border text-gray-900 hover:bg-gray-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {ctaPrimary.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    onClick={ctaPrimary.onClick}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 ${
                      ctaPrimary.variant === "outline"
                        ? "border text-gray-900 hover:bg-gray-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {ctaPrimary.label}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ))}

              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    ctaSecondary.variant === "primary"
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      : "border text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
        </article>

        {/* RIGHT: Dense, zero-dead-space info panel */}
        <aside className="rounded-2xl border bg-gradient-to-b from-gray-50 to-white p-5 shadow-sm">
          {/* Headline */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-base">What’s inside</h4>
            <span className="text-[11px] font-medium text-gray-500">Compact overview</span>
          </div>

          {/* Icon bullets (tight grid) */}
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-800">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
              Packaging & recyclability perceptions
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
              Corporate commitments & reputational risk
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
              Price sensitivity, barriers & tradeoffs
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
              Cohort deep-dives (Gen Z, parents, more)
            </li>
          </ul>

          {/* Mini “What you get” grid */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg border bg-white p-3">
              <Layers className="h-4 w-4 text-emerald-600" />
              <p className="mt-1 text-[11px] font-medium text-gray-900">Slide deck</p>
              <p className="text-[11px] text-gray-500">charts + notes</p>
            </div>
            <div className="rounded-lg border bg-white p-3">
              <BarChart2 className="h-4 w-4 text-emerald-600" />
              <p className="mt-1 text-[11px] font-medium text-gray-900">Crosstabs</p>
              <p className="text-[11px] text-gray-500">key splits</p>
            </div>
            <div className="rounded-lg border bg-white p-3">
              <PackageOpen className="h-4 w-4 text-emerald-600" />
              <p className="mt-1 text-[11px] font-medium text-gray-900">Readme</p>
              <p className="text-[11px] text-gray-500">quick start</p>
            </div>
          </div>

          {/* Chips strip to kill whitespace */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-gray-700">
              PDF + PPTX
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-gray-700">
              Commercial license
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-gray-700">
              Team sharing OK
            </span>
          </div>

          {/* Compact CTA row */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="#reports"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white"
            >
              Browse smaller subsections
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#license"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              See licensing
            </Link>
          </div>

          {/* Tiny reassurance bar */}
          <div className="mt-4 flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <p className="text-[12px] text-gray-700">
              Data collected from 4,000 US adults (MOE ±1.55%).
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}




