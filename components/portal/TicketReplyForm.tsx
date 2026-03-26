"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TicketReplyForm({
  ticketId,
  allowInternalNotes = false,
}: {
  ticketId: string;
  allowInternalNotes?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) {
      setError("Reply text is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          isInternal,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "We couldn't post your reply. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setBody("");
      setIsInternal(false);
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("We couldn't post your reply. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        className="w-full rounded-[24px] border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        placeholder={allowInternalNotes ? "Add a client reply or internal support note." : "Reply with any additional context, screenshots, or follow-up questions."}
      />
      {allowInternalNotes ? (
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(event) => setIsInternal(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          />
          Save this as an internal support note
        </label>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : allowInternalNotes && isInternal ? "Save internal note" : "Send reply"}
        </button>
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    </form>
  );
}
