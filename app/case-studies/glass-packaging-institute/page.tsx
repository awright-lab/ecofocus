import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

const pdf = "/EcoFocus_GPI_Case_Study_Final.pdf";
const title = "Glass Packaging Institute | Case Study 2026";
const description = "Explore the Glass Packaging Institute 2026 case study and how EcoFocus helped GPI understand consumer attitudes toward glass packaging.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/case-studies/glass-packaging-institute" },
  openGraph: {
    title,
    description,
    url: "/case-studies/glass-packaging-institute",
    type: "article",
    images: [{ url: "/images/og/og-default.png", width: 1200, height: 630, alt: "EcoFocus Research" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og/og-default.png"] },
};

export default function GlassPackagingCaseStudy() {
  return (
    <>
      <Header />
      <main id="main" className="bg-white pt-14 text-slate-900 md:pt-20">
        <Hero
          variant="solutions"
          size="normal"
          badge="Research in action · Case study"
          headline={
            <>
              <span className="block">Glass Packaging Institute</span>
              <span className="block brand-gradient-text animate-gradient motion-reduce:!animate-none">
                Case Study 2026
              </span>
            </>
          }
          videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
          overlay="dense"
        />

        <section aria-label="Client testimonial" className="section-slab-emerald">
          <figure className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20">
            <blockquote className="text-2xl font-medium leading-relaxed sm:text-3xl">“EcoFocus gave us more than data. They gave us a credible, consumer-backed story that we and our members can use in conversations with brands, policymakers and the marketplace.”</blockquote>
            <figcaption className="mt-7 text-sm text-emerald-100"><span className="font-semibold text-white">Scott DeFife</span><br />President, Glass Packaging Institute</figcaption>
          </figure>
        </section>

        <section aria-label="Read the case study" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
              <h2 className="text-base font-semibold">Glass Packaging Institute · Case Study 2026</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a href={pdf} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-900">Open PDF in a new tab</a>
                <a href={pdf} download className="btn-primary-emerald gap-2"><Download size={16} aria-hidden="true" /> Download PDF</a>
              </div>
            </div>
            <iframe
              src={`${pdf}#view=FitH`}
              title="Glass Packaging Institute Case Study 2026 PDF"
              className="h-[70vh] min-h-[480px] w-full border-0 md:h-[850px]"
              loading="lazy"
            />
          </div>
          <p className="mt-3 text-sm text-slate-500">If the document does not display in your browser, use the link above to open or download the PDF.</p>
        </section>

        <section aria-label="Research context and approach" className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 md:grid-cols-2 md:pb-16">
          <article className="rounded-2xl border border-sky-100 bg-brand-tint-blue p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">The research need</p>
            <h2 className="mt-4 text-2xl font-semibold">Research in context</h2>
            <p className="mt-5 leading-relaxed text-slate-600">GPI needed a clearer picture of how consumers view glass packaging to inform member conversations and communications.</p>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-brand-tint-emerald p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">The EcoFocus approach</p>
            <h2 className="mt-4 text-2xl font-semibold">Research built around the right questions</h2>
            <p className="mt-5 leading-relaxed text-slate-600">EcoFocus combined consumer research with custom questions for GPI, exploring packaging preferences, brand associations and the role of packaging in purchase decisions.</p>
          </article>
        </section>

        <section aria-labelledby="contact-title" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20">
          <div className="flex flex-col gap-8 border-b border-emerald-200 pb-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 id="contact-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn sustainability intelligence into <span className="brand-gradient-text animate-gradient motion-reduce:!animate-none">market advantage.</span></h2>
              <p className="mt-5 leading-relaxed text-slate-600">Talk with EcoFocus about the business questions you need to answer. We combine nationally representative consumer research with deep sustainability and packaging expertise to turn evidence into clear action.</p>
            </div>
            <Link href="/contact" className="btn-primary-emerald shrink-0 self-start gap-2 md:self-auto">Book a discovery call <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
