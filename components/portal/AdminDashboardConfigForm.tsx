"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type DashboardConfigItem = {
  slug: string;
  name: string;
  description: string;
  accessTag: string;
  isActive: boolean;
  displayrEmbedUrl: string;
  notes: string;
};

export function AdminDashboardConfigForm({
  companyId,
  companyName,
  dashboards,
  introTitle = "Manage which dashboards are live for this company and keep each dashboard URL stored on the server.",
  compact = false,
}: {
  companyId: string;
  companyName: string;
  dashboards: DashboardConfigItem[];
  introTitle?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const initialState = useMemo(
    () =>
      Object.fromEntries(
        dashboards.map((dashboard) => [
          dashboard.slug,
          {
            isActive: dashboard.isActive,
            displayrEmbedUrl: dashboard.displayrEmbedUrl,
            notes: dashboard.notes,
          },
        ]),
      ),
    [dashboards],
  );

  const [formState, setFormState] = useState(initialState);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { error?: string; success?: string }>>({});
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("All");

  const tags = useMemo(
    () => ["All", ...Array.from(new Set(dashboards.map((dashboard) => dashboard.accessTag)))],
    [dashboards],
  );
  const filteredDashboards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return dashboards.filter((dashboard) => {
      const matchesTag = tagFilter === "All" || dashboard.accessTag === tagFilter;
      if (!matchesTag) return false;
      if (!normalizedQuery) return true;

      return (
        dashboard.name.toLowerCase().includes(normalizedQuery) ||
        dashboard.slug.toLowerCase().includes(normalizedQuery) ||
        dashboard.description.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [dashboards, query, tagFilter]);

  async function saveDashboard(slug: string) {
    const payload = formState[slug];
    setSavingSlug(slug);
    setFeedback((current) => ({ ...current, [slug]: {} }));

    try {
      const response = await fetch("/api/portal/dashboard-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          dashboardSlug: slug,
          isActive: payload.isActive,
          displayrEmbedUrl: payload.displayrEmbedUrl,
          notes: payload.notes,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setFeedback((current) => ({
          ...current,
          [slug]: { error: data.error || "We couldn't update this dashboard right now." },
        }));
        setSavingSlug(null);
        return;
      }

      setFeedback((current) => ({
        ...current,
        [slug]: { success: payload.isActive ? "Dashboard access updated." : "Dashboard access paused." },
      }));
      setSavingSlug(null);
      router.refresh();
    } catch {
      setFeedback((current) => ({
        ...current,
        [slug]: { error: "We couldn't update this dashboard right now." },
      }));
      setSavingSlug(null);
    }
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-4"}>
      <div className={`${compact ? "rounded-[24px] border border-slate-200 bg-slate-50" : "rounded-[24px] bg-slate-50"} p-5`}>
        <p className="text-sm font-semibold text-slate-900">{companyName}</p>
        <p className="mt-1 text-sm text-slate-600">
          {introTitle}
        </p>
      </div>

      <div className={`${compact ? "rounded-[24px] border border-slate-200 bg-slate-50" : "rounded-[24px] border border-slate-200 bg-white"} p-5`}>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dashboards by name, slug, or description"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = tag === tagFilter;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDashboards.map((dashboard) => {
          const state = formState[dashboard.slug];
          const messages = feedback[dashboard.slug] || {};

          return (
            <div
              key={dashboard.slug}
              className={`rounded-[24px] border border-slate-200 ${compact ? "bg-white" : "bg-white"} p-5`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-950">{dashboard.name}</p>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      {dashboard.accessTag}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                        state.isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {state.isActive ? "Live for company" : "Not assigned"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{dashboard.description}</p>
                </div>

                <label className="inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={state.isActive}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        [dashboard.slug]: {
                          ...current[dashboard.slug],
                          isActive: event.target.checked,
                        },
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Enable access
                </label>
              </div>

              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Displayr dashboard URL</span>
                  <input
                    type="url"
                    value={state.displayrEmbedUrl}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        [dashboard.slug]: {
                          ...current[dashboard.slug],
                          displayrEmbedUrl: event.target.value,
                        },
                      }))
                    }
                    placeholder="https://app.displayr.com/Dashboard?id=..."
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Use a company-specific Displayr publish URL. Treat this like a bearer link and replace it if exposure is suspected.
                  </p>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">Internal note</span>
                  <textarea
                    value={state.notes}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        [dashboard.slug]: {
                          ...current[dashboard.slug],
                          notes: event.target.value,
                        },
                      }))
                    }
                    rows={2}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Optional internal context about this assignment."
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={savingSlug === dashboard.slug}
                  onClick={() => saveDashboard(dashboard.slug)}
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingSlug === dashboard.slug ? "Saving..." : "Save dashboard access"}
                </button>
                {messages.success ? <p className="text-xs font-medium text-emerald-700">{messages.success}</p> : null}
                {messages.error ? <p className="text-xs font-medium text-rose-600">{messages.error}</p> : null}
              </div>
            </div>
          );
        })}

        {!filteredDashboards.length ? (
          <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
            No dashboards match this workspace filter.
          </div>
        ) : null}
      </div>
    </div>
  );
}
