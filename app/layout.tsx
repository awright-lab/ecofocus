// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

// 1) CLS-safe font loading
const inter = Inter({ subsets: ["latin"], display: "swap" });

// 2) Site constants (USE THE LIVE, CRAWLABLE URL)
const SITE_URL = "https://ecofocusresearch.netlify.app";
const SITE_NAME = "EcoFocus Research";
const SITE_DESC =
  "EcoFocus provides sustainability research, custom studies, and actionable insights to help businesses make informed decisions.";

// 3) Viewport + theme color
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10B981" }, // emerald
    { media: "(prefers-color-scheme: dark)", color: "#052e29" },
  ],
};

// 4) Global metadata (absolute OG/Twitter image URLs)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Sustainability Insights & Reports`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Actionable sustainability data and research to power your business strategies.",
    images: [
      {
        url: `${SITE_URL}/images/og/og-image.jpg`, // absolute URL (1200x630)
        width: 1200,
        height: 630,
        alt: "EcoFocus Research Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Actionable sustainability data and research to power your business strategies.",
    images: [`${SITE_URL}/images/og/og-image.jpg`], // match OG image
  },
  icons: {
    icon: [
      { url: "/images/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/icons/apple-touch-icon-180.png", sizes: "180x180" },
      { url: "/images/icons/apple-touch-icon-167.png", sizes: "167x167" },
      { url: "/images/icons/apple-touch-icon-152.png", sizes: "152x152" },
      { url: "/images/icons/apple-touch-icon-120.png", sizes: "120x120" },
    ],
    other: [
      // Safari pinned tab (single color)
      { rel: "mask-icon", url: "/images/icons/safari-pinned-tab.svg", color: "#156C2B" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "business",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // 5) Organization JSON-LD (non-blocking)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo_web3.png`,
    sameAs: [
      "https://www.linkedin.com/company/ecofocus",
      "https://x.com/EcoFocus",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Business",
        email: "info@ecofocusworldwide.com",
        availableLanguage: ["en"],
      },
    ],
  };

  return (
    <html lang="en" className="bg-white dark:bg-gray-900" suppressHydrationWarning>
      <head>
        {/* JSON-LD */}
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        {/* HubSpot tracking (guarded) */}
        {process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ? (
          <Script
            id="hs-script-loader"
            strategy="afterInteractive"
            src={`https://js.hs-scripts.com/${process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID}.js`}
          />
        ) : null}

        {/* Helpful preconnects */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://js.hs-scripts.com" />
        <link rel="dns-prefetch" href="https://js.hs-scripts.com" />
      </head>
      <body className={`${inter.className} text-gray-900 dark:text-white`}>
        {children}
      </body>
    </html>
  );
}





