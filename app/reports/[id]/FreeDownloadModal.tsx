// app/reports/[id]/sections/FreeDownloadModal.tsx
"use client";

import { useState } from "react";

export default function FreeDownloadModal({
  fileHref,
  onClose,
}: { fileHref: string; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Wire to HubSpot or /api/capture here if desired.
    setLoading(false);
    setSent(true);
  }

  function close() {
    setOpen(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {!sent ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900">Get your free download</h3>
            <p className="mt-1 text-sm text-gray-600">
              Tell us where to send it. We&rsquo;ll email a copy and unlock the download.
            </p>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                name="name"
                required
                placeholder="Full name"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Work email"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <input
                name="company"
                placeholder="Company (optional)"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300
                             before:content-[''] before:absolute before:inset-0 before:rounded-full
                             before:bg-[radial-gradient(circle_at_center,_#059669,_#1B6C7A)]
                             before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0 disabled:opacity-60"
                  aria-busy={loading}
                >
                  <span className="relative z-10">{loading ? "Sending…" : "Send & unlock"}</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900">You&rsquo;re all set</h3>
            <p className="mt-1 text-sm text-gray-600">
              Here&rsquo;s your direct download. We&rsquo;ve also emailed you a copy.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={fileHref}
                className="inline-flex items-center justify-center rounded-full bg-[#FFC107] px-5 py-2.5 text-sm font-semibold text-emerald-950"
              >
                Download report
              </a>
              <button
                onClick={close}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


