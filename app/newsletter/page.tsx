// app/newsletter/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscribeStrip from "@/components/blog/SubscribeStrip";
import Image from "next/image";

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
{/* MAGAZINE HERO — full-bleed plate on the right (not a background) */}
<section className="relative overflow-hidden text-white bg-[linear-gradient(180deg,#0F1A22_0%,#11222C_55%,#142A35_100%)]">
  {/* soft brand glows */}
  <div aria-hidden className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
  <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

  {/* RIGHT PLATE (full-bleed to edge, with ring + shadow + edge line) */}
  <figure className="absolute inset-y-6 right-0 hidden md:block">
    <div className="relative h-full w-[58vw] lg:w-[60vw] xl:w-[62vw]">
      <div className="absolute inset-0 overflow-hidden rounded-l-3xl ring-1 ring-white/15 shadow-[0_30px_60px_rgba(0,0,0,.45)] bg-black/10">
        <Image
          src="/images/newsletter-bg.png"  // <- your asset
          alt="Macro tech-leaf texture representing sustainable innovation"
          fill
          priority
          className="object-cover object-[65%_50%] select-none"
        />
        {/* left fade for copy legibility */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-[#0F1A22]/80 via-[#0F1A22]/35 to-transparent"
        />
      </div>
      {/* slim accent line on the plate’s left edge */}
      <div
        aria-hidden
        className="absolute -left-px top-0 h-full w-[2px] bg-gradient-to-b from-emerald-400 via-teal-300 to-sky-400 opacity-60"
      />
    </div>
  </figure>

  {/* CONTENT — left column; keep left-aligned, reserve space for plate */}
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 min-h-[70vh] md:min-h-[78vh] flex items-center py-14 sm:py-18 lg:py-22 md:pr-[60vw]">
    <div className="w-full max-w-xl">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1 ring-white/15 text-emerald-200">
        EcoFocus Insights Newsletter
      </span>

      <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
        Sustainability Insights You{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
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

  {/* MOBILE PLATE (stacks below, still a card so it doesn’t feel like the bg) */}
  <figure className="md:hidden -mx-4 sm:-mx-6 mt-8">
    <div className="relative aspect-[4/3] rounded-2xl ring-1 ring-white/20 overflow-hidden shadow-2xl">
      <Image
        src="/images/newsletter/magazine-hero.jpg"
        alt="Macro tech-leaf texture representing sustainable innovation"
        fill
        priority
        className="object-cover object-center"
      />
    </div>
  </figure>

  {/* brand accent line */}
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





