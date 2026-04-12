"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import type { PortalDashboard } from "@/lib/portal/types";

type DashboardCatalogFormState = {
  slug: string;
  name: string;
  description: string;
  accessTag: string;
  embedAccess: "public_link" | "displayr_login_required";
  availableToAll: boolean;
};

function buildState(dashboard?: PortalDashboard): DashboardCatalogFormState {
  return {
    slug: dashboard?.slug || "",
    name: dashboard?.name || "",
    description: dashboard?.description || "",
    accessTag: dashboard?.accessTag || "",
    embedAccess: dashboard?.embedAccess || "public_link",
    availableToAll: dashboard?.availableToAll ?? false,
  };
}

export function AdminDashboardCatalogManager({
  dashboards,
  storageReady,
  compact = false,
}: {
  dashboards: PortalDashboard[];
  storageReady: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(dashboards[0]?.slug || null);
  const [formState, setFormState] = useState<DashboardCatalogFormState>(buildState(dashboards[0]));
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});

  const filteredDashboards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return dashboards;

    return dashboards.filter((dashboard) => {
      return (
        dashboard.name.toLowerCase().includes(normalizedQuery) ||
        dashboard.slug.toLowerCase().includes(normalizedQuery) ||
        dashboard.accessTag.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [dashboards, query]);

  function selectDashboard(slug: string | null) {
    setSelectedSlug(slug);
    setFeedback({});
    const dashboard = dashboards.find((item) => item.slug === slug);
    setFormState(buildState(dashboard));
  }

  async function saveDashboard() {
    setIsSaving(true);
    setFeedback({});

    try {
      const response = await fetch("/api/portal/dashboard-catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = (await response.json()) as { error?: string; slug?: string };
      if (!response.ok) {
        setFeedback({ error: data.error || "We couldn't save this dashboard right now." });
        setIsSaving(false);
        return;
      }

      if (data.slug) {
        setSelectedSlug(data.slug);
        setFormState((current) => ({ ...current, slug: data.slug || current.slug }));
      }
      setFeedback({ success: selectedSlug ? "Dashboard details updated." : "Dashboard added to the catalog." });
      setIsSaving(false);
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't save this dashboard right now." });
      setIsSaving(false);
    }
  }

  async function deleteDashboard() {
    if (!selectedSlug) return;
    if (!window.confirm("Delete this dashboard from the catalog and remove all company assignments?")) return;

    setIsDeleting(true);
    setFeedback({});

    try {
      const response = await fetch(`/api/portal/dashboard-catalog?slug=${encodeURIComponent(selectedSlug)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setFeedback({ error: data.error || "We couldn't remove this dashboard right now." });
        setIsDeleting(false);
        return;
      }

      setIsDeleting(false);
      setSelectedSlug(null);
      setFormState(buildState());
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't remove this dashboard right now." });
      setIsDeleting(false);
    }
  }

  return (
    <section className={compact ? "space-y-5" : "rounded-[32px] border border-slate-200 bg-white p-6"}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Dashboard catalog</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add new dashboards, update descriptions and categories, or remove retired dashboards from the shared portal catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={() => selectDashboard(null)}
          disabled={!storageReady}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          Add dashboard
        </button>
      </div>

      {!storageReady ? (
        <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Dashboard catalog editing needs runtime storage first. Apply the `portal_dashboards.sql` migration in Supabase to add, remove, or recategorize dashboards from this page.
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search catalog by name, slug, or category"
              className="w-full bg-transparent outline-none"
            />
          </label>

          <div className="space-y-3">
            {filteredDashboards.map((dashboard) => {
              const isSelected = dashboard.slug === selectedSlug;
              return (
                <button
                  key={dashboard.slug}
                  type="button"
                  onClick={() => selectDashboard(dashboard.slug)}
                  className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{dashboard.name}</p>
                    <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      {dashboard.accessTag}
                    </span>
                    {dashboard.availableToAll ? (
                      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800">
                        All workspaces
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{dashboard.slug}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {selectedSlug ? "Edit dashboard" : "Create dashboard"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {selectedSlug
                  ? "Update how this dashboard appears across the portal."
                  : "Create a new dashboard entry for future company assignments."}
              </p>
            </div>
            {selectedSlug ? (
              <button
                type="button"
                onClick={deleteDashboard}
                disabled={isDeleting || !storageReady}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Removing..." : "Remove dashboard"}
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-800">Dashboard name</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="2026 Shopper Dashboard"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">Slug</span>
                <input
                  type="text"
                  value={formState.slug}
                  onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="2026-shopper-dashboard"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">Category</span>
                <input
                  type="text"
                  value={formState.accessTag}
                  onChange={(event) => setFormState((current) => ({ ...current, accessTag: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Licensed"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-800">Description</span>
              <textarea
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Describe what this dashboard covers and how support teams should think about it."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-800">Viewer type</span>
              <select
                value={formState.embedAccess}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    embedAccess:
                      event.target.value === "displayr_login_required"
                        ? "displayr_login_required"
                        : "public_link",
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="public_link">Public link embed</option>
                <option value="displayr_login_required">Displayr login required</option>
              </select>
            </label>

            <label className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              <input
                type="checkbox"
                checked={formState.availableToAll}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    availableToAll: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
              />
              <span>
                <span className="block font-semibold">Available to all workspaces</span>
                <span className="mt-1 block leading-6 text-sky-800">
                  Show this dashboard as an assignable option for every company. Support still has to enable it per workspace.
                </span>
              </span>
            </label>

          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveDashboard}
              disabled={isSaving || !storageReady}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : selectedSlug ? "Save catalog changes" : "Create dashboard"}
            </button>
            {feedback.success ? <p className="text-xs font-medium text-emerald-700">{feedback.success}</p> : null}
            {feedback.error ? <p className="text-xs font-medium text-rose-600">{feedback.error}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
