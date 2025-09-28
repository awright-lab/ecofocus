import { LineChart, Target, Users } from "lucide-react";

function Card({
  icon,
  title,
  body,
}: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 p-6
                    shadow-[0_14px_48px_-18px_rgba(2,12,27,.45)] transition hover:-translate-y-0.5">
      <span className="absolute left-0 top-0 h-1 w-14 bg-[#FFC247]" aria-hidden />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-emerald-200 ring-1 ring-white/10">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-3 text-white/80">{body}</p>
    </div>
  );
}

export default function AboutApproach() {
  return (
    <section className="relative section-slab-emerald text-white" aria-labelledby="about-approach-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1 text-emerald-100 ring-1 ring-white/10">
            <Target className="h-4 w-4 opacity-80" />
            <span className="text-xs font-medium tracking-wide">Our approach</span>
          </div>
          <h2 id="about-approach-title" className="mt-4 text-3xl font-semibold">
            From signals to strategy
          </h2>
          <p className="mt-4 text-white/85">
            We combine nationally representative consumer research with clear storytelling and
            category expertise to turn sustainability data into decisions you can execute.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card
            icon={<Users className="h-5 w-5" />}
            title="Understand your audience"
            body="Identify who cares, why it matters, and where perceptions and behaviors diverge."
          />
          <Card
            icon={<LineChart className="h-5 w-5" />}
            title="Spot market shifts"
            body="Track emerging expectations and category signals before they impact your P&L."
          />
          <Card
            icon={<Target className="h-5 w-5" />}
            title="Move from intent to action"
            body="Translate insights into product, messaging, and portfolio choices that build trust."
          />
        </div>
      </div>
    </section>
  );
}

