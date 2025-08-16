"use client";
import Image from "next/image";
import Link from "next/link";

type FeaturedReportProps = {
  title: string;
  subtitle?: string;
  price?: number;            // optional, hide if not provided
  imageSrc: string;
  ctaPrimary?: {
    label: string;
    onClick?: () => void;
    href?: string;           // use href OR onClick
    variant?: "primary" | "outline";
  };
  ctaSecondary?: {
    label: string;
    href: string;
    variant?: "primary" | "outline";
  };
  badge?: string;            // e.g., "NEW • 2025"
  note?: string;             // e.g., "Includes read-only dashboard access"
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
      <div className="mb-6 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold">Featured Report</h2>
        <p className="mt-2 text-gray-700">
          Our flagship release with slide-ready charts and takeaways your team can use immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <article className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="relative aspect-[4/3]">
            {badge && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
                {badge}
              </span>
            )}
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold">{title}</h3>
            {subtitle && <p className="mt-1 text-gray-700">{subtitle}</p>}
            {typeof price === "number" && (
              <div className="mt-3 text-2xl font-bold text-emerald-700">${price.toLocaleString()}</div>
            )}
            {note && <p className="mt-1 text-xs text-gray-600">{note}</p>}

            <div className="mt-4 flex flex-wrap gap-3">
              {ctaPrimary && (ctaPrimary.href ? (
                <Link
                  href={ctaPrimary.href}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold shadow-sm ${
                    ctaPrimary.variant === "outline"
                      ? "border text-gray-900 hover:bg-gray-50"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {ctaPrimary.label}
                </Link>
              ) : (
                <button
                  onClick={ctaPrimary.onClick}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold shadow-sm ${
                    ctaPrimary.variant === "outline"
                      ? "border text-gray-900 hover:bg-gray-50"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {ctaPrimary.label}
                </button>
              ))}

              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold ${
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

        {/* Right column: bullets / promo content */}
        <div className="rounded-2xl border bg-gray-50 p-6">
          <h4 className="font-semibold">What’s inside</h4>
          <ul className="mt-3 grid gap-2 text-sm text-gray-800">
            <li>• 200+ charts across demographics & cohorts</li>
            <li>• Packaging & recyclability perceptions</li>
            <li>• Corporate commitments & reputational risk</li>
            <li>• Purchase barriers, price sensitivity & tradeoffs</li>
          </ul>
          <Link
            href="#reports"
            className="mt-5 inline-block rounded-full border px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white"
          >
            Browse smaller subsections →
          </Link>
        </div>
      </div>
    </section>
  );
}

