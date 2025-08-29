// app/solutions/syndicated-study-2025/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CATALOG } from "@/lib/catalog";
import { CheckCircle2, Calendar, Users, BarChart2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "2025 Syndicated Study — Buy-In • EcoFocus",
  description:
    "Participate in the 2025 EcoFocus syndicated study. Add proprietary questions and receive full study deliverables.",
};

export default function SyndicatedStudy2025Page() {
  const product = CATALOG.find((p) => p.id === "buyin-2025");
  if (!product) notFound();

  const isContact =
    (product.purchaseType ?? (product.category === "Reports" ? "direct" : "contact")) === "contact";
  const priceText =
    typeof product.price === "number" ? `$${product.price.toLocaleString()}` : undefined;

  const contactHref = product.contactPath ?? `/contact?product=${product.id}`;

  // ✅ Ensure concrete strings for <Image /> and JSON-LD
  const cover: string = product.img ?? "/images/report-cover-fallback.jpg";
  const siteOrigin = "https://ecofocusresearch.netlify.app";
  const absoluteCover =
    cover.startsWith("http") ? cover : `${siteOrigin}${cover.startsWith("/") ? "" : "/"}${cover}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: product.title,
    description:
      product.subtitle ??
      "Participate in EcoFocus 2025, add proprietary questions, and receive full study deliverables.",
    provider: { "@type": "Organization", name: "EcoFocus Research" },
    areaServed: "US",
    image: absoluteCover, // ✅ always defined & absolute
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      ...(typeof product.price === "number" ? { price: product.price } : {}),
      url: `${siteOrigin}/solutions/syndicated-study-2025`,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="bg-white">
      <Header />

      {/* Breadcrumbs */}
      <section className="container mx-auto px-4 pt-6">
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:underline text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/solutions" className="hover:underline text-gray-700">
                Solutions
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-900 font-medium">
              {product.title}
            </li>
          </ol>
        </nav>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white">
        <div className="container mx-auto px-6 py-12 md:py-16 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            2025 Program
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">{product.title}</h1>
          {product.subtitle && (
            <p className="mt-3 max-w-3xl text-white/85 text-base md:text-lg">{product.subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <Users className="h-4 w-4" />
              National sample with cohorts
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <BarChart2 className="h-4 w-4" />
              Full deliverables
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <ShieldCheck className="h-4 w-4" />
              MOE &plusmn;1.55%
            </span>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-white">
              {/* ✅ cover is guaranteed string */}
              <Image src={cover} alt={product.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>

            {/* Overview */}
            <div className="mt-8">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
              <h2 className="mt-3 text-xl font-semibold">Overview</h2>
              <p className="mt-3 text-sm text-gray-700">
                Join EcoFocus 2025 to add proprietary questions, compare key cohorts, and receive a
                complete deliverables package. Teams use this program to validate claims, sharpen
                positioning, and inform packaging &amp; channel strategy.
              </p>
            </div>

            {/* What you receive */}
            <div className="mt-8">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
              <h3 className="mt-3 text-xl font-semibold">What you receive</h3>
              <ul className="mt-4 grid gap-2 text-sm text-gray-800">
                {[
                  "Custom questions fielded in 2025 study",
                  "Full study deliverables: PDF and charts",
                  "Crosstabs with your key splits",
                  "Dashboard access (seats scale by org size)",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="mt-8">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
              <h3 className="mt-3 text-xl font-semibold">Process &amp; timeline</h3>
              <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Discovery call to align on objectives and feasibility.</li>
                <li>Question design &amp; review with our research team.</li>
                <li>Fieldwork &amp; quality checks.</li>
                <li>Deliverables handoff and executive readout.</li>
              </ul>
            </div>

            {/* Related */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold">Related solutions</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/solutions/data-enrichment"
                  className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Data Enrichment
                </Link>
                <Link
                  href="/reports/sir-2024"
                  className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  2024 SIR (Full Report)
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Sticky CTA */}
          <aside className="h-fit rounded-2xl border bg-white p-5 sticky top-6">
            <div className="text-sm text-gray-500">Service</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">
              {isContact ? (priceText ? `Starting at ${priceText}` : "Contact for pricing") : priceText ?? "—"}
            </div>

            <Link
              href={contactHref}
              className="mt-4 block w-full rounded-full bg-emerald-600 py-2.5 text-center text-white font-semibold hover:bg-emerald-700"
            >
              {product.ctaLabel ?? "Schedule discovery"}
            </Link>
            <Link
              href="/contact"
              className="mt-2 block w-full rounded-full border py-2.5 text-center font-semibold hover:bg-gray-50"
            >
              Ask a question
            </Link>

            {/* Quick metrics */}
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Fielding window coordinated with your team
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                4,000 US adults; key cohorts available
              </li>
              <li className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-emerald-600" />
                Slide-ready charts &amp; readout
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <Footer />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}

