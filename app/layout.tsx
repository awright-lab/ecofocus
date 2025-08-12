import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
//import AppWrapper from '@/components/AppWrapper';

export const metadata: Metadata = {
  title: 'EcoFocus Research | Sustainability Insights & Reports',
  description:
    'EcoFocus provides sustainability research, custom studies, and actionable insights to help businesses make informed decisions.',
  openGraph: {
    title: 'EcoFocus Research',
    description:
      'Actionable sustainability data and research to power your business strategies.',
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
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white dark:bg-gray-900">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'EcoFocus Research',
              url: 'https://www.ecofocusworldwide.com'
            })
          }}
        />
      </head>
      <body className="text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}


