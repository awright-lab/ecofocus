// app/legal/page.tsx
'use client';

import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LegalHero from './LegalHero';
//import Hero from '@/components/Hero'; // ← using your Hero component
const COMPANY = 'EcoFocus Research';
const LEGAL_EMAIL = 'mcroft@ecofocusworldwide.com'; // update if needed

export default function LegalPage() {
  return (
    <>
      <Header />

      <main id="main" className="relative bg-white">
        {/* Hero (using your component) */}
        <LegalHero />

        {/* Content */}
        <section
          className="
            relative
            bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]
            before:pointer-events-none before:absolute before:inset-0
            before:bg-[radial-gradient(60rem_40rem_at_10%_20%,rgba(16,185,129,0.06),transparent_60%),radial-gradient(48rem_32rem_at_120%_-20%,rgba(59,130,246,0.05),transparent_60%)]
            before:content-['']
          "
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
              {/* Sticky Table of Contents (desktop) */}
              <aside className="lg:col-span-3">
                <nav
                  className="sticky top-24 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-4"
                  aria-label="In-page navigation"
                >
                  <p className="text-xs font-semibold text-slate-500 mb-3">On this page</p>
                  <ul className="grid gap-2 text-sm">
                    <li><a className="text-emerald-700 hover:text-emerald-800" href="#privacy-policy">Privacy Policy</a></li>
                    <li><a className="text-emerald-700 hover:text-emerald-800" href="#terms-of-service">Terms of Service</a></li>
                    <li><a className="text-emerald-700 hover:text-emerald-800" href="#cookies">Cookies</a></li>
                  </ul>
                </nav>
              </aside>

              {/* Sections */}
              <div className="lg:col-span-9 space-y-10">
                {/* Privacy Policy */}
                <section
          id="privacy-policy"
          aria-labelledby="privacy-heading"
          className="scroll-mt-28"
        >
                  <div className="p-[1px] rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]">
                    <div className="rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] font-semibold">
                        Privacy
                      </div>
                      <h2 id="privacy-heading" className="text-2xl font-semibold text-slate-900">
                        Privacy Policy
                      </h2>
                      <p className="mt-2 text-slate-600">
                        This Privacy Policy explains how {COMPANY} (“we,” “us,” or “our”) collects, uses,
                        and shares information when you use our websites, dashboards, and related services
                        (collectively, the “Services”).
                      </p>

                      <div className="mt-6 space-y-6 text-slate-700">
                        <div>
                          <h3 className="font-semibold text-slate-900">Information We Collect</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Contact &amp; account info</span> (e.g., name, email, company, role/title, seat/SSO identifiers).</li>
                            <li><span className="font-medium">Usage &amp; analytics data</span> (e.g., pages viewed, features used, device/browser data).</li>
                            <li><span className="font-medium">Survey &amp; research inputs</span> if you participate in our studies.</li>
                            <li><span className="font-medium">Support communications</span> (e.g., messages you send us).</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">How We Use Information</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>Provide, maintain, and improve the Services and dashboards.</li>
                            <li>Authenticate users (including optional SSO) and manage seat-based licensing.</li>
                            <li>Respond to inquiries, provide support, and communicate updates.</li>
                            <li>Analyze usage to enhance performance, security, and user experience.</li>
                            <li>Comply with legal obligations and enforce our Terms.</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">How We Share Information</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Service providers</span> that support hosting, analytics, communications, and security.</li>
                            <li><span className="font-medium">Enterprise SSO</span> providers (if enabled) to allow access with your company credentials.</li>
                            <li><span className="font-medium">Compliance &amp; legal</span> when required by law or to protect rights and safety.</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Your Choices &amp; Rights</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>
                              You can request access, correction, deletion, or a copy of your personal data by contacting{' '}
                              <a className="text-emerald-700 underline" href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
                            </li>
                            <li>
                              Manage cookie preferences via the cookie banner or your browser settings (see{' '}
                              <a className="text-emerald-700 underline" href="#cookies">Cookies</a>).
                            </li>
                            <li>
                              If you are in a region with specific privacy laws (e.g., GDPR/UK GDPR/CCPA/CPRA), you may have additional rights.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Data Security &amp; Retention</h3>
                          <p className="mt-2">
                            We use administrative, technical, and physical safeguards appropriate to the nature of the data.
                            We retain information for as long as needed to provide the Services and meet legal or contractual requirements.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">International Transfers</h3>
                          <p className="mt-2">
                            Your information may be processed in countries other than your own. Where required, we use appropriate
                            safeguards (e.g., SCCs) for cross-border transfers.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Contact</h3>
                          <p className="mt-2">
                            Questions about this policy? Email{' '}
                            <a className="text-emerald-700 underline" href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Terms of Service */}
                <section
          id="terms-of-service"
          aria-labelledby="terms-heading"
          className="scroll-mt-28"
        >
                  <div className="p-[1px] rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]">
                    <div className="rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-[11px] font-semibold">
                        Terms
                      </div>
                      <h2 id="terms-heading" className="text-2xl font-semibold text-slate-900">
                        Terms of Service
                      </h2>
                      <p className="mt-2 text-slate-600">
                        These Terms govern your use of the Services. By accessing or using the Services, you agree to these Terms.
                      </p>

                      <div className="mt-6 space-y-6 text-slate-700">
                        <div>
                          <h3 className="font-semibold text-slate-900">Accounts &amp; Access</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>
                              Access may be provided on a <span className="font-medium">seat-licensed</span> basis. Seats are for named users only and may not be shared.
                            </li>
                            <li>
                              Enterprise customers may enable <span className="font-medium">SSO</span>; your organization manages those credentials.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Acceptable Use</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>No unlawful, infringing, or harmful activity.</li>
                            <li>No attempts to bypass security, rate limits, or technical restrictions.</li>
                            <li>No automated scraping or bulk export that violates your license or our policies.</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Content &amp; IP</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>
                              {COMPANY} retains all rights to its research, datasets, dashboards, and marks. You receive a limited license as agreed in your order or master agreement.
                            </li>
                            <li>
                              Client-provided content remains the property of the client; you grant us the rights needed to provide the Services.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Confidentiality</h3>
                          <p className="mt-2">
                            Each party will protect the other’s confidential information and use it only as needed to provide or receive the Services.
                            Separate NDAs or MSAs may apply.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Disclaimers</h3>
                          <p className="mt-2">
                            The Services are provided “as is” without warranties of any kind. We do not guarantee that insights or outputs will meet your specific requirements or be error-free.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Limitation of Liability</h3>
                          <p className="mt-2">
                            To the maximum extent permitted by law, {COMPANY} is not liable for indirect, incidental, special, or consequential damages; our total liability is limited to the amounts paid for the Service during the 12 months preceding the claim.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Termination</h3>
                          <p className="mt-2">
                            We may suspend or terminate access for violations of these Terms. Your rights and obligations under any separate commercial agreement continue as stated in that agreement.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Changes</h3>
                          <p className="mt-2">
                            We may update these Terms from time to time. Material changes will be posted on this page with an updated date.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cookies */}
                <section id="cookies" aria-labelledby="cookies-heading" className="scroll-mt-28">
                  <div className="p-[1px] rounded-[1.05rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.25),transparent)]">
                    <div className="rounded-[1rem] bg-white ring-1 ring-gray-100 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-[11px] font-semibold">
                        Cookies
                      </div>
                      <h2 id="cookies-heading" className="text-2xl font-semibold text-slate-900">
                        Cookies &amp; Similar Technologies
                      </h2>
                      <p className="mt-2 text-slate-600">
                        We use cookies and similar technologies to provide and improve the Services, remember your preferences, and analyze usage.
                      </p>

                      <div className="mt-6 space-y-6 text-slate-700">
                        <div>
                          <h3 className="font-semibold text-slate-900">Types of Cookies</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li><span className="font-medium">Strictly necessary</span>: Required for core functionality and security (e.g., login, seat/SSO session).</li>
                            <li><span className="font-medium">Performance/analytics</span>: Help us understand usage to improve the Services.</li>
                            <li><span className="font-medium">Functional</span>: Remember preferences to personalize your experience.</li>
                            <li><span className="font-medium">Marketing</span>: Measure campaign performance and, where applicable, deliver relevant content.</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Managing Preferences</h3>
                          <p className="mt-2">
                            Use our cookie banner or your browser settings to control cookies. Blocking some cookies may impact site functionality.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">Third Parties</h3>
                          <p className="mt-2">
                            We may use trusted providers (e.g., analytics, form handling, security challenges) that set their own cookies per their policies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-slate-500">
                    For privacy inquiries, contact{' '}
                    <a className="text-emerald-700 underline" href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
                  </p>
                </section>
              </div>
            </div>

            {/* Divider + disclaimer */}
            <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="mt-6 text-xs text-slate-500">
              This page provides general information and is not legal advice. Your organization’s contracts or regional laws may impose additional terms.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

