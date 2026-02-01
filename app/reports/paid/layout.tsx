import type { Metadata } from "next";

const SITE_URL = "https://ecofocusresearch.com";

export const metadata: Metadata = {
  title: { absolute: "EcoFocus Research | Paid Reports" },
  description:
    "Explore premium EcoFocus sustainability reports and datasets for deeper consumer insights.",
  alternates: { canonical: "/reports/paid" },
  openGraph: {
    title: "EcoFocus Research | Paid Reports",
    description:
      "Explore premium EcoFocus sustainability reports and datasets for deeper consumer insights.",
    url: `${SITE_URL}/reports/paid`,
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-reports.png`,
        width: 1200,
        height: 630,
        alt: "EcoFocus Paid Reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | Paid Reports",
    description:
      "Explore premium EcoFocus sustainability reports and datasets for deeper consumer insights.",
    images: [`${SITE_URL}/images/og/og-reports.png`],
  },
  robots: { index: true, follow: true },
};

export default function PaidReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
