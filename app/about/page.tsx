// app/about/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "./AboutHero";
import AboutWhoWeAre from "./AboutWhoWeAre";
import AboutApproach from "./AboutApproach";
import AboutImpact from "./AboutImpact";
import AboutCta from "./AboutCta";
import Script from "next/script";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how EcoFocus Research helps brands decode the purpose-driven generation with nationally representative sustainability insights and practical guidance.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · EcoFocus Research",
    description:
      "We help brands turn sustainability signals into strategy—closing the say–do gap with data-driven guidance.",
    images: [
      {
        url: "/og/og-about.jpg", // add a specific OG image for about
        width: 1200,
        height: 630,
        alt: "EcoFocus Research — About",
      },
    ],
  },
  twitter: {
    title: "About · EcoFocus Research",
    description:
      "Turning sustainability insights into action for brands serving the purpose-driven generation.",
    images: ["/og/og-about.jpg"],
  },
};

export default function AboutPage() {
  // JSON-LD for AboutPage + Breadcrumbs — helps both SEO and AI crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About EcoFocus Research",
    description:
      "EcoFocus Research helps brands decode the purpose-driven generation with reliable sustainability insights.",
    url: "https://www.ecofocusresearch.com/about",
    isPartOf: {
      "@type": "WebSite",
      name: "EcoFocus Research",
      url: "https://www.ecofocusresearch.com",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.ecofocusresearch.com/" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://www.ecofocusresearch.com/about" },
      ],
    },
  };

  return (
    <>
      <Header />

      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AboutHero />
      <AboutWhoWeAre />
      <AboutApproach />
      <AboutImpact />
      <AboutCta />

      <Footer />
    </>
  );
}


