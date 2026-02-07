// app/newsletter-signup/page.tsx
import type { Metadata } from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import NewsletterHero from './NewsletterHero';

export const metadata: Metadata = {
  title: { absolute: 'EcoFocus Research | Newsletter Signup' },
  robots: { index: false, follow: false },
};

export default function NewsletterSignupPage() {
  return (
    <>
      <Header />

      <main id="main" className="min-h-screen">
        <NewsletterHero />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Subscribe to EcoFocus Insights
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Fast, evidence-backed takes for brand, strategy, and media teams.
                  </p>
                  <div className="mt-6">
                    <NewsletterForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
