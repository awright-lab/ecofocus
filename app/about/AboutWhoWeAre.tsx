// components/about/AboutWhoWeAre.tsx
import { Leaf } from "lucide-react";

export default function AboutWhoWeAre() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
              <Leaf className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wide">Who we are</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-emerald-900">
              Shaping tomorrow with sustainable insights
            </h2>
            <p className="mt-4 text-emerald-900/80">
              Since 2010, EcoFocus has studied how U.S. consumers think about
              sustainability and how those beliefs influence the choices they make.
              We translate that understanding into practical guidance so your brand
              can earn trust, close the say-do gap, and grow with purpose.
            </p>
            <ul className="mt-6 space-y-3 text-emerald-900/85">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 flex-none rounded-full bg-[#FFC247]" />
                Evidence-based, human-centered research
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 flex-none rounded-full bg-[#FFC247]" />
                Clear frameworks to move from intent to action
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 flex-none rounded-full bg-[#FFC247]" />
                Practical recommendations aligned to your category
              </li>
            </ul>
          </div>

          {/* Quote card */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FFC247]/20 blur-2xl" />
            <blockquote className="relative">
              <p className="text-xl font-medium text-emerald-900">
                “Sustainability isn’t a trend—it’s a decision filter. We help teams
                see what matters to consumers and act on it with confidence.”
              </p>
              <footer className="mt-4 text-sm text-emerald-800/75">
                EcoFocus Research
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
