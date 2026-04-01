"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Trash2 } from "lucide-react";

type DashboardEditorItem = {
  slug: string;
  name: string;
  description: string;
  accessTag: string;
  embedAccess: "public_link" | "displayr_login_required";
  isActive: boolean;
  displayrEmbedUrl: string;
  notes: string;
};

type FormState = {
  slug: string;
  name: string;
  description: string;
  accessTag: string;
  embedAccess: "public_link" | "displayr_login_required";
  isActive: boolean;
  displayrEmbedUrl: string;
  notes: string;
};

function buildFormState(dashboard?: DashboardEditorItem): FormState {
  return {
    slug: dashboard?.slug || "",
    name: dashboard?.name || "",
    description: dashboard?.description || "",
    accessTag: dashboard?.accessTag || "",
    embedAccess: dashboard?.embedAccess || "public_link",
    isActive: dashboard?.isActive || false,
    displayrEmbedUrl: dashboard?.displayrEmbedUrl || "",
    notes: dashboard?.notes || "",
  };
}

export function AdminDashboardManagementCard({
  companyId,
  companyName,
  dashboards,
  storageReady,
}: {
  companyId: string;
  companyName: string;
  dashboards: DashboardEditorItem[];
  storageReady: boolean;
}) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(dashboards[0]?.slug || null);
  const [formState, setFormState] = useState<FormState>(buildFormState(dashboards[0]));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSavingCatalog, setIsSavingCatalog] = useState(false);
  const [isSavingAccess, setIsSavingAccess] = useState(false);
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
    const dashboard = dashboards.find((item) => item.slug === slug);
    setSelectedSlug(slug);
    setFormState(buildFormState(dashboard));
    setFeedback({});
    setIsDropdownOpen(false);
  }

  async function saveCatalog() {
    setIsSavingCatalog(true);
    setFeedback({});
    try {
      const response = await fetch("/api/portal/dashboard-catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: formState.slug,
          name: formState.name,
          description: formState.description,
          accessTag: formState.accessTag,
          embedAccess: formState.embedAccess,
        }),
      });
      const data = (await response.json()) as { error?: string; slug?: string };
      if (!response.ok) {
        setFeedback({ error: data.error || "We couldn't save this dashboard right now." });
        setIsSavingCatalog(false);
        return;
      }

      if (data.slug) {
        setSelectedSlug(data.slug);
        setFormState((current) => ({ ...current, slug: data.slug || current.slug }));
      }
      setFeedback({ success: selectedSlug ? "Dashboard details updated." : "Dashboard added to the catalog." });
      setIsSavingCatalog(false);
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't save this dashboard right now." });
      setIsSavingCatalog(false);
    }
  }

  async function saveWorkspaceAccess() {
    setIsSavingAccess(true);
    setFeedback({});
    try {
      const response = await fetch("/api/portal/dashboard-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          dashboardSlug: formState.slug,
          isActive: formState.isActive,
          displayrEmbedUrl: formState.displayrEmbedUrl,
          notes: formState.notes,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setFeedback({ error: data.error || "We couldn't update workspace access right now." });
        setIsSavingAccess(false);
        return;
      }

      setFeedback({ success: formState.isActive ? "Workspace access updated." : "Workspace access paused." });
      setIsSavingAccess(false);
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't update workspace access right now." });
      setIsSavingAccess(false);
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
      setFormState(buildFormState());
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't remove this dashboard right now." });
      setIsDeleting(false);
    }
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-950">Catalog and workspace access</h3>
        <p className="text-sm leading-6 text-slate-600">
          Choose a dashboard, update its catalog details, and control how {companyName} connects to it from one edit surface.
        </p>
      </div>

      {!storageReady ? (
        <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Dashboard catalog editing needs runtime storage first. Apply the `portal_dashboards.sql` migration in Supabase to add, remove, or recategorize dashboards from this page.
        </div>
      ) : null}

      <div className="mt-6 space-y-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((current) => !current)}
            className="flex w-full items-center justify-between rounded-[24px] border border-slate-300 bg-slate-50 px-5 py-4 text-left transition hover:border-emerald-300"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Editing dashboard</p>
              <p className="mt-1 text-base font-semibold text-slate-950">{formState.name || "Select dashboard"}</p>
              <p className="mt-1 text-sm text-slate-600">{formState.slug || "Choose a dashboard from the shared catalog"}</p>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-500 transition ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-20 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.45)]">
              <div className="flex flex-wrap gap-3">
                <label className="flex min-w-[280px] flex-1 items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-600">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search catalog by name, slug, or category"
                    className="w-full bg-transparent outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => selectDashboard(null)}
                  disabled={!storageReady}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add dashboard
                </button>
              </div>

              <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto">
                {filteredDashboards.map((dashboard) => {
                  const isSelected = dashboard.slug === selectedSlug;
                  return (
                    <button
                      key={dashboard.slug}
                      type="button"
                      onClick={() => selectDashboard(dashboard.slug)}
                      className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${
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
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{dashboard.slug}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[24px] bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedSlug ? "Edit dashboard" : "Create dashboard"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Update how this dashboard appears across the portal.
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
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={saveCatalog}
                disabled={isSavingCatalog || !storageReady}
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingCatalog ? "Saving..." : selectedSlug ? "Save catalog changes" : "Create dashboard"}
              </button>
            </div>
          </div>

          <div className="rounded-[24px] bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Workspace access</p>
            <p className="mt-1 text-sm text-slate-600">
              Control whether {companyName} can open this dashboard and which Displayr URL is used.
            </p>

            <div className="mt-5 space-y-4">
              <label className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Enable access for {companyName}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">Displayr dashboard URL</span>
                <input
                  type="url"
                  value={formState.displayrEmbedUrl}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      displayrEmbedUrl: event.target.value,
                    }))
                  }
                  placeholder="https://app.displayr.com/Dashboard?id=..."
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Use a company-specific Displayr publish URL. Treat this like a bearer link and rotate it if exposure is suspected.
                </p>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">Internal note</span>
                <textarea
                  value={formState.notes}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Optional internal context about this workspace assignment."
                />
              </label>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={saveWorkspaceAccess}
                disabled={isSavingAccess || !formState.slug}
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingAccess ? "Saving..." : "Save workspace access"}
              </button>
            </div>
          </div>
        </div>

        {feedback.success ? <p className="text-xs font-medium text-emerald-700">{feedback.success}</p> : null}
        {feedback.error ? <p className="text-xs font-medium text-rose-600">{feedback.error}</p> : null}
      </div>
    </section>
  );
}
