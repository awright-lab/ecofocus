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
      className={`rounded-2xl p-6 shadow-sm ring-1 ring-black/5 ${bg}`}
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 mb-4">
        <Icon className="h-5 w-5 text-white/90" />
      </div>

      <p className="text-white text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-white/80 text-sm">
        {label}
      </p>
    </div>
  );
}

export default function MethodologySnapshot() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Background & Methodology Snapshot
        </h2>

        <p className="mt-2 text-slate-600 max-w-3xl mx-auto text-sm sm:text-base">
          Custom Studies are built on rigorous sampling, methodological precision,
          and sustainability expertise—ensuring accurate, decision-ready insights.
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
            label="Latest Framework Update"
            bg="bg-teal-600"
          />

        </div>
      </div>
    </section>
  );
}




