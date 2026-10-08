import type { Metadata } from "next";
import CaseStudyLayout, { type CaseStudyContent } from "@/components/CaseStudyLayout";

const title = "Glass Packaging Institute Case Study";
const description = "How EcoFocus helped the Glass Packaging Institute turn consumer evidence into a stronger business case for glass packaging.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/case-studies/glass-packaging-institute" },
  openGraph: {
    title,
    description,
    url: "/case-studies/glass-packaging-institute",
    type: "article",
    images: [{ url: "/images/og/og-default.png", width: 1200, height: 630, alt: "EcoFocus Research" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og/og-default.png"] },
};


const study: CaseStudyContent = {
  client: "Glass Packaging Institute",
  shortName: "GPI",
  headline: { lead: "Consumer perspectives on", emphasis: "glass packaging." },
  summary: "How EcoFocus helped the Glass Packaging Institute understand consumer attitudes and inform its work with the glass packaging industry.",
  logo: { src: "/images/logos/Site_GPI Logo 2_0.png", alt: "Glass Packaging Institute" },
  facts: [
    { label: "Client", value: "Glass Packaging Institute" },
    { label: "Research focus", value: "Consumer attitudes & packaging" },
    { label: "Deliverable", value: "Strategic research report" },
  ],
  overview: "GPI needed a clearer picture of how consumers view glass packaging to inform member conversations and communications.",
  approach: {
    title: "Research built around the right questions",
    text: "EcoFocus combined consumer tracking dating back to 2010 with custom questions for GPI. The results were brought together in a strategic research report to help the organization interpret consumer perspectives and plan its next steps.",
  },
  methodology: {
    description: "A nationally representative online survey of U.S. adults, balanced to the U.S. Census.",
    facts: [
      { label: "Research base", value: "4,046 U.S. adults, age 18+" },
      { label: "Fieldwork", value: "May 28–June 14, 2026" },
      { label: "Reported margin of error", value: "±1.55%" },
    ],
    note: "Source: EcoFocus Research 2026 Syndicated Study, prepared for the Glass Packaging Institute.",
  },
  document: {
    href: "/EcoFocus_GPI_Case_Study_Final.pdf",
    pages: 6,
    readerSrc: "/gpi-reader/index.html?embed=1",
  },
  testimonial: {
    quote: "EcoFocus gave us more than data. They gave us a credible, consumer-backed story that we and our members can use in conversations with brands, policymakers and the marketplace.",
    name: "Scott DeFife",
    role: "President, Glass Packaging Institute",
  },
};

export default function GlassPackagingCaseStudy() {
  return <CaseStudyLayout study={study} />;
}
