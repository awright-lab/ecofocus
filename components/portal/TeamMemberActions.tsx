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
    if (action === "remove") {
      const confirmed = window.confirm("Remove this teammate from the list? You can invite them again later.");
      if (!confirmed) {
        return;
      }
    }
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
          onClick={() => onClick("remove")}
          disabled={isSubmitting}
          className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Remove
        </button>
      ) : null}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
