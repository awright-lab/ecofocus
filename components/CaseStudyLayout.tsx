import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

// Keep case-specific content here so future case studies can share this layout.
export type CaseStudyContent = {
  client: string;
  shortName: string;
  headline: { lead: string; emphasis: string };
  summary: string;
  logo: { src: string; alt: string };
  facts: { label: string; value: string }[];
  overview: string;
  approach: { title: string; text: string };
  methodology: { description: string; facts: { label: string; value: string }[]; note: string };
  document: { href: string; pages: number; readerSrc: string };
  testimonial?: { quote: string; name: string; role: string };
};

export default function CaseStudyLayout({ study }: { study: CaseStudyContent }) {
  return (
    <>
      <Header />
      <main id="main" className="bg-white pt-14 text-slate-900 md:pt-20">
        <Hero
          variant="solutions"
          size="normal"
          badge="Research in action · Case study"
          headline={<>{study.headline.lead}{" "}<span className="brand-gradient-text animate-gradient motion-reduce:!animate-none">{study.headline.emphasis}</span></>}
          subhead={study.summary}
          videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
          overlay="dense"
          ctaPrimary={{ label: "Read the case study", href: "#case-study" }}
        />

        <section aria-label="Study at a glance" className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
              <Link href="/" className="hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">Home</Link>
              <span aria-hidden="true" className="mx-3">/</span>
              <span aria-current="page">{study.shortName} case study</span>
            </nav>
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_3fr]">
              <Image src={study.logo.src} alt={study.logo.alt} width={300} height={120} className="h-20 w-full object-contain lg:object-left" />
              <dl className="grid gap-6 sm:grid-cols-3">
                {study.facts.map((fact) => <div key={fact.label}><dt className="text-xs uppercase tracking-wider text-slate-500">{fact.label}</dt><dd className="mt-2 text-lg font-semibold">{fact.value}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>

        <section id="case-study" aria-label={`${study.client} case study reader`} className="scroll-mt-24 mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <iframe
              src={study.document.readerSrc}
              title={`Read the ${study.document.pages}-page ${study.client} case study`}
              width="100%"
              height="760"
              className="block h-[720px] w-full border-0 sm:h-[760px]"
              loading="lazy"
              allow="fullscreen"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Use the arrows or swipe to turn pages. Page text is displayed as images and is not selectable or screen-reader readable. Open or download the original PDF from the reader toolbar.</p>
          <noscript><p className="mt-3 text-sm"><a href={study.document.href} className="underline">Read the original case study PDF</a></p></noscript>
        </section>

        <section id="overview" aria-label="Case study overview" className="scroll-mt-24 mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 md:py-20">
          <div className="rounded-2xl border border-blue-100 bg-brand-tint-blue p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">The research need</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:min-h-[4.5rem]">Research in context</h2>
            <p className="mt-5 leading-relaxed text-slate-600">{study.overview}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-brand-tint-emerald p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">The EcoFocus approach</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:min-h-[4.5rem]">{study.approach.title}</h2>
            <p className="mt-5 leading-relaxed text-slate-600">{study.approach.text}</p>
          </div>
        </section>

        <section id="methodology" aria-labelledby="methodology-title" className="bg-brand-tint-blue bg-grid-soft">
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">The research foundation</p>
            <h2 id="methodology-title" className="mt-4 text-3xl font-semibold tracking-tight">Methodology</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-slate-600">{study.methodology.description}</p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {study.methodology.facts.map((fact) => <div key={fact.label} className="border-l-2 border-emerald-500 pl-5"><dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{fact.label}</dt><dd className="mt-2 text-lg font-semibold text-slate-900">{fact.value}</dd></div>)}
            </dl>
            <p className="mt-6 text-sm text-slate-500">{study.methodology.note}</p>
          </div>
        </section>


        {study.testimonial ? (
          <section aria-label="Client testimonial" className="section-slab-emerald">
            <figure className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20">
              <blockquote className="text-2xl font-medium leading-relaxed sm:text-3xl">“{study.testimonial.quote}”</blockquote>
              <figcaption className="mt-7 text-sm text-emerald-100"><span className="font-semibold text-white">{study.testimonial.name}</span><br />{study.testimonial.role}</figcaption>
            </figure>
          </section>
        ) : null}

        <section aria-labelledby="contact-title" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
          <div className="max-w-3xl">
            <h2 id="contact-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn sustainability intelligence into <span className="brand-gradient-text animate-gradient motion-reduce:!animate-none">market advantage.</span></h2>
            <p className="mt-5 leading-relaxed text-slate-600">Talk with EcoFocus about the business questions you need to answer. We combine nationally representative consumer research with deep sustainability and packaging expertise to turn evidence into clear action.</p>
          </div>
          <Link href="/contact" className="btn-primary-emerald justify-self-start gap-2 lg:justify-self-end">Book a discovery call <ArrowRight size={17} aria-hidden="true" /></Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
