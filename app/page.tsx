// app/page.tsx
import type { Metadata } from "next";
import Script from "next/script";

//import Header from "../components/Header";
import Footer from "../components/Footer";
// import StickyButtons from "../components/StickyButtons";

import Hero from "./home/HomeHero";
import IntroSection from "./home/IntroSection";
import CoreServices from "./home/CoreServices";
import TrustedBy from "./home/TrustedBy";
import CallToAction from "./home/CallToAction";
import EcoNuggetInsights from "./home/EcoNuggetInsights";
import QuickStats from "./home/QuickStats";
import SayDoGapSection from "./home/SayDoGapSection";
import InteractiveDashboardShowcase from "./home/InteractiveDashboardShowcase";
import HeaderEvent from "@/components/HeaderEvent";

const SITE_URL = "https://ecofocusresearch.netlify.app";

/* -------------------- SEO -------------------- */
export const metadata: Metadata = {
  title: {
    absolute: "EcoFocus Research | Sustainability Insights for Purpose-Driven Brands",
  },
  description:
    "EcoFocus Research delivers nationally representative sustainability insights to help brands decode the purpose-driven generation and close the say-do gap.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "EcoFocus Research | Sustainability Insights for Purpose-Driven Brands",
    description:
      "Reliable sustainability research for brands and agencies: decode the purpose-driven generation and turn insights into strategy.",
    url: SITE_URL,
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-default.png`,
        width: 1200,
        height: 630,
        alt: "EcoFocus Research — Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | Sustainability Insights for Purpose-Driven Brands",
    description:
      "Reliable sustainability research for brands and agencies: decode the purpose-driven generation and turn insights into strategy.",
    images: [`${SITE_URL}/images/og/og-default.png`],
  },
};

/* -------------------- PAGE -------------------- */
export default function HomePage() {
  // JSON-LD for Organization + Website + Breadcrumb
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "EcoFocus Research",
    url: SITE_URL,
    description:
      "EcoFocus Research delivers sustainability insights that help brands decode the purpose-driven generation.",
    isPartOf: { "@type": "WebSite", name: "EcoFocus Research", url: SITE_URL },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }],
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="home-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Move the header OUTSIDE <main> so fixed positioning is reliable */}
      <HeaderEvent />

      {/* Pad the page content to clear the fixed header (matches Header: h-14 md:h-20) */}
      <main id="main" className="pt-14 md:pt-20">
        <Hero />
        <IntroSection />
        <CoreServices />
        <InteractiveDashboardShowcase />
        <QuickStats />
        <SayDoGapSection />
        <EcoNuggetInsights />
        <TrustedBy />
        <CallToAction />
      </main>

      <Footer />
      {/* <StickyButtons /> */}
    </>
  );
}






