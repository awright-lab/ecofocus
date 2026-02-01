import type { Metadata } from "next";

const SITE_URL = "https://ecofocusresearch.com";

export const metadata: Metadata = {
  title: { absolute: "EcoFocus Research | Legal" },
  description:
    "Privacy policy, terms of service, and cookie details for EcoFocus Research.",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "EcoFocus Research | Legal",
    description:
      "Privacy policy, terms of service, and cookie details for EcoFocus Research.",
    url: `${SITE_URL}/legal`,
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-default.png`,
        width: 1200,
        height: 630,
        alt: "EcoFocus Research Legal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | Legal",
    description:
      "Privacy policy, terms of service, and cookie details for EcoFocus Research.",
    images: [`${SITE_URL}/images/og/og-default.png`],
  },
  robots: { index: true, follow: true },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
