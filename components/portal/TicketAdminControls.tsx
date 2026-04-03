"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OwnerOption = {
  id: string;
  name: string;
};

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "waiting_on_client", label: "Waiting on client" },
  { value: "completed", label: "Completed" },
] as const;

export function TicketAdminControls({
  ticketId,
  currentStatus,
  currentOwnerId,
  ownerOptions,
  compact = false,
}: {
  ticketId: string;
  currentStatus: string;
  currentOwnerId: string | null;
  ownerOptions: OwnerOption[];
  compact?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [ownerId, setOwnerId] = useState(currentOwnerId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (currentStatus === "archived") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3"}>
        <p className="text-sm font-medium text-slate-800">Archived ticket</p>
        <p className="text-xs leading-5 text-slate-500">
          This ticket was archived automatically after the completion review window. Archived tickets are read-only.
        </p>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/portal/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ownerId: ownerId || null,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't update this ticket right now.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Ticket updated.");
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't update this ticket right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={`w-full rounded-2xl border border-slate-300 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
            compact ? "px-3 py-2.5" : "px-4 py-3"
          }`}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="mt-2 block text-xs text-slate-500">
          Completed tickets archive automatically after the client review window.
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Owner</span>
        <select
          value={ownerId}
          onChange={(event) => setOwnerId(event.target.value)}
          className={`w-full rounded-2xl border border-slate-300 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
            compact ? "px-3 py-2.5" : "px-4 py-3"
          }`}
        >
          <option value="">Unassigned</option>
          {ownerOptions.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : compact ? "Save" : "Save ticket updates"}
        </button>
        {success ? <p className="text-xs font-medium text-emerald-700">{success}</p> : null}
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    </form>
  );
}
