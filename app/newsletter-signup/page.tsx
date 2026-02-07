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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
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

              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-gray-50 ring-1 ring-black/5 p-6 sm:p-7">
                  <h3 className="text-base font-semibold text-gray-900">
                    What You’ll Receive
                  </h3>

                  <ul className="mt-3 space-y-3 text-sm text-gray-700">
                    <Li>Twice-monthly consumer trend snapshots.</Li>
                    <Li>Proof points you can drop into briefs.</Li>
                    <Li>Message ideas and prompts to test next.</Li>
                  </ul>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <InfoRow label="Cadence" value="2x per month" />
                    <InfoRow label="Audience" value="Brand, media, and strategy teams" />
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

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between rounded-lg bg-white p-3 ring-1 ring-black/5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}
