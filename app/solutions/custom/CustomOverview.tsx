export default function CustomOverview() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Overview
          </h2>
          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            When syndicated data isn&apos;t enough, custom research fills the
            gaps.
          </h3>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            EcoFocus Custom Studies are built for leaders who need to move
            beyond &quot;what&apos;s generally true&quot; and uncover{" "}
            <span className="font-semibold text-emerald-200">
              what&apos;s true for their exact audience, category, and decision.
            </span>{" "}
            Whether you&apos;re navigating packaging changes, rethinking your
            sustainability messaging, or strengthening your employer brand, we
            design a study that puts reliable evidence behind your next move.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
          {/* Left column */}
          <div className="space-y-5 text-sm text-slate-200 sm:text-base">
            <p>
              Unlike generic research or one-off polls, our custom projects are
              built on top of{" "}
              <span className="font-semibold">
                13+ years of sustainability trend data
              </span>{" "}
              and a nationally representative 4,000-respondent study. Your
              proprietary questions are designed and interpreted in the context
              of what we already know about the Purpose-Driven Generation.
            </p>

            <p>
              We work with both{" "}
              <span className="font-semibold">B2C and B2B audiences</span> —
              consumers, shoppers, employees, job seekers, account holders, and
              stakeholders — to understand how sustainability values shape their
              expectations and decisions. The result: insights that speak the
              language of your category and your brand.
            </p>

            <p className="text-slate-300">
              Our role is simple: turn sustainability from something you{" "}
              <em>hope</em> resonates into something you can{" "}
              <span className="font-semibold text-emerald-200">prove</span>{" "}
              drives retention, loyalty, and growth.
            </p>
          </div>

          {/* Right column card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200 shadow-lg shadow-emerald-500/10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Where custom fits
            </p>
            <ul className="mt-3 space-y-3">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>
                  You have a{" "}
                  <span className="font-semibold">specific decision</span> to
                  make and need evidence for your board, leadership team, or
                  investors.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>
                  You need to know how{" "}
                  <span className="font-semibold">
                    your customers or employees
                  </span>{" "}
                  respond to sustainability, not just the general population.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>
                  You want to{" "}
                  <span className="font-semibold">
                    de-risk a change in packaging, claims, or positioning
                  </span>{" "}
                  before taking it to market.
                </span>
              </li>
            </ul>

            <p className="mt-4 text-xs text-slate-400">
              Every engagement starts with a no-cost discovery call where we
              clarify objectives, define what success looks like, and recommend
              the right custom research design for your needs and budget.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}





