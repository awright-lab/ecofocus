"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

// -----------------------------
// Types & seed (replace later)
// -----------------------------
type Report = {
  slug: string;
  title: string;
  subtitle?: string;
  cover: string;                 // full cover image
  preview: string[];             // page previews/screens from the PDF
  date: string;                  // "2025-06-15"
  year: string;                  // "2025"
  topic: string;                 // e.g., "Gen Z"
  type: "Full Report" | "Brief/One-Pager" | "Infographic";
  wave?: string;                 // e.g., "2025 H1"
  pages?: number;
  format?: string;               // "PDF"
  length?: string;               // "54 pages"
  sampleHref?: string;           // sample PDF
  purchaseHref?: string;         // to your checkout if applicable
  abstract: string;
  bullets?: string[];            // “Inside the report”
};

const SEED: Record<string, Report> = {
  "2025-genz-brand-purpose": {
    slug: "2025-genz-brand-purpose",
    title: "Gen Z & Brand Purpose: Signals that move behavior",
    subtitle: "Key claims, values, and moments that actually shift spend in 2025 H1.",
    cover: "/images/reports/cover-genz-purpose-2025.jpg",
    preview: [
      "/images/reports/previews/2025-genz-purpose-p1.jpg",
      "/images/reports/previews/2025-genz-purpose-p2.jpg",
      "/images/reports/previews/2025-genz-purpose-p3.jpg",
      "/images/reports/previews/2025-genz-purpose-p4.jpg",
    ],
    date: "2025-06-15",
    year: "2025",
    topic: "Gen Z",
    type: "Full Report",
    wave: "2025 H1",
    pages: 54,
    format: "PDF",
    length: "54 pages",
    sampleHref: "/files/reports/2025-genz-purpose-sample.pdf",
    // purchaseHref: "/checkout/2025-genz-brand-purpose", // (wire later)
    abstract:
      "Defendable reads on what Gen Z believes, buys, and boycotts—and how sustainability language can unlock real behavior, not just survey intent.",
    bullets: [
      "Claim language: which words signal credibility vs. greenwash risk",
      "Say–do gap watchlist by sub-segment (e.g., students vs. early-career)",
      "Category cuts: food & bev, apparel/beauty, household",
      "Price & access guardrails that reduce backlash",
      "White-label charts for decks + POVs (exports included)",
    ],
  },
};

// -----------------------------
// Optional: dynamic metadata
// -----------------------------
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = SEED[params.slug];
  if (!r) return {};
  const title = `${r.title} | EcoFocus Reports`;
  const description = r.subtitle || r.abstract || "EcoFocus syndicated report.";
  const ogImg = r.cover || "/og-image.jpg";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: r.title }],
      type: "article",
    },
  };
}

// -----------------------------
// Page
// -----------------------------
export default function ReportDetailPage({ params }: { params: { slug: string } }) {
  const report = SEED[params.slug];
  if (!report) return notFound();

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <CoverHero report={report} />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Reports", href: "/reports" },
            { label: report.title },
          ]}
          maxWidth="max-w-7xl"
        />

        <AbstractAndSpecs report={report} />
        <PreviewCarousel report={report} />
        <ReportCTA report={report} />
      </main>
      <Footer />
    </>
  );
}

