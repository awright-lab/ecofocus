// app/contact/page.tsx
import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "./ContactHero";

const SITE_URL = "https://ecofocusresearch.netlify.app";

/* ---------------- SEO ---------------- */
export const metadata: Metadata = {
  title: {
    default: "Contact — EcoFocus",
    template: "%s | EcoFocus Research",
  },
  description:
    "Talk with EcoFocus. Share your goals and timelines—we’ll respond within one business day.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact — EcoFocus Research",
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
    title: "Contact — EcoFocus Research",
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
                    Send a Message
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Share a few details and we’ll follow up shortly.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    We’ll only use your info to respond to your inquiry. See our{" "}
                    <a href="/privacy" className="underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-gray-50 ring-1 ring-black/5 p-6 sm:p-7">
                  <h3 className="text-base font-semibold text-gray-900">
                    How We Work With You
                  </h3>

                  <ul className="mt-3 space-y-3 text-sm text-gray-700">
                    <Li>A human reply within one business day.</Li>
                    <Li>No sales spam—real guidance and next steps.</Li>
                    <Li>Optional NDA before sharing sensitive details.</Li>
                  </ul>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <InfoRow
                      label="Response time"
                      value="Mon–Fri, 9–5 (local), < 1 business day"
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
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              <FaqItem
                q="Can you tailor insights for our category?"
                a="Yes. We map EcoFocus findings to your category and target segments, identifying the claims and messages most likely to convert."
              />
              <FaqItem
                q="Do you work with agencies?"
                a="Absolutely—strategy, creative, and media teams use us to sharpen briefs and validate message frameworks."
              />
              <FaqItem
                q="Can we preview relevant data?"
                a="We can share a short deck with anonymized cuts and example proof points so you can confirm fit before committing."
              />
              <FaqItem
                q="How do you handle privacy?"
                a={
                  <>
                    We follow strict handling practices and can execute a mutual
                    NDA on request. See our{" "}
                    <a href="/privacy" className="underline">
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

/* ---------- Small UI bits ---------- */
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





