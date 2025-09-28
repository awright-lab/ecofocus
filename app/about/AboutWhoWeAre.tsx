// Dark slab like your homepage sections, with compact card tone
import { Leaf } from "lucide-react";

export default function AboutWhoWeAre() {
  return (
    <section className="relative section-slab-deep text-white" aria-labelledby="about-who-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1 text-emerald-200 ring-1 ring-white/10">
              <Leaf className="h-4 w-4 opacity-80" />
              <span className="text-xs font-medium tracking-wide">Who we are</span>
            </div>
            <h2 id="about-who-title" className="mt-4 text-3xl font-semibold">
              Shaping tomorrow with sustainable insights
            </h2>
            <p className="mt-4 text-white/80">
              Since 2010, EcoFocus has studied how U.S. consumers think about sustainability and
              how beliefs turn into choices. We give teams practical guidance to earn trust,
              close the say–do gap, and grow with purpose.
            </p>
            <ul className="mt-6 space-y-3 text-white/85">
              {[
                "Evidence-based, human-centered research",
                "Clear frameworks to move from intent to action",
                "Category-specific recommendations that ship",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-[#FFC247]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* On-brand card */}
          <div className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-[0_14px_48px_-18px_rgba(2,12,27,.45)]">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#FFC247]/15 blur-2xl" />
            <blockquote className="relative">
              <p className="text-xl font-medium">
                “Sustainability isn’t a trend—it’s a decision filter. We help teams see what matters
                to consumers and act on it with confidence.”
              </p>
              <footer className="mt-4 text-sm text-white/70">EcoFocus Research</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

