"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Card = {
  id: "buyin-2025" | "enhance-2024" | "sir-2024";
  title: string;
  subtitle: string;
  price: number;
  imageSrc: string;
  note?: string;
  badge?: string;                 // e.g., "NEW • 2025"
  primary: {                      // primary CTA per card
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
      {/* Section header */}
      <div className="mb-6 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold">Featured Bundles</h2>
        <p className="mt-2 text-gray-700">
          High-value packages for teams that need deeper access: participate in this year’s study, integrate last year’s data, or get the full 2024 report.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((p) => (
          <motion.article
            key={p.id}
            whileHover={{ y: -4 }}
            className="rounded-2xl border bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3]">
              {p.badge && (
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                  {p.badge}
                </span>
              )}
              <Image src={p.imageSrc} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-700">{p.subtitle}</p>
              <div className="mt-2 text-2xl font-bold">${p.price.toLocaleString()}</div>
              {p.note && <p className="mt-1 text-xs text-gray-600">{p.note}</p>}

              <div className="mt-4 flex flex-wrap gap-3">
                {p.primary.href ? (
                  <Link
                    href={p.primary.href}
                    className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold shadow-sm ${
                      p.primary.variant === "outline"
                        ? "border text-gray-900 hover:bg-gray-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {p.primary.label}
                  </Link>
                ) : (
                  <button
                    onClick={p.primary.onClick}
                    className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold shadow-sm ${
                      p.primary.variant === "outline"
                        ? "border text-gray-900 hover:bg-gray-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {p.primary.label}
                  </button>
                )}

                {p.secondary && (
                  <Link
                    href={p.secondary.href}
                    className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold ${
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
