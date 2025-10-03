// app/about/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "./AboutHero";
import AboutWhoWeAre from "./AboutWhoWeAre";
//import AboutApproach from "./AboutApproach";
//import AboutImpact from "./AboutImpact";
//import AboutCta from "./AboutCta";
import Script from "next/script";
import Leadership from "./Leadership";
import CallToAction from "../home/CallToAction";

export const dynamic = "force-dynamic";

const SITE_URL = "https://ecofocusresearch.netlify.app";

/* ---------------- SEO ---------------- */
export const metadata: Metadata = {
  title: { absolute: "EcoFocus Research | About" },
  description:
    "Learn how EcoFocus Research helps brands decode the purpose-driven generation with nationally representative sustainability insights and practical guidance.",
  alternates: { canonical: "/about" },
  openGraph: {
    title:  "EcoFocus Research | About",
    description:
      "We help brands turn sustainability signals into strategy—closing the say–do gap with data-driven guidance.",
    url: `${SITE_URL}/about`,                          // ✅ absolute URL
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-about.png`,     // ✅ absolute URL
        width: 1200,
        height: 630,
        alt: "EcoFocus Research — About",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | About",
    description:
      "Turning sustainability insights into action for brands serving the purpose-driven generation.",
    images: [`${SITE_URL}/images/og/og-about.png`],     // ✅ absolute URL
  },
};

export default function AboutPage() {
  // JSON-LD for AboutPage + Breadcrumbs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About EcoFocus Research",
    description:
      "EcoFocus Research helps brands decode the purpose-driven generation with reliable sustainability insights.",
    url: `${SITE_URL}/about`,
    isPartOf: {
      "@type": "WebSite",
      name: "EcoFocus Research",
      url: SITE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      ],
    },
  };

  return (
    <>
      <Header />

      <Script
        id="about-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AboutHero />
      <AboutWhoWeAre />
      <Leadership />
      <CallToAction />

      <Footer />
    </>
  );
}



