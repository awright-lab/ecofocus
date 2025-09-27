// app/newsletter/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";   // adjust path if needed
import Footer from "@/components/Footer";   // adjust path if needed
import SubscribeStrip from "@/components/blog/SubscribeStrip";

export const metadata: Metadata = {
  title: "Newsletter — EcoFocus Insights",
  description:
    "Twice-monthly, fast reads for brand, strategy, and media teams. Data-backed trends, proof points, and creative springboards from EcoFocus.",
};

export default function NewsletterPage() {
  return (
    <>
      <Header />

      <main id="main" className="min-h-screen">
        {/* HERO (brighter + centered, left-aligned text) */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0B1319_0%,#0E1821_55%,#101E28_100%)] text-white">
          {/* soft brand glows (slightly brighter) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-32 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 min-h-[72vh] md:min-h-[78vh] flex items-center py-16 sm:py-20 lg:py-24">
            {/* block is centered in viewport but stays left-aligned */}
            <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] tracking-wide mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-emerald-300">EcoFocus Insights Newsletter</span>
          </span>
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                Sustainability Insights You Can <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8]">Ship</span>
              </h1>

              <p className="mt-4 max-w-2xl text-white/85 text-lg">
                Twice-monthly, fast reads for marketers and brand leaders. Get
                data-backed consumer trends, proof points, and creative
                springboards drawn from EcoFocus research—so your next brief
                starts with evidence, not guesses.
              </p>

              {/* ONE form — wired via your SubscribeStrip (HubSpot) */}
              <div className="mt-8 max-w-xl">
                <SubscribeStrip />
              </div>
            </div>
          </div>

          {/* sheen line */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 animate-gradient" />
        </section>

        {/* VALUE ROW (light, brand-aligned) */}
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




