import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/contact/ContactForm';
import ContactHero from './ContactHero';

export const metadata: Metadata = {
  title: 'Contact — EcoFocus',
  description:
    'Talk with EcoFocus. Share your goals and timelines—we’ll respond within one business day.',
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <main id="main" className="min-h-screen">
        {/* HERO (matches AboutHero style) */}
        <ContactHero />

        {/* BODY */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* FORM CARD */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold text-gray-900">Send a Message</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Share a few details and we’ll follow up shortly.
                  </p>

                  <div className="mt-6">
                    <ContactForm />
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    We’ll only use your info to respond to your inquiry. See our{' '}
                    <a href="/privacy" className="underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* DETAILS / ASSURANCES */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-gray-50 ring-1 ring-black/5 p-6 sm:p-7">
                  <h3 className="text-base font-semibold text-gray-900">How We Work With You</h3>

                  <ul className="mt-3 space-y-3 text-sm text-gray-700">
                    <Li icon={<CheckIcon />}>A human reply within one business day.</Li>
                    <Li icon={<CheckIcon />}>No sales spam—real guidance and next steps.</Li>
                    <Li icon={<CheckIcon />}>Optional NDA before sharing sensitive details.</Li>
                  </ul>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <InfoRow label="Response time" value="Mon–Fri, 9–5 (local), < 1 business day" />
                    <InfoRow
                      label="Email"
                      value={
                        <a href="mailto:mcroft@ecofocusworldwide.com" className="underline">
                          mcroft@ecofocusworldwide.com
                        </a>
                      }
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ActionButton href="mailto:mcroft@ecofocusworldwide.com" icon={<MailIcon />}>
                      Email Us
                    </ActionButton>
                    {/* <ActionButton href="/reports" icon={<ReportIcon />}>Reports & Store</ActionButton> */}
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
                    We follow strict handling practices and can execute a mutual NDA on request. See our{' '}
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

/* ---------- Small UI bits (unchanged) ---------- */
function Li({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between rounded-lg bg-white p-3 ring-1 ring-black/5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11zm2.5-.5a.5.5 0 00-.5.5v.3l8 4.9 8-4.9V6.5a.5.5 0 00-.5-.5h-15z" />
    </svg>
  );
}

function ActionButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
        {icon}
      </span>
      <span>{children}</span>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 text-white/90 group-hover:translate-x-0.5 transition"
        aria-hidden="true"
      >
        <path d="M7.293 4.293a1 1 0 011.414 0L15 10l-6.293 5.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" />
      </svg>
    </a>
  );
}



