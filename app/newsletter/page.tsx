// app/newsletter/page.tsx
import Link from "next/link";
import SubscribeStrip from "@/components/blog/SubscribeStrip";

export const metadata = {
  title: "Newsletter — EcoFocus Insights",
  description:
    "Actionable sustainability insight for marketers and brand leaders. Twice‑monthly, no fluff.",
};

export default function NewsletterPage() {
  return (
    <main id="main" className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg[linear-gradient(180deg,#070B0F_0%,#0A1015_55%,#0B1116_100%)] text-white">
        {/* soft brand glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -right-32 h-80 w-80 rounded-full bg-sky-500/25 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1 ring-white/15 text-emerald-200">
              EcoNuggets Newsletter
            </span>

            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
              Sustainability insight you can ship.
            </h1>
            <p className="mt-4 max-w-2xl text-white/85 text-lg">
              Twice‑monthly, fast reads for marketers and brand leaders. Get
              data‑backed consumer trends, proof points, and creative
              springboards drawn from EcoFocus research—so your next brief
              starts with evidence, not guesses.
            </p>

            <div className="mt-8 max-w-xl">
              <SubscribeStrip />
            </div>
            <p className="mt-3 text-sm text-white/70">
              We send 2×/month. No sponsors. Unsubscribe any time. See our
              <Link href="/privacy" className="ml-1 underline">Privacy Policy</Link>.
            </p>
          </div>

          {/* value bullets */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ValueCard
              title="Consumer sentiment snapshots"
              body="The moments that move Gen Z & Millennial purchase intent—decoded in plain English."
            />
            <ValueCard
              title="Message frameworks that convert"
              body="Where to lean (and what to skip) across claims like packaging, sourcing, and climate impact."
            />
            <ValueCard
              title="Proof points for decks"
              body="Charts and pull quotes you can drop straight into briefs, stakeholder updates, and client reviews."
            />
            <ValueCard
              title="Testing prompts"
              body="Hypotheses and A/B ideas that turn insight into results in your next sprint."
            />
            <ValueCard
              title="Early access"
              body="Invites to webinars, report previews, and occasional discount codes for new releases."
            />
            <ValueCard
              title="Zero fluff"
              body="Two emails a month. Clear takeaways. Measurable next steps."
            />
          </div>
        </div>

        {/* sheen line */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 animate-gradient" />
      </section>

      {/* BODY: social proof + FAQ + secondary form */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          {/* social proof / context */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-wide text-emerald-700">
              Built for brand, media, and insights teams
            </p>
            <p className="mt-2 text-gray-600">
              Join strategists, marketers, and sustainability communicators who use
              EcoFocus findings to sharpen briefs, validate claims, and develop
              creative that resonates with purpose‑driven consumers.
            </p>
          </div>

          {/* FAQ */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <FaqItem q="How often do you email?" a="Twice a month. We may occasionally send an invite to a webinar or a preview of a new report when it’s genuinely useful." />
            <FaqItem q="Who is it for?" a="Brand and agency teams (strategy, creative, media), insights leaders, and sustainability/CSR communicators." />
            <FaqItem q="Can I forward it to my team?" a="Absolutely. Please share—and include the signup link so teammates can subscribe directly." />
            <FaqItem q="What about my data?" a={<span>We only use your email to send the newsletter and understand aggregate engagement. You can unsubscribe anytime. See our <Link href="/privacy" className="underline">Privacy Policy</Link>.</span>} />
          </div>

          {/* Secondary signup */}
          <div className="mt-12">
            <div className="mx-auto max-w-xl">
              <SubscribeStrip />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------- UI Bits ------- */
function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ValueCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 text-white shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40">
          <CheckIcon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-semibold leading-6">{title}</h3>
          <p className="mt-1 text-sm text-white/85">{body}</p>
        </div>
      </div>
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


