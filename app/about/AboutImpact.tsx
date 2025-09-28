// components/about/AboutImpact.tsx
import Link from "next/link";

export default function AboutImpact() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Benefits */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-900">What partners gain</h3>
            <ul className="mt-4 space-y-3 text-emerald-900/85">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 flex-none rounded-full bg-[#FFC247]" />
                Audience clarity and growth opportunities
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 flex-none rounded-full bg-[#FFC247]" />
                Messaging that aligns values with value
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 flex-none rounded-full bg-[#FFC247]" />
                Roadmaps to close the “say-do” gap
              </li>
            </ul>
          </div>

          {/* Brief methodology note */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-900">
              How our research works (in brief)
            </h3>
            <p className="mt-3 text-emerald-900/80">
              Our insights draw on ongoing, nationally representative surveys of U.S. adults
              (balanced to U.S. Census demographics) and deep category analysis. Each wave is
              designed to illuminate evolving attitudes and real-world behaviors related to sustainability.
            </p>
            <p className="mt-3 text-sm text-emerald-900/60">
              Looking for the full methodology?
              {" "}
              <Link
                href="/methods"
                className="font-semibold text-emerald-800 underline decoration-[#FFC247] underline-offset-4 hover:text-emerald-900"
              >
                View our methods overview
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
