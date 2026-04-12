"use client";

import { useState } from "react";

function formatAccessSentAt(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminWorkspaceAccessCard({
  adminEmail,
  adminName,
  accessEmailDeliveryStatus,
  accessEmailSentAt,
  accessEmailSentTo,
  billingStatus,
  companyId,
  companyName,
  planName,
}: {
  adminEmail?: string | null;
  adminName?: string | null;
  accessEmailDeliveryStatus?: "sent" | "manual_only" | null;
  accessEmailSentAt?: string | null;
  accessEmailSentTo?: string | null;
  billingStatus?: string | null;
  companyId: string;
  companyName: string;
  planName: string;
}) {
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    error?: string;
    success?: string;
    setupUrl?: string | null;
  }>({});
  const [sentState, setSentState] = useState({
    deliveryStatus: accessEmailDeliveryStatus || null,
    sentAt: accessEmailSentAt || null,
    sentTo: accessEmailSentTo || null,
  });
  const [copied, setCopied] = useState(false);
  const [showBypassModal, setShowBypassModal] = useState(false);
  const isDemoSuite = planName === "Demo Suite";
  const canSend = Boolean(adminEmail);
  const needsBypass = Boolean(adminEmail) && !isDemoSuite && billingStatus !== "paid";
  const formattedSentAt = formatAccessSentAt(sentState.sentAt);
  const wasEmailed = sentState.deliveryStatus !== "manual_only";

  async function sendAccessEmail(options?: { bypassUnpaid?: boolean }) {
    setIsSending(true);
    setCopied(false);
    setFeedback({});

    try {
      const response = await fetch(`/api/portal/admin/workspaces/${encodeURIComponent(companyId)}/access-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryKind: sentState.sentAt ? "resend" : "initial",
          bypassUnpaid: options?.bypassUnpaid || false,
        }),
      });
      const data = (await response.json()) as {
        email?: string;
        emailSent?: boolean;
        emailWarning?: string | null;
        error?: string;
        sentAt?: string | null;
        setupUrl?: string | null;
      };

      if (!response.ok) {
        setFeedback({ error: data.error || "We couldn't send the access setup email." });
        setIsSending(false);
        return;
      }

      setFeedback({
        success: data.emailSent
          ? `Access setup email sent to ${data.email || adminEmail}.`
          : data.emailWarning || "Email delivery was not confirmed. Copy the setup link manually.",
        setupUrl: data.setupUrl || null,
      });
      if (data.sentAt) {
        setSentState({
          deliveryStatus: data.emailSent ? "sent" : "manual_only",
          sentAt: data.sentAt,
          sentTo: data.email || adminEmail || null,
        });
      }
      setIsSending(false);
    } catch {
      setFeedback({ error: "We couldn't send the access setup email." });
      setIsSending(false);
    }
  }

  function handleSendClick() {
    if (needsBypass) {
      setShowBypassModal(true);
      return;
    }
    void sendAccessEmail();
  }

  async function copySetupUrl() {
    if (!feedback.setupUrl) return;

    try {
      await navigator.clipboard.writeText(feedback.setupUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Access handoff</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Send admin password setup</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Send the setup email only when demo access is approved or the first invoice has been paid.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isDemoSuite ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {isDemoSuite ? "Demo Suite" : "Paid workspace"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Company admin</p>
          <p className="mt-2 font-semibold text-slate-950">{adminName || "No admin found"}</p>
          <p className="mt-1 text-sm text-slate-600">{adminEmail || "Create an admin user before sending access."}</p>
        </div>
        <div className="rounded-[24px] bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Access rule</p>
          <p className="mt-2 font-semibold text-slate-950">
            {sentState.sentAt
              ? wasEmailed
                ? "Access setup email sent"
                : "Setup link generated"
              : isDemoSuite
                ? "Demo access can be sent now"
                : billingStatus === "paid"
                  ? "Paid access approved"
                  : "Waiting for payment"}
          </p>
          <p className="mt-1 text-sm capitalize text-slate-600">Billing status: {(billingStatus || "not set").replaceAll("_", " ")}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSendClick}
          disabled={!canSend || isSending}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "Sending..." : sentState.sentAt ? "Resend setup email" : "Send setup email"}
        </button>
        {sentState.sentAt ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            {wasEmailed ? "Email sent" : "Setup link generated"}
            {sentState.sentTo ? ` for ${sentState.sentTo}` : ""}
            {formattedSentAt ? ` on ${formattedSentAt}` : ""}
          </span>
        ) : null}
        {!canSend ? <p className="text-sm text-amber-700">No company admin is available for this workspace.</p> : null}
        {canSend && needsBypass ? (
          <p className="text-sm text-amber-700">
            {companyName} is not Demo Suite and billing is not paid yet. Sending will bypass the billing warning.
          </p>
        ) : null}
        {feedback.success ? <p className="text-sm font-medium text-emerald-700">{feedback.success}</p> : null}
        {feedback.error ? <p className="text-sm font-medium text-rose-600">{feedback.error}</p> : null}
      </div>

      {feedback.setupUrl ? (
        <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-950">Manual setup link</p>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Email delivery was not confirmed, so copy this link and send it directly to the company admin.
          </p>
          <div className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs text-slate-700 break-all">{feedback.setupUrl}</div>
          <button
            type="button"
            onClick={copySetupUrl}
            className="mt-3 rounded-xl border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            {copied ? "Copied" : "Copy setup link"}
          </button>
        </div>
      ) : null}

      {showBypassModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Bypass warning</p>
            <h4 className="mt-2 text-lg font-semibold text-slate-950">Send access setup before billing is paid?</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This workspace is not Demo Suite and billing has not been marked paid yet. Confirm to send the access setup
              email anyway.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBypassModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBypassModal(false);
                  void sendAccessEmail({ bypassUnpaid: true });
                }}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Send anyway
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
