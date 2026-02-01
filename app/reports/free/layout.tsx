import type { Metadata } from "next";

const SITE_URL = "https://ecofocusresearch.com";

export const metadata: Metadata = {
  title: { absolute: "EcoFocus Research | Free Reports" },
  description:
    "Browse free EcoFocus sustainability reports and one-pagers to jumpstart research and planning.",
  alternates: { canonical: "/reports/free" },
  openGraph: {
    title: "EcoFocus Research | Free Reports",
    description:
      "Browse free EcoFocus sustainability reports and one-pagers to jumpstart research and planning.",
    url: `${SITE_URL}/reports/free`,
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-reports.png`,
        width: 1200,
        height: 630,
        alt: "EcoFocus Free Reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | Free Reports",
    description:
      "Browse free EcoFocus sustainability reports and one-pagers to jumpstart research and planning.",
    images: [`${SITE_URL}/images/og/og-reports.png`],
  },
  robots: { index: true, follow: true },
};

export default function FreeReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
