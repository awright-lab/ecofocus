"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, X } from "lucide-react";

const DASHBOARDS_PER_PAGE = 6;

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
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(buildFormState());
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

  const totalPages = Math.max(1, Math.ceil(filteredDashboards.length / DASHBOARDS_PER_PAGE));
  const paginatedDashboards = filteredDashboards.slice(
    (page - 1) * DASHBOARDS_PER_PAGE,
    page * DASHBOARDS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function openDashboard(slug: string | null) {
    const dashboard = dashboards.find((item) => item.slug === slug);
    setSelectedSlug(slug);
    setFormState(buildFormState(dashboard));
    setFeedback({});
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedSlug(null);
    setFormState(buildFormState());
    setFeedback({});
  }

  async function saveCatalog() {
    setIsSavingCatalog(true);
    setFeedback({});
    const isCreatingDashboard = !selectedSlug;

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

      const persistedSlug = data.slug || formState.slug;

      if (isCreatingDashboard) {
        const shouldAssignWorkspace =
          formState.isActive || Boolean(formState.displayrEmbedUrl.trim()) || Boolean(formState.notes.trim());

        if (shouldAssignWorkspace) {
          const configResponse = await fetch("/api/portal/dashboard-configs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              companyId,
              dashboardSlug: persistedSlug,
              isActive: formState.isActive,
              displayrEmbedUrl: formState.displayrEmbedUrl,
              notes: formState.notes,
            }),
          });
          const configData = (await configResponse.json()) as { error?: string };

          if (!configResponse.ok) {
            setFeedback({
              error: configData.error || "The dashboard was created, but workspace access could not be assigned.",
            });
            setIsSavingCatalog(false);
            return;
          }
        }
      }

      setIsSavingCatalog(false);
      setIsModalOpen(false);
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

      setIsSavingAccess(false);
      setIsModalOpen(false);
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
      setIsModalOpen(false);
      router.refresh();
    } catch {
      setFeedback({ error: "We couldn't remove this dashboard right now." });
      setIsDeleting(false);
    }
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Catalog and workspace access</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Browse the dashboard catalog, then open any dashboard card to manage both portal details and workspace access for {companyName}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openDashboard(null)}
          disabled={!storageReady}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add dashboard
        </button>
      </div>

      {!storageReady ? (
        <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Dashboard catalog editing needs runtime storage first. Apply the `portal_dashboards.sql` migration in Supabase to add, remove, or recategorize dashboards from this page.
        </div>
      ) : null}

      <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dashboards by name, slug, or category"
            className="w-full bg-transparent outline-none"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {paginatedDashboards.map((dashboard) => (
          <button
            key={dashboard.slug}
            type="button"
            onClick={() => openDashboard(dashboard.slug)}
            className="rounded-[28px] border border-slate-200 bg-white p-5 text-left shadow-[0_16px_50px_-40px_rgba(15,23,42,0.45)] transition hover:border-emerald-300 hover:bg-emerald-50/30"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {dashboard.accessTag}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  dashboard.isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {dashboard.isActive ? "Enabled for workspace" : "Not enabled"}
              </span>
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-950">{dashboard.name}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{dashboard.description}</p>
            <p className="mt-4 text-sm text-slate-500">{dashboard.slug}</p>
          </button>
        ))}
      </div>

      {!paginatedDashboards.length ? (
        <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
          No dashboards match this search yet.
        </div>
      ) : null}

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing {(page - 1) * DASHBOARDS_PER_PAGE + 1} - {Math.min(page * DASHBOARDS_PER_PAGE, filteredDashboards.length)} of {filteredDashboards.length} dashboards
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-4">
          <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-[0_28px_120px_-36px_rgba(15,23,42,0.55)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Dashboard editor</p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-950">
                  {selectedSlug ? formState.name || "Edit dashboard" : "Create dashboard"}
                </h4>
                <p className="mt-2 text-sm text-slate-600">
                  Update catalog details and workspace access for {companyName} without leaving the dashboard grid.
                  {!selectedSlug ? " New dashboards can be assigned to this workspace as part of creation." : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Catalog details</p>
                    <p className="mt-1 text-sm text-slate-600">Update how this dashboard appears across the portal.</p>
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
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveCatalog}
                disabled={isSavingCatalog || !storageReady}
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingCatalog ? "Saving..." : selectedSlug ? "Save catalog changes" : "Create dashboard and assign"}
              </button>
              <button
                type="button"
                onClick={saveWorkspaceAccess}
                disabled={isSavingAccess || !formState.slug}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingAccess ? "Saving..." : "Save workspace access"}
              </button>
              {feedback.success ? <p className="text-xs font-medium text-emerald-700">{feedback.success}</p> : null}
              {feedback.error ? <p className="text-xs font-medium text-rose-600">{feedback.error}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
