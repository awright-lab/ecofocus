"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { TicketAdminControls } from "@/components/portal/TicketAdminControls";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import type { PortalTicket } from "@/lib/portal/types";
import { formatResponseTarget, formatResponseTime, formatTicketAge } from "@/lib/portal/ticket-lifecycle";

type OwnerOption = {
  id: string;
  name: string;
};

type TicketRow = {
  id: string;
  subject: string;
  companyId: string;
  companyName: string;
  status: PortalTicket["status"];
  priority: PortalTicket["priority"];
  ownerId: string | null;
  ownerName: string;
  updatedLabel: string;
  awaitingLabel: string;
  firstResponseMinutes: number | null;
  firstResponseTargetMinutes: number;
  firstResponseBreached: boolean;
  attentionLabel: string;
  escalationLabel: string;
  ticketAgeMinutes: number;
};

export function AdminSupportQueueTable({
  ownerOptions,
  tickets,
}: {
  ownerOptions: OwnerOption[];
  tickets: TicketRow[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkOwnerId, setBulkOwnerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allVisibleIds = useMemo(() => tickets.map((ticket) => ticket.id), [tickets]);
  const allSelected = Boolean(allVisibleIds.length) && selectedIds.length === allVisibleIds.length;

  function toggleTicket(ticketId: string) {
    setSelectedIds((current) =>
      current.includes(ticketId) ? current.filter((id) => id !== ticketId) : [...current, ticketId],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : allVisibleIds);
  }

  async function applyBulkUpdates() {
    if (!selectedIds.length) {
      setError("Select at least one ticket first.");
      return;
    }

    if (!bulkStatus && !bulkOwnerId) {
      setError("Choose a status, owner, or both before applying a bulk update.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/portal/tickets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketIds: selectedIds,
          status: bulkStatus || undefined,
          ownerId: bulkOwnerId === "unassigned" ? null : bulkOwnerId || undefined,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't apply the bulk update.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(`Updated ${selectedIds.length} ticket${selectedIds.length === 1 ? "" : "s"}.`);
      setSelectedIds([]);
      window.location.reload();
    } catch {
      setError("We couldn't apply the bulk update.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{tickets.length}</span> tickets
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bulk status</span>
              <select
                value={bulkStatus}
                onChange={(event) => setBulkStatus(event.target.value)}
                className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Keep status</option>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="waiting_on_client">Waiting on client</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bulk owner</span>
              <select
                value={bulkOwnerId}
                onChange={(event) => setBulkOwnerId(event.target.value)}
                className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Keep owner</option>
                <option value="unassigned">Unassigned</option>
                {ownerOptions.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={applyBulkUpdates}
              disabled={isSubmitting}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Applying..." : `Apply to ${selectedIds.length || 0}`}
            </button>
          </div>
        </div>
        {success ? <p className="mt-3 text-sm font-medium text-emerald-700">{success}</p> : null}
        {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
      </div>
      <div className="hidden min-[1180px]:grid grid-cols-[0.3fr_1.2fr_0.9fr_0.75fr_0.75fr_0.8fr_0.75fr_1.2fr_0.7fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
          <span>Select</span>
        </label>
        <span>Ticket</span>
        <span>Workspace</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Attention</span>
        <span>Owner</span>
        <span>Queue actions</span>
        <span>Updated</span>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="border-b border-slate-100 px-6 py-5 text-sm last:border-b-0">
          <div className="grid items-start gap-5 min-[1180px]:grid-cols-[0.3fr_1.2fr_0.9fr_0.75fr_0.75fr_0.8fr_0.75fr_1.2fr_0.7fr]">
            <div className="pt-1 min-[1180px]:pt-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(ticket.id)}
                onChange={() => toggleTicket(ticket.id)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600"
              />
            </div>
            <div>
              <Link href={`/portal/support/tickets/${ticket.id}`} className="font-semibold text-slate-900 transition hover:text-emerald-700">
                {ticket.subject}
              </Link>
              <p className="mt-1 text-slate-600">{ticket.id}</p>
              <p className="mt-2 text-xs text-slate-500">{formatResponseTime(ticket.firstResponseMinutes)}</p>
              <p className={`mt-1 text-xs font-medium ${ticket.firstResponseBreached ? "text-rose-700" : "text-slate-500"}`}>
                {formatResponseTarget(ticket.firstResponseTargetMinutes)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 min-[1180px]:hidden">
                <TicketStatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {ticket.awaitingLabel}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {ticket.escalationLabel}
                </span>
              </div>
            </div>
            <div className="space-y-1 text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 min-[1180px]:hidden">Workspace</p>
              <p className="font-medium text-slate-900 min-[1180px]:font-normal">{ticket.companyName}</p>
            </div>
            <div className="hidden min-[1180px]:block">
              <TicketStatusBadge status={ticket.status} />
            </div>
            <div className="hidden min-[1180px]:block">
              <PriorityBadge priority={ticket.priority} />
            </div>
            <div className="space-y-2 min-[1180px]:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Attention</p>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {ticket.attentionLabel}
              </span>
              <p className="text-xs text-slate-500">{ticket.awaitingLabel}</p>
              <p className="text-xs font-medium text-slate-600">{ticket.escalationLabel}</p>
            </div>
            <div className="hidden min-[1180px]:block">
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {ticket.attentionLabel}
                </span>
                <p className="text-xs text-slate-500">{ticket.awaitingLabel}</p>
                <p className="text-xs font-medium text-slate-600">{ticket.escalationLabel}</p>
              </div>
            </div>
            <div className="space-y-1 text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 min-[1180px]:hidden">Owner</p>
              <p className="font-medium text-slate-900 min-[1180px]:font-normal">{ticket.ownerName}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 min-[1180px]:hidden">Queue actions</p>
              <TicketAdminControls
                ticketId={ticket.id}
                currentStatus={ticket.status}
                currentOwnerId={ticket.ownerId}
                ownerOptions={ownerOptions}
                compact
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 min-[1180px]:hidden">Updated</p>
              <p className="text-slate-600">{ticket.updatedLabel}</p>
              <p className="text-xs text-slate-500">{formatTicketAge(ticket.ticketAgeMinutes)}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
