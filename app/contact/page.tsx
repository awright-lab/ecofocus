// app/contact/page.tsx
import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "./ContactHero";

const SITE_URL = "https://ecofocusresearch.com";

/* ---------------- SEO ---------------- */
export const metadata: Metadata = {
  title: { absolute: "EcoFocus Research | Contact" },
  description:
    "Talk with EcoFocus. Share your goals and timelines—we’ll respond within one business day.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "EcoFocus Research | Contact",
    description:
      "Tell us about your goals, audience, and timing. We’ll respond within one business day.",
    url: `${SITE_URL}/contact`,
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-contact.png`, // ✅ absolute
        width: 1200,
        height: 630,
        alt: "Contact EcoFocus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoFocus Research | Contact",
    description:
      "Share your goals and timelines—we’ll respond within one business day.",
    images: [`${SITE_URL}/images/og/og-contact.png`], // ✅ absolute
  },
};

export default function ContactPage() {
  const pageUrl = `${SITE_URL}/contact`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact EcoFocus",
    url: pageUrl,
    description:
      "Talk with EcoFocus. Share your goals and timelines—we’ll respond within one business day.",
    isPartOf: { "@type": "WebSite", name: "EcoFocus Research", url: SITE_URL },
    mainEntity: {
      "@type": "Organization",
      name: "EcoFocus Research",
      url: SITE_URL,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "mcroft@ecofocusworldwide.com",
          availableLanguage: ["English"],
          areaServed: "US",
        },
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Contact", item: pageUrl },
      ],
    },
  };

  return (
    <>
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <Header />

      <main id="main" className="min-h-screen">
        <ContactHero />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
            {/* FORM + DETAILS */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Tell Us About Your Project
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Tell us what you’re working on, and we’ll recommend the fastest path to the insight you need.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                  <p className="mt-5 text-xs text-gray-500">
                    Trusted by brand and agency teams across CPG, retail, and media.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-gray-50 ring-1 ring-black/5 p-6 sm:p-7">
                    <h3 className="text-base font-semibold text-gray-900">
                      What Happens Next
                    </h3>
                    <ol className="mt-3 space-y-3 text-sm text-gray-700">
                      <li>
                        <p className="font-semibold text-gray-900">1. Discovery call (30 minutes)</p>
                        <p>We align on goals, audience, timing, and what success looks like.</p>
                      </li>
                      <li>
                        <p className="font-semibold text-gray-900">2. Right-fit recommendation</p>
                        <p>We outline high-level options, then go deeper on what best fits your needs.</p>
                      </li>
                      <li>
                        <p className="font-semibold text-gray-900">3. Proposal and next steps</p>
                        <p>We share scope, timeline, and a clear path to get started.</p>
                      </li>
                    </ol>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                      <InfoRow
                        label="Response time"
                        value="Mon–Fri, 9–5 CST, < 1 business day"
                      />
                      <InfoRow
                        label="Email"
                        value={
                          <a
                            href="mailto:mcroft@ecofocusworldwide.com"
                            className="underline"
                          >
                            mcroft@ecofocusworldwide.com
                          </a>
                        }
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 p-6 sm:p-7">
                    <h3 className="text-base font-semibold text-gray-900">
                      Schedule a Call
                    </h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Prefer to talk live? Book time directly with our team for
                      a focused conversation about your goals, timelines, and
                      next steps.
                    </p>
                    <a
                      href="https://meetings.hubspot.com/michaelcroft/michael-croft-meeting-link"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Book a Call
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              <FaqItem
                q="Can you tailor insights for our category?"
                a="Yes. We map EcoFocus findings to your category and target segments, identifying the questions most relevant to your business needs."
              />
              <FaqItem
                q="Do you work with agencies?"
                a="Absolutely. Strategy, creative, and media teams use us to sharpen briefs and validate message frameworks."
              />
              <FaqItem
                q="Can we preview relevant data?"
                a="Yes. We have a demo version of our Interactive Dashboard that we can share with you."
              />
              <FaqItem
                q="How do you handle privacy?"
                a={
                  <>
                    We follow strict handling practices and can execute a mutual
                    NDA on request. See our{" "}
                    <a href="/legal#privacy-policy" className="underline">
                      Privacy Policy
                    </a>
                    .
                  </>
                }
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
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

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-gray-200 bg-white p-5 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-gray-900">{q}</h3>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-3 text-sm leading-6 text-gray-600">{a}</div>
    </details>
  );
}
