// components/about/AboutCta.tsx
import Link from "next/link";

export default function AboutCta() {
  return (
    <section className="relative bg-emerald-950">
      <div
        className="absolute inset-0 opacity-20"
        aria-hidden
        style={{
          background:
            "radial-gradient(40rem 30rem at 15% -10%, rgba(16,185,129,0.25), transparent 60%), radial-gradient(32rem 24rem at 110% -20%, rgba(59,130,246,0.25), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 relative">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFC247]/20 px-3 py-1 text-xs font-semibold text-[#FFC247] ring-1 ring-[#FFC247]/30">
            Ready to act
          </div>
          <h3 className="text-2xl font-semibold text-white">
            Bring sustainability insights into your next decision
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-[#FFC247] px-5 py-3 text-sm font-semibold text-emerald-950 shadow hover:translate-y-px hover:shadow-md transition"
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
