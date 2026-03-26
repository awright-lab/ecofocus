"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InviteItem = {
  id: string;
  invitedName: string;
  invitedEmail: string;
  invitedRole: string;
  invitedByName: string;
  inviteUrl: string;
  deliveryStatus: "sent" | "manual_only" | "failed";
  deliveryMessage?: string | null;
  createdAt: string;
  lastSentAt?: string | null;
};

function getStatusLabel(status: InviteItem["deliveryStatus"]) {
  if (status === "sent") return "Email sent";
  if (status === "manual_only") return "Manual send";
  return "Delivery issue";
}

export function TeamInviteHistory({
  invites,
  canManage,
}: {
  invites: InviteItem[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { error?: string; success?: string }>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyInviteUrl(inviteId: string, inviteUrl: string) {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedId(inviteId);
    } catch {
      setCopiedId(null);
    }
  }

  async function resendInvite(inviteId: string) {
    setResendingId(inviteId);
    setFeedback((current) => ({ ...current, [inviteId]: {} }));

    try {
      const response = await fetch(`/api/portal/team/invites/${inviteId}/resend`, {
        method: "POST",
      });

      const data = (await response.json()) as { error?: string; emailSent?: boolean; inviteUrl?: string };
      if (!response.ok) {
        setFeedback((current) => ({
          ...current,
          [inviteId]: { error: data.error || "We couldn't resend this invite right now." },
        }));
        setResendingId(null);
        return;
      }

      setFeedback((current) => ({
        ...current,
        [inviteId]: { success: data.emailSent ? "Invite email sent." : "Setup link is ready to share." },
      }));
      setResendingId(null);
      if (data.inviteUrl) {
        await copyInviteUrl(inviteId, data.inviteUrl);
      }
      router.refresh();
    } catch {
      setFeedback((current) => ({
        ...current,
        [inviteId]: { error: "We couldn't resend this invite right now." },
      }));
      setResendingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => {
        const messages = feedback[invite.id] || {};
        return (
          <div key={invite.id} className="rounded-[24px] bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{invite.invitedName}</p>
                <p className="text-sm text-slate-600">{invite.invitedEmail}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  invite.deliveryStatus === "sent"
                    ? "bg-emerald-100 text-emerald-800"
                    : invite.deliveryStatus === "manual_only"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                }`}
              >
                {getStatusLabel(invite.deliveryStatus)}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <p>Role: <span className="font-medium text-slate-900">{invite.invitedRole.replace("_", " ")}</span></p>
              <p>Invited by: <span className="font-medium text-slate-900">{invite.invitedByName}</span></p>
              <p>Created: <span className="font-medium text-slate-900">{invite.createdAt}</span></p>
              <p>Last sent: <span className="font-medium text-slate-900">{invite.lastSentAt || "Not recorded yet"}</span></p>
            </div>
            {invite.deliveryMessage ? <p className="mt-2 text-xs text-slate-500">{invite.deliveryMessage}</p> : null}
            {canManage ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => copyInviteUrl(invite.id, invite.inviteUrl)}
                  className="rounded-xl border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  {copiedId === invite.id ? "Copied" : "Copy setup link"}
                </button>
                <button
                  type="button"
                  onClick={() => resendInvite(invite.id)}
                  disabled={resendingId === invite.id}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resendingId === invite.id ? "Refreshing..." : "Refresh setup link"}
                </button>
                {messages.success ? <p className="text-xs font-medium text-emerald-700">{messages.success}</p> : null}
                {messages.error ? <p className="text-xs font-medium text-rose-600">{messages.error}</p> : null}
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">Invite delivery details are visible to admins only.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
