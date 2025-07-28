import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'EcoFocus Research | Sustainability Insights & Reports',
  description:
    'EcoFocus provides sustainability research, custom studies, and actionable insights to help businesses make informed decisions. Since 2010, we deliver data-driven solutions for a sustainable future.',
  keywords: [
    'sustainability research',
    'EcoFocus reports',
    'consumer sustainability data',
    'custom sustainability studies',
    'ESG insights'
  ],
  openGraph: {
    title: 'EcoFocus Research | Sustainability Insights & Reports',
    description:
      'Actionable sustainability data and research to power your business strategies. Explore our reports and solutions today.',
    url: 'https://www.ecofocusworldwide.com/',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EcoFocus Research Homepage'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoFocus Research | Sustainability Insights & Reports',
    description:
      'Explore EcoFocus sustainability reports and custom research solutions to drive business growth.',
    images: ['/og-image.jpg']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'EcoFocus Research',
              url: 'https://www.ecofocusworldwide.com',
              logo: 'https://www.ecofocusworldwide.com/logo.png',
              description:
                'EcoFocus provides sustainability research, custom studies, and actionable insights to help businesses make informed decisions.',
              sameAs: [
                'https://www.linkedin.com/company/ecofocusworldwide',
                'https://twitter.com/ecofocus'
              ],
              foundingDate: '2010',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'info@ecofocusworldwide.com'
              }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

