//import Link from "next/link";

export default function AboutImpact() {
  return (
    <section className="relative section-slab-deep text-white" aria-labelledby="about-impact-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Benefits */}
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-[0_14px_48px_-18px_rgba(2,12,27,.45)]">
            <h3 id="about-impact-title" className="text-xl font-semibold">What partners gain</h3>
            <ul className="mt-4 space-y-3 text-white/85">
              {[
                "Audience clarity and growth opportunities",
                "Messaging that aligns values with value",
                "Roadmaps to close the say–do gap",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-[#FFC247]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Brief methodology note — not a wall of text */}
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-[0_14px_48px_-18px_rgba(2,12,27,.45)]">
            <h3 className="text-xl font-semibold">How our research works (in brief)</h3>
            <p className="mt-3 text-white/80">
              Insights draw on ongoing, nationally representative surveys of U.S. adults
              (balanced to U.S. Census demographics) plus deep category analysis.
            </p>
            {/* <p className="mt-3 text-sm text-white/70">
              Want details?{" "}
              <Link
                href="/methods"
                className="font-semibold text-[#FFC247] underline underline-offset-4 hover:text-amber-300"
              >
                View our methods
              </Link>
              .
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
}

