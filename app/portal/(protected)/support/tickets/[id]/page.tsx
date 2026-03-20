import { notFound } from "next/navigation";
import { MessageSquarePlus, ShieldCheck } from "lucide-react";
import { TicketAdminControls } from "@/components/portal/TicketAdminControls";
import { TicketReplyForm } from "@/components/portal/TicketReplyForm";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalTeamMembersByCompany, getPortalTicketForUser, getPortalTicketMessages, getPortalUsersByIds } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate, formatDateTime } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return buildPortalMetadata(`Ticket ${id}`, "Private support ticket thread in the EcoFocus portal.");
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = await requirePortalAccess(`/portal/support/tickets/${id}`);
  const ticket = await getPortalTicketForUser(access.user, id);
  if (!ticket) notFound();

  const showInternal = access.user.role === "support_admin";
  const messages = await getPortalTicketMessages(ticket.id, showInternal);
  const authorIds = Array.from(new Set(messages.map((message) => message.authorId).concat([ticket.requesterId, ticket.ownerId || ""]).filter(Boolean)));
  const authors = await getPortalUsersByIds(authorIds);
  const authorsById = new Map(authors.map((author) => [author.id, author]));
  const supportTeam = showInternal ? await getPortalTeamMembersByCompany(access.company.id) : [];
  const supportOwners = supportTeam
    .filter((member) => member.role === "support_admin" && member.status !== "inactive")
    .map((member) => ({ id: member.id, name: member.name }));

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
                  <span className="font-semibold text-slate-800">
                    {authorsById.get(message.authorId)?.name || "EcoFocus Team"}
                  </span>
                  <span>{formatDateTime(message.createdAt)}</span>
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
            <div className="mt-4 rounded-[24px] bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MessageSquarePlus className="h-4 w-4 text-emerald-700" />
                Add a reply
              </div>
              <TicketReplyForm ticketId={ticket.id} allowInternalNotes={showInternal} />
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Ticket metadata</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <dt>Requester</dt>
                <dd className="font-medium text-slate-900">{authorsById.get(ticket.requesterId)?.name || ticket.requesterId}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Owner</dt>
                <dd className="font-medium text-slate-900">{ticket.ownerId ? authorsById.get(ticket.ownerId)?.name || ticket.ownerId : "Unassigned"}</dd>
              </div>
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
            <>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Assignment and status</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Update ownership and workflow status directly from the ticket thread so support operations stay aligned with the latest client conversation.
                </p>
                <div className="mt-4 rounded-[24px] bg-slate-50 p-5">
                  <TicketAdminControls
                    ticketId={ticket.id}
                    currentStatus={ticket.status}
                    currentOwnerId={ticket.ownerId}
                    ownerOptions={supportOwners}
                  />
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white">
                <h3 className="text-lg font-semibold">Internal notes</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Support staff can save internal notes from the reply box above. Internal notes stay hidden from client users in this thread.
                </p>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
