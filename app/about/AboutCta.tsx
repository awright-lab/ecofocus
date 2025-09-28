import Link from "next/link";

export default function AboutCta() {
  return (
    <section className="relative section-slab-emerald text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFC247]/20 px-3 py-1 text-xs font-semibold text-[#FFC247] ring-1 ring-[#FFC247]/30">
            Ready to act
          </div>
          <h3 className="text-2xl font-semibold">Bring sustainability insights into your next decision</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-[#FFC247] px-5 py-3 text-sm font-semibold text-emerald-950 shadow hover:translate-y-px transition"
            >
              Start a conversation
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/0 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Browse our latest reports
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

