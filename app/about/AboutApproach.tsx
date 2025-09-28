// components/about/AboutApproach.tsx
import { LineChart, Target, Users } from "lucide-react";

function ApproachCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="pointer-events-none absolute left-0 top-0 h-1 w-16 bg-[#FFC247]" />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-emerald-900">{title}</h3>
      </div>
      <p className="mt-3 text-emerald-900/80">{body}</p>
    </div>
  );
}

export default function AboutApproach() {
  return (
    <section className="relative bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-white px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium tracking-wide">Our approach</span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-emerald-900">
            From signals to strategy
          </h2>
          <p className="mt-4 text-emerald-900/80">
            We combine nationally representative consumer research with clear storytelling
            and category expertise to turn sustainability data into decisions you can execute.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ApproachCard
            icon={<Users className="h-5 w-5" />}
            title="Understand your audience"
            body="Identify who cares, why it matters, and where perceptions and behaviors diverge."
          />
          <ApproachCard
            icon={<LineChart className="h-5 w-5" />}
            title="Spot market shifts"
            body="Track emerging expectations and category signals before they impact your P&L."
          />
          <ApproachCard
            icon={<Target className="h-5 w-5" />}
            title="Move from intent to action"
            body="Translate insights into product, messaging, and portfolio choices that build trust."
          />
        </div>
      </div>
    </section>
  );
}
