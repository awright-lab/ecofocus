// app/newsletter/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscribeStrip from "@/components/blog/SubscribeStrip";
import Image from "next/image";

const SITE_URL = "https://ecofocusresearch.com";

export const metadata: Metadata = {
  title: "Newsletter — EcoFocus Insights",
  description:
    "Twice-monthly, fast reads for brand, strategy, and media teams. Data-backed trends, proof points, and creative springboards from EcoFocus.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: "Newsletter — EcoFocus Insights",
    description:
      "Twice-monthly, fast reads for brand, strategy, and media teams. Data-backed trends, proof points, and creative springboards from EcoFocus.",
    url: `${SITE_URL}/newsletter`,
    type: "website",
    siteName: "EcoFocus Research",
    images: [
      {
        url: `${SITE_URL}/images/og/og-default.png`,
        width: 1200,
        height: 630,
        alt: "EcoFocus Research Newsletter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsletter — EcoFocus Insights",
    description:
      "Twice-monthly, fast reads for brand, strategy, and media teams. Data-backed trends, proof points, and creative springboards from EcoFocus.",
    images: [`${SITE_URL}/images/og/og-default.png`],
  },
};

export default function NewsletterPage() {
  return (
    <>
      <Header />

      <main id="main" className="min-h-screen">
{/* MAGAZINE HERO — narrower plate, still full-bleed/cropped */}
<section className="relative overflow-hidden text-white bg-[linear-gradient(180deg,#0F1A22_0%,#11222C_55%,#142A35_100%)]">
  {/* soft brand glows */}
  <div aria-hidden className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
  <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

  {/* RIGHT PLATE (now ~50–54vw wide) */}
  <figure className="absolute inset-y-6 right-0 hidden md:block">
    <div className="relative h-full w-[50vw] lg:w-[52vw] xl:w-[54vw]">
      <div className="absolute inset-0 overflow-hidden rounded-l-3xl ring-1 ring-white/5 shadow-[0_30px_60px_rgba(0,0,0,.45)] bg-black/10">
        <Image
          src="/images/newsletter-bg.png"   // your asset
          alt="Macro tech-leaf texture representing sustainable innovation"
          fill
          priority
          className="object-cover object-[60%_50%] select-none"
        />
        {/* slightly narrower fade so more image shows */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-44 lg:w-48 bg-gradient-to-r from-[#0F1A22]/80 via-[#0F1A22]/35 to-transparent"
        />
      </div>
    </div>
  </figure>

  {/* CONTENT — match margins to the new plate width */}
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 min-h-[70vh] md:min-h-[78vh] flex items-center py-18 sm:py-18 lg:py-22 md:mr-[50vw] lg:mr-[52vw] xl:mr-[54vw]">
    <div className="w-full max-w-xl md:ml-auto md:translate-x-[1vw] lg:translate-x-[1.5vw]">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1 ring-white/15 text-emerald-200">
        EcoFocus Insights Newsletter
      </span>

      <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
        Sustainability Insights You{" "}
        <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
          Can Ship
        </span>
      </h1>

      <p className="mt-4 text-white/85 text-lg">
        Twice-monthly, fast reads for marketers and brand leaders. Get
        data-backed consumer trends, proof points, and creative springboards
        drawn from EcoFocus research—so your next brief starts with evidence,
        not guesses.
      </p>

      <div className="mt-8">
        <SubscribeStrip />
      </div>
    </div>
  </div>

  {/* MOBILE PLATE */}
  <figure className="md:hidden -mx-4 sm:-mx-6 mt-8">
    <div className="relative aspect-[4/3] rounded-2xl ring-1 ring-white/20 overflow-hidden shadow-2xl">
      <Image
        src="/images/newsletter-bg.png"
        alt="Macro tech-leaf texture representing sustainable innovation"
        fill
        priority
        className="object-cover object-center"
      />
    </div>
  </figure>

  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 animate-gradient" />
</section>





        {/* VALUE ROW (lightweight; keeps focus on signup) */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ValueCard
                title="Consumer sentiment, simplified"
                body="The moments that move Gen Z & Millennial purchase intent—decoded in plain English."
              />
              <ValueCard
                title="Proof points you can use"
                body="Charts and quotes for decks, briefs, and stakeholder updates—ready to drop in."
              />
              <ValueCard
                title="Ideas to test next"
                body="Message frameworks and A/B prompts that turn insight into performance."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ------- UI Bits ------- */
function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ValueCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          <CheckIcon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-semibold leading-6 text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{body}</p>
        </div>
      </div>
    </div>
  );
}





