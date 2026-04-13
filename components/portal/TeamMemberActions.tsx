"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TeamMemberActions({
  memberId,
  memberStatus,
  canManage,
  isSelf = false,
}: {
  memberId: string;
  memberStatus: "active" | "invited" | "inactive";
  canManage: boolean;
  isSelf?: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  if (!canManage) {
    return <span className="text-sm text-slate-500">View only</span>;
  }

  if (isSelf) {
    return <span className="text-sm text-slate-500">Current user</span>;
  }

  const primaryAction = memberStatus === "inactive" ? "reactivate" : "deactivate";
  const primaryLabel =
    memberStatus === "inactive"
      ? "Reinvite"
      : memberStatus === "invited"
        ? "Cancel invite"
        : "Deactivate";

  async function onClick(action: "deactivate" | "reactivate" | "remove") {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/team/${memberId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't update this teammate.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't update this teammate.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onClick(primaryAction)}
        disabled={isSubmitting}
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : primaryLabel}
      </button>
      {memberStatus === "inactive" ? (
        <button
          type="button"
          onClick={() => setIsRemoveModalOpen(true)}
          disabled={isSubmitting}
          className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Remove
        </button>
      ) : null}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}

      {isRemoveModalOpen ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/55 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Remove teammate"
            className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-[0_28px_120px_-36px_rgba(15,23,42,0.55)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700">Remove teammate</p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-950">Remove from this workspace?</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This removes the teammate from the list for this workspace. You can invite them again later if needed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRemoveModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  await onClick("remove");
                  setIsRemoveModalOpen(false);
                }}
                disabled={isSubmitting}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Removing..." : "Remove teammate"}
              </button>
              <button
                type="button"
                onClick={() => setIsRemoveModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
