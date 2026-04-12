"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function AdminWorkspaceDeleteCard({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeModal() {
    if (isDeleting) return;
    setIsOpen(false);
    setConfirmation("");
    setError(null);
  }

  async function deleteWorkspace() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/admin/workspaces/${encodeURIComponent(companyId)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "We couldn't delete this workspace.");
        setIsDeleting(false);
        return;
      }

      setIsOpen(false);
      setConfirmation("");
      router.push("/portal/admin/workspaces?view=overview");
      router.refresh();
    } catch {
      setError("We couldn't delete this workspace.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-rose-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700">Danger zone</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">Delete company workspace</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Permanently removes {companyName}, its portal users, dashboard access, support tickets, usage records, and subscription record.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setError(null);
          }}
          className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          Delete workspace
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/55 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm workspace deletion"
            className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-[0_28px_120px_-36px_rgba(15,23,42,0.55)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700">Delete workspace</p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-950">Confirm deletion</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This will permanently delete <span className="font-semibold text-slate-950">{companyName}</span> from the portal. This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 rounded-[24px] border border-rose-200 bg-rose-50 p-5">
              <p className="text-sm text-rose-900">
                Type <span className="font-semibold">DELETE</span> to confirm.
              </p>
              <input
                type="text"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="Type DELETE"
                className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={deleteWorkspace}
                disabled={confirmation !== "DELETE" || isDeleting}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete workspace"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
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
