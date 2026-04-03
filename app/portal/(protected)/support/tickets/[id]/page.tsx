import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquarePlus, ShieldCheck } from "lucide-react";
import { TicketAdminControls } from "@/components/portal/TicketAdminControls";
import { TicketReplyForm } from "@/components/portal/TicketReplyForm";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalCompanies, getPortalTeamMembersByCompany, getPortalTicketForUser, getPortalTicketMessages, getPortalUsageLogsForAdmin, getPortalUsersByIds } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatResponseTarget, formatResponseTime, getPortalTicketLifecycle, formatTicketAge } from "@/lib/portal/ticket-lifecycle";
import { formatDate, formatDateTime } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return buildPortalMetadata(`Ticket ${id}`, "Private support ticket thread in the EcoFocus portal.");
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = await requirePortalAccess(`/portal/support/tickets/${id}`);
  const ticket = await getPortalTicketForUser(access.effectiveUser, id);
  if (!ticket) {
    if (access.isPreviewMode) {
      redirect("/portal/home");
    }
    notFound();
  }

  const showInternal = access.effectiveRole === "support_admin";
  const messages = await getPortalTicketMessages(ticket.id, showInternal);
  const authorIds = Array.from(new Set(messages.map((message) => message.authorId).concat([ticket.requesterId, ticket.ownerId || ""]).filter(Boolean)));
  const authors = await getPortalUsersByIds(authorIds);
  const authorsById = new Map(authors.map((author) => [author.id, author]));
  const companies = await getPortalCompanies();
  const companiesById = new Map(companies.map((company) => [company.id, company]));
  const requester = authorsById.get(ticket.requesterId) || null;
  const requesterCompanyId = requester?.homeCompanyId || requester?.companyId || ticket.companyId;
  const requesterCompanyName = companiesById.get(requesterCompanyId)?.name || requesterCompanyId;
  const supportTeam = showInternal ? await getPortalTeamMembersByCompany(access.company.id) : [];
  const supportOwners = supportTeam
    .filter((member) => member.role === "support_admin" && member.status !== "inactive")
    .map((member) => ({ id: member.id, name: member.name }));
  const lifecycle = getPortalTicketLifecycle({
    ticket,
    messages,
    authorsById,
  });
  const historyLogs = showInternal
    ? (await getPortalUsageLogsForAdmin({
        companyId: ticket.companyId,
        limit: 200,
      }))
        .filter(
          (log) =>
            log.eventType === "admin_action" &&
            (log.metadata?.ticketId === ticket.id || log.dashboardId === ticket.id),
        )
        .sort((a, b) => b.eventAt.localeCompare(a.eventAt))
    : [];

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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="min-w-0 rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Message thread</h3>
          <div className="mt-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`min-w-0 rounded-[24px] p-4 ${message.isInternal ? "bg-amber-50" : "bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {authorsById.get(message.authorId)?.name || "EcoFocus Team"}
                  </span>
                  <span>{formatDateTime(message.createdAt)}</span>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-700">{renderMessageBody(message.body)}</div>
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

        <div className="min-w-0 space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Reply</h3>
            <div className="mt-4 rounded-[24px] bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MessageSquarePlus className="h-4 w-4 text-emerald-700" />
                Add a reply
              </div>
              <TicketReplyForm ticketId={ticket.id} allowInternalNotes={showInternal} readOnly={access.isPreviewMode} />
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
                <dt>Requester company</dt>
                <dd className="font-medium text-slate-900">{requesterCompanyName}</dd>
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

          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Response visibility</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Waiting on</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{lifecycle.awaitingLabel}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {lifecycle.awaitingLabel === "Client"
                    ? "EcoFocus has replied and is waiting for client follow-up."
                    : lifecycle.awaitingLabel === "EcoFocus"
                      ? "The latest visible update came from the client side."
                      : lifecycle.awaitingLabel === "Completed"
                        ? "Support marked this ticket as complete. Archive it once the record no longer needs to stay in the active queue."
                      : lifecycle.awaitingLabel === "Closed"
                        ? "This ticket is archived."
                        : "Waiting for the first support action."}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">First response</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{formatResponseTime(lifecycle.firstResponseMinutes)}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {lifecycle.firstSupportReplyAt
                    ? `Responded on ${formatDateTime(lifecycle.firstSupportReplyAt)}`
                    : "No support reply has been posted yet."}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Latest visible reply</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {lifecycle.latestVisibleReplyAuthorName || "No replies yet"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {lifecycle.latestVisibleReplyAt
                    ? `${formatDateTime(lifecycle.latestVisibleReplyAt)}`
                    : "This conversation only has the opening request right now."}
                </p>
              </div>
            </div>
          </div>

          {showInternal ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-950">SLA and escalation</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">First response target</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {formatResponseTarget(lifecycle.firstResponseTargetMinutes)}
                  </p>
                  <p className={`mt-2 text-sm ${lifecycle.firstResponseBreached ? "text-rose-700" : "text-slate-600"}`}>
                    {lifecycle.firstResponseBreached
                      ? `Breached on ${formatDateTime(lifecycle.firstResponseDueAt)}`
                      : `Due by ${formatDateTime(lifecycle.firstResponseDueAt)}`}
                  </p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Escalation state</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{lifecycle.escalationLabel}</p>
                  <p className="mt-2 text-sm text-slate-600">{lifecycle.escalationReason}</p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ticket age and follow-up</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{formatTicketAge(lifecycle.ticketAgeMinutes)}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {lifecycle.minutesSinceVisibleReply != null
                      ? `Latest visible reply was ${formatTicketAge(lifecycle.minutesSinceVisibleReply).replace(" old", "")} ago.`
                      : "No visible replies have been added yet."}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

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

              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Ticket history</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A running audit trail of support-admin actions for this ticket, including assignment changes, internal notes, replies, and queue updates.
                </p>
                <div className="mt-4 space-y-3">
                  {historyLogs.length ? (
                    historyLogs.map((log) => (
                      <div key={log.id} className="rounded-[24px] bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-900">
                            {typeof log.metadata?.action === "string"
                              ? log.metadata.action.replaceAll("_", " ")
                              : "admin action"}
                          </p>
                          <p className="text-xs text-slate-500">{formatDateTime(log.eventAt)}</p>
                        </div>
                        <p className="mt-2 text-sm text-slate-700">
                          {authorsById.get(log.userId)?.name || String(log.metadata?.actorName || log.userId)}
                        </p>
                        {log.notes ? <p className="mt-1 text-sm text-slate-600">{log.notes}</p> : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                      Ticket history will appear here as support admins work the issue.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function renderMessageBody(body: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const lines = body.split("\n");
  const blocks: Array<
    | { type: "paragraph"; text: string }
    | { type: "attachment"; name: string; url?: string; isImage: boolean }
    | { type: "quote"; text: string }
    | { type: "list"; items: string[] }
    | { type: "code"; text: string }
  > = [];
  const isImageUrl = (value: string) => /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(value);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() || "";
    const nextLine = lines[index + 1]?.trim() || "";
    const thirdLine = lines[index + 2]?.trim() || "";

    if ((line === "Attachment:" || line === "Attachment noted:") && nextLine) {
      const attachmentUrl = /^https?:\/\/[^\s]+$/.test(thirdLine) ? thirdLine : undefined;
      blocks.push({
        type: "attachment",
        name: nextLine,
        url: attachmentUrl,
        isImage: attachmentUrl ? isImageUrl(attachmentUrl) : false,
      });
      index += attachmentUrl ? 2 : 1;
      continue;
    }

    if (line === "```") {
      const codeLines: string[] = [];
      let cursor = index + 1;
      while (cursor < lines.length && lines[cursor]?.trim() !== "```") {
        codeLines.push(lines[cursor] || "");
        cursor += 1;
      }
      blocks.push({ type: "code", text: codeLines.join("\n") });
      index = cursor;
      continue;
    }

    if (line.startsWith(">")) {
      blocks.push({ type: "quote", text: line.replace(/^>\s?/, "") });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [line.replace(/^[-*]\s+/, "")];
      let cursor = index + 1;
      while (cursor < lines.length && /^[-*]\s+/.test(lines[cursor]?.trim() || "")) {
        items.push((lines[cursor] || "").trim().replace(/^[-*]\s+/, ""));
        cursor += 1;
      }
      blocks.push({ type: "list", items });
      index = cursor - 1;
      continue;
    }

    if (line) {
      blocks.push({ type: "paragraph", text: line });
    }
  }

  return blocks.map((block, index) => {
    if (block.type === "quote") {
      return (
        <blockquote
          key={`${index}-${block.text.slice(0, 12)}`}
          className="rounded-r-[18px] border-l-4 border-emerald-300 bg-white px-4 py-3 text-slate-700"
        >
          {block.text}
        </blockquote>
      );
    }

    if (block.type === "list") {
      return (
        <ul key={`${index}-${block.items[0]?.slice(0, 12) || "list"}`} className="space-y-2 pl-5">
          {block.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`} className="list-disc text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    if (block.type === "code") {
      return (
        <pre
          key={`${index}-${block.text.slice(0, 12)}`}
          className="overflow-x-auto rounded-[20px] bg-slate-950 px-4 py-3 text-sm text-slate-100"
        >
          <code>{block.text}</code>
        </pre>
      );
    }

    if (block.type === "attachment") {
      const cardContent = (
        <>
          {block.isImage && block.url ? (
            <img src={block.url} alt={block.name} className="max-h-72 w-full object-cover" />
          ) : (
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{block.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {block.url ? "Attachment ready to open" : "Attachment name recorded"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {block.isImage ? "Image" : "File"}
              </span>
            </div>
          )}
          <div className="border-t border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{block.name}</p>
            {block.url ? (
              <span className="mt-1 inline-flex text-sm font-medium text-emerald-700 underline underline-offset-2">
                {block.isImage ? "Open image attachment" : "Open attachment"}
              </span>
            ) : (
              <span className="mt-1 inline-flex text-sm text-slate-500">Attachment URL unavailable</span>
            )}
          </div>
        </>
      );

      if (block.url) {
        return (
          <a
            key={`${index}-${block.name}`}
            href={block.url}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-[20px] border border-slate-200 bg-white transition hover:border-emerald-300"
          >
            {cardContent}
          </a>
        );
      }

      return (
        <div
          key={`${index}-${block.name}`}
          className="overflow-hidden rounded-[20px] border border-slate-200 bg-white"
        >
          {cardContent}
        </div>
      );
    }

    const parts = block.text.split(urlPattern);
    return (
      <p key={`${index}-${block.text.slice(0, 12)}`} className="break-words whitespace-pre-wrap">
        {parts.map((part, partIndex) =>
          /^https?:\/\/[^\s]+$/.test(part) ? (
            <Link
              key={`${index}-${partIndex}`}
              href={part}
              target="_blank"
              rel="noreferrer"
              className="break-all font-medium text-emerald-700 underline underline-offset-2"
            >
              {part}
            </Link>
          ) : (
            <span key={`${index}-${partIndex}`}>{part}</span>
          ),
        )}
      </p>
    );
  });
}
