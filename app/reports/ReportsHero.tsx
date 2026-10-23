import Link from "next/link";

export default function ReportsHero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1116] text-white" aria-labelledby="reports-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.22),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">EcoFocus Research · Reports & insights</p>
        <h1 id="reports-title" className="mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
          Understand the consumer.<br />
          <span className="text-emerald-400">Move your business forward.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          Explore sustainability research on the attitudes, choices, and behaviors shaping your market.
          Find the insights to guide your next decision.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="#report-catalog" className="rounded-full bg-[#EF9601] px-6 py-3 font-semibold text-[#0B1116] transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">Explore reports</Link>
          <Link href="/contact" className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">Discuss your research needs</Link>
        </div>
        <div aria-hidden="true" className="mt-12 flex gap-2">
          <span className="h-1 w-16 rounded bg-[#213F97]" /><span className="h-1 w-16 rounded bg-emerald-500" /><span className="h-1 w-16 rounded bg-[#EF9601]" />
        </div>
      </div>
    </section>
  );
}
