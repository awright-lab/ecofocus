import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      {/* Glow accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Ready to begin?
        </h2>

        <h3 className="mt-4 text-balance text-3xl font-semibold text-white sm:text-4xl">
          Let’s design a custom study that delivers clarity and confidence.
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          We’ll help you answer your most important sustainability questions
          with rigorous, evidence-backed research—built for your category, your
          audience, and your next strategic decision.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300 hover:shadow-emerald-400/40"
          >
            Schedule a discovery call
          </Link>

          <Link
            href="/resources/sample-custom-report"
            className="inline-flex rounded-full border border-slate-600 px-6 py-3 text-sm font-medium text-slate-200 hover:border-emerald-300 hover:text-emerald-200"
          >
            View sample deliverables
          </Link>
        </div>
      </div>
    </section>
  );
}

