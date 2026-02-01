// app/reports/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportsPageClient from "./ReportsPageClient";
import AccessTabs from "./AccessTabs";
import ReportsHero from "./ReportsHero";

export const dynamic = "force-dynamic";

const SITE_URL = "https://ecofocusresearch.com";

/* -------------------- SEO -------------------- */
export const metadata: Metadata = {
  title: {
    absolute: "EcoFocus Research | Reports & Store" },
  description:
    "Explore EcoFocus® sustainability reports. Access U.S. consumer data, trends, and category insights to power strategy, messaging, and campaigns.",
  alternates: { canonical: "/reports" },
  keywords: [
    "EcoFocus",
    "sustainability research",
    "consumer insights",
    "environmental attitudes",
    "purpose-driven consumers",
    "market reports",
    "syndicated research",
  ],
  openGraph: {
    title: "EcoFocus Research | Reports & Store",
    description:
      "Actionable sustainability insights: deep trend data, proof points, and segments for strategy, media, and creative.",
    url: `${SITE_URL}/reports`,                       // ✅ absolute URL
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-reports.png`,  // ✅ absolute URL
        width: 1200,
        height: 630,
        alt: "EcoFocus Reports & Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | Reports & Store",
    description:
      "Actionable sustainability insights for strategy, messaging, and campaigns.",
    images: [`${SITE_URL}/images/og/og-reports.png`], // ✅ absolute URL
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReportsPage() {
  const pageUrl = `${SITE_URL}/reports`;

  // JSON-LD: CollectionPage + Breadcrumbs
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "EcoFocus Reports & Store",
    url: pageUrl,
    description:
      "Explore EcoFocus sustainability reports and datasets for U.S. consumer attitudes and behaviors.",
    isPartOf: {
      "@type": "WebSite",
      name: "EcoFocus Research",
      url: SITE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Reports & Store", item: pageUrl },
      ],
    },
  };

  return (
    <>
      {/* Structured data */}
      <Script
        id="reports-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <Header />

      {/* Hero section */}
      <ReportsHero />

      {/* Tabs under hero */}
      <AccessTabs />

      {/* Body (client) */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 text-emerald-800">
            Loading reports…
          </div>
        }
      >
        <ReportsPageClient />
      </Suspense>

      <Footer />
    </>
  );
}


































