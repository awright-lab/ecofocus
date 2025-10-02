// app/blog/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

import { getPosts, getTopics } from "@/lib/payload";
import BlogCard from "@/components/blog/BlogCard";
import BlogFilterBar from "@/components/blog/BlogFilterBar";
import SubscribeStrip from "@/components/blog/SubscribeStrip";
import BlogHero from "@/components/blog/BlogHero";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleFeedMobile from "@/components/blog/ArticleFeedMobile";

export const dynamic = "force-dynamic"; // ensure fresh results for filters

const SITE_URL = "https://ecofocusresearch.netlify.app";

/* -------------------- SEO -------------------- */
export const metadata: Metadata = {
  title: { absolute: "EcoFocus Research | EcoNuggets Insights Blog" },
  description:
    "Short, actionable “EcoNuggets” on sustainability, consumer behavior, and data-driven strategy.",
  alternates: { canonical: "/blog" },
  keywords: [
    "EcoFocus",
    "EcoNuggets",
    "sustainability insights",
    "consumer behavior",
    "ESG trends",
    "purpose-driven consumers",
    "research blog",
    "marketing strategy",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "EcoFocus Research | EcoNuggets Insights Blog",
    description:
      "Bite-size research takeaways on sustainability and consumer decisions—ready for briefs and campaigns.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-blog.png`,
        width: 1200,
        height: 630,
        alt: "EcoNuggets – EcoFocus Research Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | EcoNuggets Insights Blog",
    description:
      "Short, actionable “EcoNuggets” on sustainability, consumer behavior, and data-driven strategy.",
    images: [`${SITE_URL}/images/og/og-blog.png`],
  },
};

/* -------------------- Helpers -------------------- */
const pickFirst = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

/* -------------------- Page -------------------- */
export default async function BlogIndex({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const sp = searchParams || {};

  const q = pickFirst(sp.q);
  const topic = pickFirst(sp.topic);
  const sort = (pickFirst(sp.sort) as "new" | "popular" | undefined) || "new";
  const page = Number(pickFirst(sp.page) || 1);

  const [cats, paged] = await Promise.all([
    getTopics(),
    getPosts({ q, topicSlug: topic, page, limit: 12 }),
  ]);

  const { docs, totalDocs, totalPages } = paged;

  // ---------- JSON-LD: Blog + Breadcrumbs + SearchAction ----------
  const pageUrl = `${SITE_URL}/blog`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "EcoNuggets – Insights Blog",
    url: pageUrl,
    description:
      "Short, actionable “EcoNuggets” on sustainability, consumer behavior, and data-driven strategy.",
    isPartOf: { "@type": "WebSite", name: "EcoFocus Research", url: SITE_URL },
    potentialAction: {
      "@type": "SearchAction",
      target: `${pageUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl },
      ],
    },
  };

  return (
    <>
      {/* Structured data */}
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <Header />

      <main className="bg-neutral-50">
        <BlogHero />

        {/* FILTERS */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-10 relative z-10">
          <BlogFilterBar categories={cats} />
        </div>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          {/* Results meta */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {totalDocs === 0
                ? "No results."
                : `Showing ${docs.length} of ${totalDocs} result${
                    totalDocs === 1 ? "" : "s"
                  }`}
            </p>
            {(q || topic) && (
              <Link
                href="/blog"
                className="text-sm font-medium text-emerald-700 hover:underline decoration-emerald-500/40"
              >
                Clear filters
              </Link>
            )}
          </div>

          {/* Mobile feed */}
          <ArticleFeedMobile
            initial={{ docs, page, totalPages, totalDocs }}
            q={q}
            category={topic || undefined}
            sort={sort}
          />

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="hidden md:flex mt-8 items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                const isActive = n === page;
                const spOut = new URLSearchParams();
                if (q) spOut.set("q", q);
                if (topic) spOut.set("topic", topic);
                if (sort) spOut.set("sort", sort);
                spOut.set("page", String(n));
                return (
                  <Link
                    key={n}
                    href={`/blog?${spOut.toString()}`}
                    className={
                      isActive
                        ? "rounded-full bg-emerald-600 text-white px-3 py-1 text-sm"
                        : "rounded-full bg-white ring-1 ring-gray-200 px-3 py-1 text-sm text-gray-700"
                    }
                  >
                    {n}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-12">
            <SubscribeStrip />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}






