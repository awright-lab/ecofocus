import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

const pdf = "/EcoFocus_GPI_Case_Study_Final.pdf";
const title = "Glass Packaging Institute Case Study";
const description = "How EcoFocus helped the Glass Packaging Institute turn consumer evidence into a stronger business case for glass packaging.";

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

const findings = [
  { value: "59%", label: "Chemical reassurance", text: "say glass is the only food and beverage packaging where they do not have to worry about chemicals." },
  { value: "64%", label: "Unmet demand", text: "wish more food and beverages were available in glass." },
  { value: "49%", label: "Brand-switching risk", text: "would leave a preferred brand entirely if it switched from glass to plastic." },
  { value: "42%", label: "Packaging preference", text: "of packaging-influenced shoppers were specifically looking for glass — the most sought material tested." },
];

const approach = [
  { title: "Longitudinal tracking", text: "Research conducted since 2010 helped GPI distinguish enduring consumer preferences from emerging shifts." },
  { title: "Custom GPI questions", text: "Questions explored brand associations, switching behavior, natural and organic expectations, and the role of packaging in recent purchases." },
  { title: "Action-oriented analysis", text: "Findings became audience priorities, category opportunities, ready-to-use talking points and communications recommendations." },
];

const strategies = [
  { title: "Lead with health", text: "Health reasons influenced purchase decisions more consistently than environmental reasons. The report recommended leading with safety and chemical reassurance before broader sustainability language." },
  { title: "Make switching risk visible", text: "Moving away from glass can expose brands to customer loss, demands for lower prices and weakened trust. Packaging decisions have consequences beyond procurement." },
  { title: "Target shopping behavior", text: "Frequent organic food and functional beverage buyers emerged as especially receptive audiences. Shopping behavior proved more predictive than demographics alone." },
  { title: "Match the channel to the audience", text: "Social media stood out for frequent organic and functional beverage buyers and younger consumers. Packaging and labels remained especially important among older consumers." },
];

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
              Turning consumer evidence into a{" "}
              <span className="brand-gradient-text animate-gradient motion-reduce:!animate-none">
                stronger business case for glass.
              </span>
            </>
          }
          subhead="Consumer intelligence the Glass Packaging Institute can use to influence packaging decisions, protect demand and strengthen the business case for glass."
          videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
          overlay="dense"
          ctaPrimary={{ label: "Explore the findings", href: "#findings" }}
          ctaSecondary={{ label: "Get the 6-page case study", href: "#download" }}
        />

        <section aria-label="Study at a glance" className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
              <Link href="/" className="hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">Home</Link>
              <span aria-hidden="true" className="mx-3">/</span>
              <span aria-current="page">GPI case study</span>
            </nav>
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_3fr]">
              <Image src="/images/logos/Site_GPI Logo 2_0.png" alt="Glass Packaging Institute" width={300} height={120} className="h-20 w-full object-contain lg:object-left" />
              <dl className="grid gap-6 sm:grid-cols-3">
                <div><dt className="text-xs uppercase tracking-wider text-slate-500">Research base</dt><dd className="mt-2 text-2xl font-semibold">4,046<span className="mt-1 block text-sm font-normal text-slate-600">U.S. adults, age 18+</span></dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-slate-500">Client deliverable</dt><dd className="mt-2 text-xl font-semibold">Strategic research report</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-slate-500">Fieldwork</dt><dd className="mt-2 text-xl font-semibold">May 28–June 14, 2026</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section aria-labelledby="challenge-title" className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">The challenge</p>
            <h2 id="challenge-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">More than favorable statistics. Evidence that moves decisions.</h2>
            <p className="mt-5 leading-relaxed text-slate-600">GPI needed a repeatable consumer measurement system to help members influence real packaging decisions, support public communications and reinforce glass as a premium, trusted choice.</p>
            <p className="mt-4 leading-relaxed text-slate-600">The research needed to show where consumers prefer glass, how packaging influences purchases, and what happens when brands switch to plastic or cans.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-brand-tint-emerald p-7 sm:p-9">
            <h3 className="text-xl font-semibold">What GPI needed the research to do</h3>
            <ul className="mt-6 space-y-4">
              {[
                "Deliver credible evidence for conversations with brand partners.",
                "Connect glass with health, quality, trust and environmental responsibility.",
                "Quantify loyalty and switching risk when brands move away from glass.",
                "Identify priority audiences, categories and communications channels.",
                "Create an ongoing source of PR, thought leadership and member content.",
              ].map((text) => <li key={text} className="flex gap-3 text-sm leading-relaxed text-slate-700"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />{text}</li>)}
            </ul>
          </div>
        </section>

        <section aria-labelledby="approach-title" className="bg-brand-tint-blue bg-grid-soft">
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">The EcoFocus approach</p>
            <h2 id="approach-title" className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Designed around the decisions GPI needed to influence.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {approach.map((item, i) => <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><span className="text-sm font-semibold text-emerald-600">0{i + 1}</span><h3 className="mt-5 text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p></div>)}
            </div>
            <p className="mt-7 text-sm leading-relaxed text-slate-600"><strong className="text-slate-900">Methodology:</strong> Nationally representative online survey of 4,046 U.S. adults age 18+, balanced to the U.S. Census. Reported margin of error: ±1.55%.</p>
          </div>
        </section>

        <section id="findings" aria-labelledby="findings-title" className="section-slab-deep scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">What the research revealed</p>
            <h2 id="findings-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Consumer preference. Commercial implications.</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {findings.map((item) => <div key={item.value} className="rounded-2xl border border-white/15 bg-white/5 p-6"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">{item.label}</p><p className="mt-5 text-5xl font-semibold tracking-tight text-white">{item.value}</p><p className="mt-4 text-sm leading-relaxed text-slate-300">{item.text}</p></div>)}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-slate-400">Source: EcoFocus Research 2026 Syndicated Study, Consumer Attitudes &amp; Behaviors on Glass Packaging, prepared for GPI. Findings reflect consumer perceptions and stated intentions.</p>
          </div>
        </section>

        <section aria-labelledby="strategy-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">From findings to strategy</p>
          <h2 id="strategy-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">A clearer path from insight to action.</h2>
          <div className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
            {strategies.map((item) => <div key={item.title} className="border-l-2 border-emerald-500 pl-6"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 leading-relaxed text-slate-600">{item.text}</p></div>)}
          </div>
        </section>

        <section aria-labelledby="deliverable-title" className="bg-brand-tint-emerald">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Built for activation</p>
              <h2 id="deliverable-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">A research report built to be used.</h2>
              <p className="mt-5 leading-relaxed text-slate-600">GPI received a 73-page strategic research report. The six-page case study available here summarizes the approach, findings and value. The client report combined consumer data, trend and subgroup analysis, category implications, communications guidance and ready-to-use business language for researchers and non-research stakeholders alike.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {["Nine themed chapters, from chemical safety to strategic recommendations", "Trend and generational views", "Behavior-based audience analysis", "Talking points for marketing, procurement, packaging, R&D and executives", "A full data appendix with question wording and significance testing"].map((text) => <li key={text} className="flex gap-3"><ArrowRight size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-600" />{text}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm sm:p-9">
              <h3 className="text-xl font-semibold">The value created for GPI</h3>
              <dl className="mt-6 space-y-5">
                {[
                  ["Credibility", "Independent, nationally representative evidence for consumer preference, trust and purchase behavior."],
                  ["Commercial relevance", "A clear connection between consumer attitudes, switching risk, unmet demand and business decisions."],
                  ["Communications utility", "Practical language for presentations, memos, member outreach and media."],
                  ["Long-term intelligence", "A biennial framework to track change and keep member conversations current."],
                ].map(([label, text]) => <div key={label}><dt className="font-semibold text-emerald-800">{label}</dt><dd className="mt-1 text-sm leading-relaxed text-slate-600">{text}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>

        <section aria-label="Client testimonial" className="section-slab-emerald">
          <figure className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20">
            <blockquote className="text-2xl font-medium leading-relaxed sm:text-3xl">“EcoFocus gave us more than data. They gave us a credible, consumer-backed story that we and our members can use in conversations with brands, policymakers and the marketplace.”</blockquote>
            <figcaption className="mt-7 text-sm text-emerald-100"><span className="font-semibold text-white">Scott DeFife</span><br />President, Glass Packaging Institute</figcaption>
          </figure>
        </section>

        <section id="download" aria-labelledby="download-title" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="grid gap-8 rounded-2xl border border-slate-200 bg-slate-50 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div><FileText size={28} aria-hidden="true" className="mb-4 text-emerald-600" /><h2 id="download-title" className="text-2xl font-semibold">Take the full case study with you.</h2><p className="mt-3 max-w-xl leading-relaxed text-slate-600">Explore the research approach, findings and business value in the original six-page PDF.</p></div>
            <div className="flex flex-col gap-3">
              <a href={pdf} download className="btn-primary-emerald gap-2"><Download size={17} aria-hidden="true" /> Download the 6-page case study (PDF)</a>
              <a href={pdf} target="_blank" rel="noopener noreferrer" className="btn-secondary-light">View PDF in a new tab</a>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <iframe
              src="/gpi-reader/index.html?embed=1"
              title="Read the six-page Glass Packaging Institute case study"
              width="100%"
              height="760"
              className="block h-[720px] w-full border-0 sm:h-[760px]"
              loading="lazy"
              allow="fullscreen"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Turn pages with the arrows or swipe, zoom in for a closer look, or use the PDF links above.
            The reader displays page images; text within them is not selectable or screen-reader readable.
          </p>
          <div className="mt-16 max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn sustainability intelligence into <span className="brand-gradient-text animate-gradient motion-reduce:!animate-none">market advantage.</span></h2>
            <p className="mt-5 leading-relaxed text-slate-600">Talk with EcoFocus about the business questions you need to answer. We combine nationally representative consumer research with deep sustainability and packaging expertise to turn evidence into clear action.</p>
            <Link href="/contact" className="btn-primary-emerald mt-7 gap-2">Book a discovery call <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
