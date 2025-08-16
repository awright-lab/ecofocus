"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart2,
  Users,
  ShieldCheck,
  ArrowRight,
  BadgeDollarSign,
} from "lucide-react";

type Card = {
  id: "buyin-2025" | "enhance-2024" | "sir-2024";
  title: string;
  subtitle: string;
  price: number;
  imageSrc: string;
  note?: string;
  badge?: string;                 // e.g., "NEW • 2025"
  primary: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "outline";
  };
  secondary?: {
    label: string;
    href: string;
    variant?: "primary" | "outline";
  };
};

export default function FeaturedReportsSection({
  onAddToCart,
}: {
  onAddToCart?: (id: Card["id"]) => void;
}) {
  const CARDS: Card[] = [
    {
      id: "buyin-2025",
      title: "2025 Syndicated Study — Buy-In",
      subtitle: "Add your proprietary questions + receive the full study.",
      price: 30000,
      imageSrc: "/images/store_2025_buyin.webp",
      note: "Dashboard included — seats scale by org size",
      badge: "NEW • 2025",
      primary: {
        label: "Learn how to participate",
        href: "/reports/buyin-2025",
        variant: "primary",
      },
      secondary: {
        label: "Details",
        href: "/reports/buyin-2025",
        variant: "outline",
      },
    },
    {
      id: "enhance-2024",
      title: "Enhance Your Data — 2024",
      subtitle: "Blend EcoFocus 2024 data with your own datasets.",
      price: 20000,
      imageSrc: "/images/store_enhance2024.webp",
      note: "Dashboard included with license",
      primary: {
        label: "Add to cart",
        onClick: () => onAddToCart?.("enhance-2024"),
        variant: "primary",
      },
      secondary: {
        label: "Details",
        href: "/reports/enhance-2024",
        variant: "outline",
      },
    },
    {
      id: "sir-2024",
      title: "Sustainability Insights Report — 2024",
      subtitle: "Flagship 2024 SIR deliverable.",
      price: 10000,
      imageSrc: "/images/store_sir2024.webp",
      note: "Dashboard read-only included",
      primary: {
        label: "Add to cart",
        onClick: () => onAddToCart?.("sir-2024"),
        variant: "primary",
      },
      secondary: {
        label: "Details",
        href: "/reports/sir-2024",
        variant: "outline",
      },
    },
  ];

  return (
    <section id="bundles" className="container mx-auto px-4 py-10">
      {/* Section header with accent strip */}
      <div className="mb-6 max-w-3xl">
        <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">Featured Bundles</h2>
        <p className="mt-2 text-gray-700">
          High-value packages for teams that need deeper access: participate in this year’s study, integrate last year’s data, or get the full 2024 report.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((p) => (
          <motion.article
            key={p.id}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl border bg-white/90 shadow-sm overflow-hidden transition-all hover:shadow-md"
          >
            {/* Gradient border on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-emerald-500/30" />

            {/* Corner ribbon for best value */}
            {p.id === "buyin-2025" && (
              <div className="absolute -right-10 top-4 z-20 rotate-45 select-none">
                <span className="bg-emerald-600 text-white text-[11px] font-semibold px-10 py-1 shadow-sm">
                  Best Value
                </span>
              </div>
            )}

            {/* Media */}
            <div className="relative aspect-[16/9]">
              {p.badge && (
                <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                  {p.badge}
                </span>
              )}
              <Image src={p.imageSrc} alt={p.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />

              {/* Floating price pill */}
              <div className="absolute -bottom-4 left-4 z-20">
                <div className="rounded-xl bg-white shadow-md border px-4 py-2">
                  <span className="text-[11px] text-gray-500">Bundle</span>
                  <div className="text-lg font-bold text-emerald-700 leading-5">
                    ${p.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 pt-7">
              <h3 className="text-base md:text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{p.subtitle}</p>

              {/* Compact density strip */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
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

              {p.note && <p className="mt-2 text-xs text-gray-600">{p.note}</p>}

              {/* CTAs */}
              <div className="mt-4 flex flex-wrap gap-2">
                {p.primary.href ? (
                  <Link
                    href={p.primary.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 ${
                      p.primary.variant === "outline"
                        ? "border text-gray-900 hover:bg-gray-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {p.primary.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    onClick={p.primary.onClick}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 ${
                      p.primary.variant === "outline"
                        ? "border text-gray-900 hover:bg-gray-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {p.primary.label}
                    {p.primary.variant !== "outline" ? (
                      <BadgeDollarSign className="h-4 w-4" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                )}

                {p.secondary && (
                  <Link
                    href={p.secondary.href}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      p.secondary.variant === "primary"
                        ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                        : "border text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {p.secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
