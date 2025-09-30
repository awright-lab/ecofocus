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

/* -------------------- SEO -------------------- */
export const metadata: Metadata = {
  title: {
    default: "Reports & Store",
    template: "%s | EcoFocus Research",
  },
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
    title: "Reports & Store — EcoFocus Research",
    description:
      "Actionable sustainability insights: deep trend data, proof points, and segments for strategy, media, and creative.",
    url: "/reports",
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: "/images/og/og-reports.png",
        width: 1200,
        height: 630,
        alt: "EcoFocus Reports & Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reports & Store — EcoFocus Research",
    description:
      "Actionable sustainability insights for strategy, messaging, and campaigns.",
    images: ["/images/og/og-reports.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReportsPage() {
  const orgUrl = "https://www.ecofocusworldwide.com";
  const pageUrl = `${orgUrl}/reports`;

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
      url: orgUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: orgUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Reports & Store",
          item: pageUrl,
        },
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

      {/* Hero — deep blue slab + subtle grid */}
      <ReportsHero />

      {/* Tabs just under the hero */}
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

