// -----------------------------
// Sections
// -----------------------------
function CoverHero({ report }: { report: Report }) {
  const r = useReducedMotion();
  return (
    <section className="relative overflow-hidden" aria-label="Report cover">
      {/* Full-bleed cover band: preserve integrity via object-contain */}
      <div className="relative h-[44vh] min-h-[320px] w-full bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={r ? false : { opacity: 0, y: 6 }}
            animate={r ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[3/4] w-[min(420px,68vw)] overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow-2xl"
          >
            <Image
              src={report.cover}
              alt={`${report.title} – cover`}
              fill
              className="object-contain"
              sizes="(min-width:1280px) 420px, 68vw"
              priority
            />
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-950 shadow-sm">
              {report.type}
            </span>
          </motion.div>
        </div>

        {/* Soft backdrop gradient behind the floating cover */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,_rgba(16,185,129,0.15),_transparent_70%)]" />
      </div>

      {/* Title block */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.8rem,5.6vw,2.6rem)]">
          {report.title}{" "}
          {report.wave ? (
            <span className="text-gray-400">({report.wave})</span>
          ) : null}
        </h1>
        {report.subtitle ? (
          <p className="mx-auto mt-2 max-w-3xl text-center text-sm sm:text-base text-gray-700">
            {report.subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function AbstractAndSpecs({ report }: { report: Report }) {
  const r = useReducedMotion();

  return (
    <section className="relative bg-white" aria-labelledby="about-this-report">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Abstract + actions */}
          <motion.div
            initial={r ? false : { opacity: 0, y: 10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <h2
              id="about-this-report"
              className="font-semibold text-gray-900 text-[clamp(1.1rem,3.4vw,1.4rem)]"
            >
              Abstract
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-700">{report.abstract}</p>

            {/* “Inside the report” bullets */}
            {report.bullets && report.bullets.length > 0 ? (
              <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                {report.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Actions */}
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row">
              {report.sampleHref ? (
                <a
                  href={report.sampleHref}
                  className="relative inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300
                             before:content-[''] before:absolute before:inset-0 before:rounded-full
                             before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                             before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">Download sample</span>
                </a>
              ) : null}

              <Link
                href={report.purchaseHref || "/contact"}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                {report.purchaseHref ? "Get full report" : "Request full report"}
              </Link>
            </div>
          </motion.div>

          {/* Specs */}
          <motion.aside
            initial={r ? false : { opacity: 0, y: 10 }}
            whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="md:col-span-5"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="text-base font-semibold text-gray-900">At a glance</h3>
              <dl className="mt-3 divide-y divide-gray-100 text-sm">
                {report.wave ? <SpecRow k="Wave" v={report.wave} /> : null}
                <SpecRow k="Topic" v={report.topic} />
                <SpecRow k="Type" v={report.type} />
                {report.pages ? <SpecRow k="Length" v={`${report.pages} pages`} /> : null}
                {report.length ? <SpecRow k="Length" v={report.length} /> : null}
                {report.format ? <SpecRow k="Format" v={report.format} /> : null}
                <SpecRow k="Year" v={report.year} />
                <SpecRow k="Published" v={new Date(report.date).toLocaleDateString()} />
                <SpecRow k="Exports" v="White-label PNG + CSV (where applicable)" />
                <SpecRow k="License" v="Agency use; org options available" />
              </dl>
              <p className="mt-3 text-xs text-gray-500">
                White-label exports contain no EcoFocus brand colors. Significance and small-base flags are preserved.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      <dt className="col-span-1 text-gray-500">{k}</dt>
      <dd className="col-span-2 font-medium text-gray-900">{v}</dd>
    </div>
  );
}

function PreviewCarousel({ report }: { report: Report }) {
  const r = useReducedMotion();

  if (!report.preview || report.preview.length === 0) return null;

  return (
    <section className="relative bg-brand-tint-blue" aria-labelledby="preview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-14">
        <motion.h2
          id="preview"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-gray-900 text-[clamp(1.6rem,5.2vw,2.0rem)]"
        >
          Preview pages
        </motion.h2>

        {/* Horizontal scroll with snapping; preserve page integrity via object-contain */}
        <div className="mt-6 overflow-x-auto">
          <ul className="flex snap-x snap-mandatory gap-4 pb-2">
            {report.preview.map((src, i) => (
              <li key={src} className="snap-start">
                <div className="relative h-[300px] w-[210px] overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 shadow-md sm:h-[360px] sm:w-[252px]">
                  <Image
                    src={src}
                    alt={`Preview page ${i + 1} for ${report.title}`}
                    fill
                    className="object-contain"
                    sizes="(min-width:1280px) 252px, 210px"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 text-center text-xs text-gray-600">
          Previews show a subset of pages. Full report includes all chapters and appendices.
        </p>
      </div>
    </section>
  );
}

function ReportCTA({ report }: { report: Report }) {
  const r = useReducedMotion();

  return (
    <section className="relative section-slab-emerald" aria-labelledby="report-cta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16 text-white">
        <motion.h2
          id="report-cta"
          initial={r ? false : { opacity: 0, y: -10 }}
          whileInView={r ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-bold leading-tight text-[clamp(1.6rem,5.2vw,2.2rem)]"
        >
          Want this in your{" "}
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            next deck
          </span>
          ?
        </motion.h2>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {report.purchaseHref ? (
            <Link
              href={report.purchaseHref}
              className="relative inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-md transition-all duration-300
                         before:content-[''] before:absolute before:inset-0 before:rounded-full
                         before:bg-[radial-gradient(circle_at_center,_#ffffff,_#e6f4ea)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">Get full report</span>
            </Link>
          ) : null}

          <Link
            href="/solutions/seat-packs"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC107] px-6 py-3 text-sm font-semibold text-emerald-950 shadow-md transition-all duration-300
                       before:content-[''] before:absolute before:inset-0 before:rounded-full
                       before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">See seat packs</span>
          </Link>

          <Link
            href="/contact"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300
                       before:content-[''] before:absolute before:inset-0 before:rounded-full
                       before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                       before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Ask about a bundle</span>
          </Link>
        </div>

        <p className="mt-3 text-center text-xs text-white/85">
          Need a specific read not covered here? We can scope a custom module or merge your client data.
        </p>
      </div>
    </section>
  );
}








