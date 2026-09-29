"use client";
import { useEffect, useState } from "react";
type Viewer = {
  userId: string;
  name: string;
  status: string;
  reason: string | null;
  checkedAt: string | null;
  provisioning?: { stage: string; reason: string | null } | null;
};
const onboardingLabels: Record<string, string> = {
  queued: "Viewer setup queued",
  invitation_pending: "Waiting for the Displayr invitation",
  activation_pending: "Activating the viewer",
  credentials_verified: "Viewer activated; checking dashboard permissions",
  ready: "Viewer setup complete",
  needs_attention: "Viewer setup needs attention",
};
const onboardingReasons: Record<string, string> = {
  account_lookup_ambiguous:
    "The Displayr account could not be identified safely. Check the company’s user list before retrying setup.",
  existing_account_credentials:
    "An existing viewer could not sign in with its saved credentials. Review the account before retrying.",
  invitation_not_verified:
    "The invitation could not be verified. Review the provisioning mailbox.",
  activation_requires_review:
    "Activation could not be confirmed. Check the viewer account before retrying.",
  provisioning_timeout:
    "Setup did not finish within one day. Review the worker and mailbox connection.",
};
const reasonLabels: Record<string, string> = {
  "group_update_failed:administrator_login":
    "Displayr administrator sign-in failed.",
  "group_update_failed:browser_setup":
    "The permission worker could not start its browser session.",
  "group_update_failed:account_page":
    "The worker could not open Displayr account settings.",
  "group_update_failed:viewer_lookup":
    "The worker could not uniquely locate this viewer in Displayr account settings.",
  "group_update_failed:edit_page":
    "The worker could not open the viewer’s settings.",
  "group_update_failed:edit_form":
    "The viewer’s group-edit form did not match the expected account and controls.",
  "group_update_failed:group_submission":
    "The viewer’s group update could not be submitted successfully.",
  "group_update_failed:group_readback":
    "The worker could not reload the saved group membership.",
  viewer_not_enrolled:
    "This viewer is not yet enrolled in managed permission synchronization.",
  mapping_required: "A dashboard needs a verified report/group mapping.",
  viewer_missing: "This user needs a provisioned Displayr viewer.",
  administrator_unavailable:
    "The synchronization service needs its Displayr administrator connection.",
  group_update_failed: "Displayr permissions could not be updated.",
  group_readback_failed: "The group changes could not be confirmed.",
  verification_expired: "Permissions need to be checked again.",
  assignments_changed:
    "Workspace assignments changed; synchronization is pending.",
};
export function DisplayrPermissionPanel({
  companyId,
  dashboardSlug,
  sourceUrl,
}: {
  companyId: string;
  dashboardSlug: string;
  sourceUrl: string;
}) {
  const [assignedUrl, setAssignedUrl] = useState("");
  const [projectId, setProjectId] = useState("");
  const [groups, setGroups] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setMessage("");
    setConfirmed(false);
    fetch(
      `/api/portal/admin/displayr/permissions?companyId=${encodeURIComponent(companyId)}&dashboardSlug=${encodeURIComponent(dashboardSlug)}`,
      { cache: "no-store", signal: abort.signal },
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Could not load permissions.");
        return data;
      })
      .then((data) => {
        setAssignedUrl(data.sourceUrl);
        setProjectId(data.binding?.project_id || "");
        setGroups(data.binding?.group_ids?.join(", ") || "");
        setViewers(data.viewers || []);
        if (data.binding && data.binding.source_url !== data.sourceUrl)
          setMessage(
            "The dashboard URL changed. Save the assignment, then confirm its report and groups again.",
          );
      })
      .catch((error) => {
        if (!abort.signal.aborted) setMessage(error.message);
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [companyId, dashboardSlug, refresh]);
  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/portal/admin/displayr/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          dashboardSlug,
          projectId,
          groupIds: groups
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean),
          viewOnlyConfirmed: confirmed,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not save mapping.");
      setRefresh((v) => v + 1);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save mapping.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <section
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4"
      aria-label="Displayr permissions"
    >
      <div>
        <h3 className="font-semibold text-slate-950">Displayr permissions</h3>
        <p className="mt-1 text-sm text-slate-600">
          Save the workspace assignment above first. Then map its report to
          restricted viewing groups. Each member uses their own viewer account.
        </p>
      </div>
      <label className="block text-sm font-medium">
        Displayr project ID
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 p-2"
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
            setConfirmed(false);
          }}
          inputMode="numeric"
          disabled={loading || saving}
        />
      </label>
      <label className="block text-sm font-medium">
        Viewing group IDs, separated by commas
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 p-2"
          value={groups}
          onChange={(e) => {
            setGroups(e.target.value);
            setConfirmed(false);
          }}
          disabled={loading || saving}
        />
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          disabled={loading || saving}
        />
        I confirmed these groups grant view-only access to this report, without
        broader dashboard or editing access.
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={
            loading || saving || !confirmed || assignedUrl !== sourceUrl
          }
          className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Displayr mapping"}
        </button>
        <button
          type="button"
          onClick={() => setRefresh((v) => v + 1)}
          disabled={loading || saving}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Refresh status
        </button>
      </div>
      {!loading && assignedUrl !== sourceUrl && (
        <p className="text-sm text-amber-800">
          Save the changed dashboard URL before saving its permission mapping.
        </p>
      )}
      {message && (
        <p role="status" className="text-sm text-amber-800">
          {message}
        </p>
      )}
      <p className="text-xs text-slate-600">
        Portal assignment and Displayr synchronization are separate. “Verified”
        means the worker confirmed the viewer’s group membership against the
        current assignments.
      </p>
      {loading ? (
        <p className="text-sm">Loading permissions…</p>
      ) : (
        <ul className="space-y-2">
          {viewers.map((viewer) => (
            <li
              key={viewer.userId}
              className="rounded-lg bg-slate-50 p-3 text-sm"
            >
              <strong>{viewer.name}</strong>
              <span className="ml-2">
                {viewer.status === "verified"
                  ? "Verified"
                  : viewer.status === "needs_attention"
                    ? "Needs attention"
                    : viewer.status === "syncing"
                      ? "Synchronizing"
                      : "Pending"}
              </span>
              {viewer.provisioning && (
                <p className="mt-1 text-slate-600">
                  {onboardingLabels[viewer.provisioning.stage] ||
                    "Viewer setup pending"}
                  {viewer.provisioning.reason &&
                    ` — ${onboardingReasons[viewer.provisioning.reason] || "Review the provisioning service."}`}
                </p>
              )}
              {viewer.reason && (
                <p className="mt-1 text-slate-600">
                  {reasonLabels[viewer.reason] ||
                    "Synchronization needs attention."}
                </p>
              )}
              {viewer.checkedAt && (
                <p className="text-xs text-slate-500">
                  Checked {new Date(viewer.checkedAt).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      {!loading && !viewers.length && (
        <p className="text-sm text-slate-600">
          No workspace members to synchronize.
        </p>
      )}
    </section>
  );
}
