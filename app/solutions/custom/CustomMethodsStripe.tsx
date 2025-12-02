"use client";

import {
  BarChart3,
  Users,
  Gauge,
  CalendarDays
} from "lucide-react";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  bg: string;
}

function StatCard({ icon: Icon, value, label, bg }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-sm flex flex-col justify-center ring-1 ring-black/5 ${bg}`}
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
        <Icon className="h-5 w-5 text-white/90" />
      </div>

      <p className="text-white text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-white/80 text-sm">{label}</p>
    </div>
  );
}

export default function CustomMethodologyStripe() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Background & Methodology Snapshot
        </h2>

        <p className="mt-2 text-slate-600 max-w-3xl mx-auto text-sm sm:text-base">
          Custom Studies use rigorous sampling and research design grounded in our 
          sustainability expertise — ensuring accuracy, representativeness, and 
          decision-ready clarity for your category.
        </p>

        {/* Cards */}
        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={BarChart3}
            value="4–8 Weeks"
            label="Typical Field & Analysis"
            bg="bg-emerald-600"
          />

          <StatCard
            icon={Users}
            value="N = Custom"
            label="Audience-Specific Sample"
            bg="bg-slate-900"
          />

          <StatCard
            icon={Gauge}
            value="Flexible"
            label="Quant / Qual / Hybrid Designs"
            bg="bg-amber-500"
          />

          <StatCard
            icon={CalendarDays}
            value="2025"
            label="Latest Method Framework Update"
            bg="bg-teal-600"
          />

        </div>
      </div>
    </section>
  );
}



