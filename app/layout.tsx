import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

// 1) CLS-safe font loading (improves Lighthouse/CLS)
const inter = Inter({ subsets: ["latin"], display: "swap" });

// 2) Canonical base (you already had this — kept as-is)
const SITE_URL = "https://www.ecofocusworldwide.com";
const SITE_NAME = "EcoFocus Research";
const SITE_DESC =
  "EcoFocus provides sustainability research, custom studies, and actionable insights to help businesses make informed decisions.";

// 3) Viewport + theme color (helps Lighthouse)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10B981" }, // emerald
    { media: "(prefers-color-scheme: dark)", color: "#052e29" },
  ],
};

// 4) Global metadata (keeps your OG/Twitter but adds icons/manifest/canonical hygiene)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Sustainability Insights & Reports`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  alternates: { canonical: "/" }, // child pages override
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_NAME,
    description:
      "Actionable sustainability data and research to power your business strategies.",
    url: "/", // homepage
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og/og-image.jpg",
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
    images: ["/og/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#0ea5a0" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "business",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // 5) Organization JSON-LD (AI-SEO friendly). Non-blocking with afterInteractive.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo_web3.png`, // update to your main logo path
    sameAs: [
      // add your real profiles if applicable
      "https://www.linkedin.com/company/ecofocus",
      "https://x.com/EcoFocus", // or remove if unused
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
        {/* 6) Organization Schema (kept your idea, just richer). */}
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          // Keep JSON.stringify (no trailing commas)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        {/* 7) HubSpot tracking (kept exactly, just left a small guard) */}
        {process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ? (
          <Script
            id="hs-script-loader"
            strategy="afterInteractive"
            src={`https://js.hs-scripts.com/${process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID}.js`}
          />
        ) : null}

        {/* 8) Optional: Preconnects that commonly help. Safe to keep or remove. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://js.hs-scripts.com" />
        <link rel="dns-prefetch" href="https://js.hs-scripts.com" />
      </head>

      {/* 9) CLS-safe font class and accessible base text color */}
      <body className={`${inter.className} text-gray-900 dark:text-white`}>
        {children}
      </body>
    </html>
  );
}




