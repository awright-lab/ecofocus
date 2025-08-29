// app/reports/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATALOG, SMALL_REPORTS } from '@/lib/catalog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PurchaseCard from './PurchaseCard';
import { CheckCircle2, Users, BarChart2, LineChart, BadgeCheck } from 'lucide-react';

// Lock to statically generated ids (nice for static export)
export const dynamicParams = false;

// --- Types (route-local) -------------------------------------------------
type RouteParams = { id: string };

// --- Static params for SSG/Export ---------------------------------------
export async function generateStaticParams(): Promise<RouteParams[]> {
  return SMALL_REPORTS.map((r) => ({ id: r.id }));
}

// --- Metadata (align with Promise-wrapped params) ------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const product = CATALOG.find((x) => x.id === id);
  if (!product || product.category !== 'Reports') return {};
  return {
    title: `${product.title} — EcoFocus`,
    description:
      product.subtitle ??
      'Focused sustainability insight with slide-ready charts and clear takeaways.',
  };
}

// --- Page (align with Promise-wrapped params) ----------------------------
export default async function ReportDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;

  const p = CATALOG.find((x) => x.id === id);
  if (!p || p.category !== 'Reports' || typeof p.year !== 'number') {
    notFound();
  }
  const product = p;

  // ✅ Ensure a concrete string for Next/Image
  const cover: string = product.img ?? '/images/report-cover-fallback.jpg';

  // naive related: same year, not itself
  const related = SMALL_REPORTS
    .filter((r) => r.year === product.year && r.id !== product.id)
    .slice(0, 3);

  return (
    <main className="bg-white">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white">
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="container mx-auto px-6 py-16 md:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <BadgeCheck className="h-4 w-4" />
            Focused Insight — {product.year}
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">{product.title}</h1>
          {product.subtitle ? (
            <p className="mt-3 max-w-3xl text-white/80 text-base md:text-lg">{product.subtitle}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <Users className="h-4 w-4" />
              Cohort comparisons
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <BarChart2 className="h-4 w-4" />
              Slide-ready charts
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <LineChart className="h-4 w-4" />
              Clear takeaways
            </span>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-white">
              {/* ✅ use guaranteed string */}
              <Image src={cover} alt={product.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>

            {product.includes?.length ? (
              <div className="mt-10">
                <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
                <h2 className="mt-3 text-xl font-semibold">What’s included</h2>
                <ul className="mt-4 grid gap-2 text-sm text-gray-800">
                  {product.includes.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Overview */}
            <div className="mt-10">
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
              <h2 className="mt-3 text-xl font-semibold">Overview</h2>
              <p className="mt-3 text-sm text-gray-700">
                This focused insight explores how sustainability attitudes and behaviors shape category
                expectations and trade-offs. Use it to inform product claims, positioning, packaging
                decisions, and channel messaging.
              </p>
            </div>

            {/* Related */}
            {related.length ? (
              <div className="mt-12">
                <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-marigold-500" />
                <h2 className="mt-3 text-xl font-semibold">You might also like</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => {
                    const relCover: string = r.img ?? '/images/report-cover-fallback.jpg';
                    return (
                      <Link
                        href={`/reports/${r.id}`}
                        key={r.id}
                        className="group overflow-hidden rounded-xl border hover:shadow-sm transition"
                      >
                        <div className="relative aspect-[16/10]">
                          {/* ✅ fallback for related cover too */}
                          <Image src={relCover} alt={r.title} fill className="object-cover" />
                        </div>
                        <div className="p-3">
                          <div className="text-sm font-semibold group-hover:underline line-clamp-2">
                            {r.title}
                          </div>
                          <div className="mt-1 text-xs text-gray-600">
                            {typeof r.price === 'number' ? `$${r.price.toLocaleString()}` : '—'}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT: purchase */}
          <PurchaseCard id={product.id} price={product.price} />
        </div>
      </section>

      <Footer />
    </main>
  );
}







