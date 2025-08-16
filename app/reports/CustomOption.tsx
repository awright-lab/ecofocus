import Link from "next/link";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";

export default function CustomOption() {
  return (
    <section className="relative overflow-hidden py-16">
      {/* Subtle brand gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600" />

      {/* Soft texture blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />

      <div className="relative container mx-auto px-6 text-white">
        <div className="mx-auto max-w-3xl text-center">
          {/* Accent strip */}
          <div className="mx-auto mb-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300" />

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Need Something Custom?
          </h2>

          <p className="mt-3 text-white/90">
            Don’t see what you’re looking for? Let’s talk through your goals and
            build the right solution together.
          </p>

          {/* Small capability chips to add density */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
              <Sparkles className="h-4 w-4" /> Custom survey design
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
              <Sparkles className="h-4 w-4" /> Data integration
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
              <Sparkles className="h-4 w-4" /> Dashboard build-out
            </span>
          </div>

          {/* CTA group */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              <Calendar className="h-5 w-5" />
              Schedule discovery call
            </Link>

            <Link
              href="/custom"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/0 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Read more
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Fine print / reassurance */}
          <p className="mt-3 text-xs text-white/80">
            No hard sell — just a quick scoping chat to see what’s possible.
          </p>
        </div>
      </div>
    </section>
  );
}

