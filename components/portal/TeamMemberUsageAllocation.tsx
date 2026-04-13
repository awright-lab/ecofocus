"use client";

import { useState } from "react";

export function TeamMemberUsageAllocation({
  userId,
  allocatedHours,
  canManage,
}: {
  userId: string;
  allocatedHours?: number | null;
  canManage: boolean;
}) {
  const [value, setValue] = useState(String(allocatedHours ?? ""));
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  async function saveAllocation() {
    setIsSaving(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/portal/usage/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          allocatedHours: Number(value || 0),
        }),
      });

      if (!response.ok) {
        setStatus("error");
        setIsSaving(false);
        return;
      }

      setStatus("saved");
      setIsSaving(false);
    } catch {
      setStatus("error");
      setIsSaving(false);
    }
  }

  if (!canManage) {
    return <div className="text-sm text-slate-600">{allocatedHours ? `${allocatedHours} hrs` : "Not set"}</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-9 w-24 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
        placeholder="Hours"
      />
      <button
        type="button"
        onClick={() => void saveAllocation()}
        disabled={isSaving}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving" : "Save"}
      </button>
      {status === "saved" ? <span className="text-xs font-semibold text-emerald-600">Saved</span> : null}
      {status === "error" ? <span className="text-xs font-semibold text-rose-600">Error</span> : null}
    </div>
  );
}
