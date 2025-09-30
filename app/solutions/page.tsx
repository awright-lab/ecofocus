// app/solutions/page.tsx
import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import SolutionsHero from "./SolutionsHero";
import InteractiveDashboardShowcase from "./InteractiveDashboardShowcase";
import SolutionsOverview from "./SolutionsOverview";
import SolutionsComparison from "./SolutionsComparison";
// import SolutionsFeaturedOfferings from "./SolutionsFeaturedOfferings";
import SolutionsHighlights from "./SolutionsHighlights";
import FinalCTA from "./FinalCTA";
import DashboardIntro from "./DashboardIntro";

export const dynamic = "force-dynamic";

const SITE_URL = "https://ecofocusresearch.netlify.app";

/* -------------------- SEO -------------------- */
export const metadata: Metadata = {
  title: { absolute: "EcoFocus Research | Solutions" },
  description:
    "EcoFocus Solutions: syndicated research, custom studies, and activation support that turn sustainability insights into strategy, messaging, and measurable outcomes.",
  alternates: { canonical: "/solutions" },
  keywords: [
    "EcoFocus",
    "sustainability insights",
    "consumer research",
    "syndicated research",
    "custom research",
    "purpose-driven consumers",
    "brand strategy",
    "message testing",
    "dashboard reporting",
  ],
  openGraph: {
    title: "EcoFocus Research | Solutions",
    description:
      "From syndicated findings to custom studies and activation, our solutions help brands turn sustainability intent into action.",
    url: `${SITE_URL}/solutions`,                           // ✅ absolute URL
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-solutions.png`,      // ✅ absolute URL
        width: 1200,
        height: 630,
        alt: "EcoFocus Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | Solutions",
    description:
      "Syndicated and custom research plus activation support to move purpose-driven audiences.",
    images: [`${SITE_URL}/images/og/og-solutions.png`],     // ✅ absolute URL
  },
  robots: { index: true, follow: true },
};

export default function SolutionsPage() {
  const pageUrl = `${SITE_URL}/solutions`;

  // Structured data (WebPage + Services list + Breadcrumbs)
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "EcoFocus Solutions",
    url: pageUrl,
    description:
      "Sustainability research and activation solutions from EcoFocus, including syndicated insights, custom studies, and dashboards.",
    isPartOf: { "@type": "WebSite", name: "EcoFocus Research", url: SITE_URL },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Solutions", item: pageUrl },
      ],
    },
    hasPart: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "Service",
          name: "Syndicated Research",
          url: `${pageUrl}#syndicated`,
          description:
            "Annual U.S. consumer sustainability trends and proof points ready for briefs and strategy.",
        },
        {
          "@type": "Service",
          name: "Custom Research",
          url: `${pageUrl}#custom`,
          description:
            "Category- and audience-specific studies, message testing, and opportunity sizing.",
        },
        {
          "@type": "Service",
          name: "Consulting & Activation",
          url: `${pageUrl}#consulting`,
          description:
            "Brief development, dashboards, and go-to-market guidance to turn insights into performance.",
        },
      ],
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="solutions-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <Header />
      <main className="bg-white text-gray-900">
        <SolutionsHero />

        {/* Overview pillars */}
        <SolutionsOverview />

        {/* Dashboard showcase */}
        <InteractiveDashboardShowcase />

        <DashboardIntro />

        {/* Comparison */}
        <SolutionsComparison />

        {/* Highlights */}
        <SolutionsHighlights />

        {/* Final CTA */}
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}







