import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  // Enables clean relative canonicals/OG URLs in child routes
  metadataBase: new URL("https://www.ecofocusworldwide.com"),
  title: {
    default: "EcoFocus Research | Sustainability Insights & Reports",
    template: "%s | EcoFocus Research",
  },
  description:
    "EcoFocus provides sustainability research, custom studies, and actionable insights to help businesses make informed decisions.",
  openGraph: {
    title: "EcoFocus Research",
    description:
      "Actionable sustainability data and research to power your business strategies.",
    url: "/", // homepage
    type: "website",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "EcoFocus Research Homepage" },
    ],
    siteName: "EcoFocus Research",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research",
    description:
      "Actionable sustainability data and research to power your business strategies.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-white dark:bg-gray-900">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EcoFocus Research",
              url: "https://www.ecofocusworldwide.com",
            }),
          }}
        />
        {/* HubSpot tracking script (sets hubspotutk cookie) */}
        {process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID && (
          <Script
            id="hs-script-loader"
            strategy="afterInteractive"
            src={`https://js.hs-scripts.com/${process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID}.js`}
          />
        )}
      </head>
      <body className="text-gray-900 dark:text-white">{children}</body>
    </html>
  );
}



