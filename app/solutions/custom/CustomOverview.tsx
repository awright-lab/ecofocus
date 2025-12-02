"use client";

interface OverviewCardProps {
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

function OverviewCard({ title, description, iconBg, iconColor }: OverviewCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
        <span className={`text-xl ${iconColor}`}>✔</span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function CustomOverview() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Tag */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Custom Research Overview
          </span>
        </div>

        {/* Header */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              What Custom Studies
              <span className="block text-emerald-500">Deliver</span>
            </h2>
          </div>

          <p className="text-slate-600 text-base leading-relaxed">
            EcoFocus Custom Studies provide deeper, tailored insights where 
            syndicated data can’t go — revealing how your exact consumers, 
            employees, or stakeholders think about sustainability, packaging, 
            messaging, and corporate responsibility.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title="Messaging & Claims Clarity"
            description="Identify which sustainability claims move the needle and which trigger skepticism, helping you de-risk communication."
          />

          <OverviewCard
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            title="Audience-Specific Insights"
            description="Understand how your category segments—consumers, shoppers, or workforce—interpret your sustainability actions."
          />

          <OverviewCard
            iconBg="bg-teal-100"
            iconColor="text-teal-600"
            title="Packaging & Label Testing"
            description="Evaluate material choices, recyclability cues, and label elements that drive pickup and brand trust."
          />

          <OverviewCard
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Employer Brand & EVP Signals"
            description="Measure how sustainability influences talent attraction, retention, and workforce engagement."
          />

          <OverviewCard
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            title="Regional or Demographic Variation"
            description="Reveal how sustainability expectations shift by age, region, or shopper type—ensuring your messaging resonates locally."
          />

          <OverviewCard
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title="Concept & Innovation Validation"
            description="Test early product ideas and understand how sustainability impacts purchase intent or brand perception."
          />
        </div>
      </div>
    </section>
  );
}






