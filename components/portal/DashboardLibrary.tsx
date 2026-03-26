"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import { DashboardCard } from "@/components/portal/DashboardCard";
import { EmptyState } from "@/components/portal/EmptyState";
import type { PortalDashboard } from "@/lib/portal/types";

export function DashboardLibrary({
  dashboards,
  usageLocked = false,
  companyId,
}: {
  dashboards: PortalDashboard[];
  usageLocked?: boolean;
  companyId?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const deferredQuery = useDeferredValue(query);

  const tags = ["All", ...Array.from(new Set(dashboards.map((dashboard) => dashboard.accessTag)))];
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredDashboards = dashboards.filter((dashboard) => {
    const matchesTag = tag === "All" || dashboard.accessTag === tag;
    if (!matchesTag) return false;
    if (!normalizedQuery) return true;

    return (
      dashboard.name.toLowerCase().includes(normalizedQuery) ||
      dashboard.description.toLowerCase().includes(normalizedQuery) ||
      dashboard.accessTag.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dashboards by name, tag, or topic"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((option) => {
              const isActive = option === tag;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTag(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredDashboards.length ? (
        <section className="grid gap-5 xl:grid-cols-2">
          {filteredDashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              dashboard={dashboard}
              usageLocked={usageLocked}
              href={
                companyId
                  ? `/portal/dashboards/${dashboard.slug}?company=${encodeURIComponent(companyId)}`
                  : undefined
              }
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Search}
          title="No dashboards match this view"
          description="Try a different keyword or reset the access filter to see the full licensed dashboard list."
        />
      )}
    </div>
  );
}
