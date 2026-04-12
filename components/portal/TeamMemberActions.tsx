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

  const action = memberStatus === "inactive" ? "reactivate" : "deactivate";
  const label =
    memberStatus === "inactive"
      ? "Reinvite"
      : memberStatus === "invited"
        ? "Cancel invite"
        : "Deactivate";

  async function onClick() {
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
        onClick={onClick}
        disabled={isSubmitting}
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : label}
      </button>
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
