"use client";
import Image from "next/image";
import Link from "next/link";

type FeaturedReportProps = {
  title: string;
  subtitle?: string;
  price?: number;
  imageSrc: string;
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
  badge?: string;
  note?: string;
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
    <section id="featured-report" className="container mx-auto px-4 py-8">
      <div className="mb-4 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold">Featured Report</h2>
        <p className="mt-1 text-gray-700">
          Our flagship release with slide-ready charts and takeaways your team can use immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Left card: Report */}
        <article className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="relative aspect-[16/9]">
            {badge && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
                {badge}
              </span>
            )}
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && <p className="mt-0.5 text-gray-700 text-sm">{subtitle}</p>}
            {typeof price === "number" && (
              <div className="mt-2 text-xl font-bold text-emerald-700">${price.toLocaleString()}</div>
            )}
            {note && <p className="mt-0.5 text-xs text-gray-600">{note}</p>}

            <div className="mt-3 flex flex-wrap gap-2">
              {ctaPrimary && (ctaPrimary.href ? (
                <Link
                  href={ctaPrimary.href}
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
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
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
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
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${
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

        {/* Right column: Promo content */}
        <div className="rounded-xl border bg-gray-50 p-4">
          <h4 className="font-semibold text-base">What’s inside</h4>
          <ul className="mt-2 grid gap-1 text-sm text-gray-800">
            <li>• 200+ charts across demographics & cohorts</li>
            <li>• Packaging & recyclability perceptions</li>
            <li>• Corporate commitments & reputational risk</li>
            <li>• Purchase barriers, price sensitivity & tradeoffs</li>
          </ul>
          <Link
            href="#reports"
            className="mt-4 inline-block rounded-full border px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-white"
          >
            Browse smaller subsections →
          </Link>
        </div>
      </div>
    </section>
  );
}



