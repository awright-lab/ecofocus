import { notFound } from "next/navigation";
import { MessageSquarePlus, ShieldCheck } from "lucide-react";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalTicketForUser, getPortalTicketMessages, getPortalUserName } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return buildPortalMetadata(`Ticket ${id}`, "Private support ticket thread in the EcoFocus portal.");
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = await requirePortalAccess(`/portal/support/tickets/${id}`);
  const ticket = getPortalTicketForUser(access.user, id);
  if (!ticket) notFound();

  const showInternal = access.user.role === "support_admin";
  const messages = getPortalTicketMessages(ticket.id, showInternal);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Ticket Detail"
          title={ticket.subject}
          description={`Ticket ${ticket.id} for ${ticket.dashboardName}`}
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <TicketStatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{ticket.issueType}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Opened {formatDate(ticket.createdAt)}
          </span>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Message thread</h3>
          <div className="mt-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`rounded-[24px] p-4 ${message.isInternal ? "bg-amber-50" : "bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{getPortalUserName(message.authorId)}</span>
                  <span>{formatDate(message.createdAt)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{message.body}</p>
                {message.isInternal ? (
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Internal note
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Reply</h3>
            <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MessageSquarePlus className="h-4 w-4 text-emerald-700" />
                Reply box placeholder
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                TODO: wire ticket replies to the production backend, email notifications, and visibility rules.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Ticket metadata</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <dt>Dashboard</dt>
                <dd className="font-medium text-slate-900">{ticket.dashboardName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Priority</dt>
                <dd className="font-medium text-slate-900">{ticket.priority}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Last updated</dt>
                <dd className="font-medium text-slate-900">{formatDate(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          {showInternal ? (
            <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white">
              <h3 className="text-lg font-semibold">Internal notes</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Visible only to support staff. TODO: store internal-only note threads separately from client-facing messages.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
