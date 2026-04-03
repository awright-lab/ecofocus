import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalTicketForUser, getPortalUsersByIds } from "@/lib/portal/data";
import { notifyClientOfPortalTicketUpdate } from "@/lib/portal/email";
import { appendAttachmentToMessage, uploadSupportAttachment } from "@/lib/portal/support-attachments";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type MessageBody = {
  body?: string;
  isInternal?: boolean;
  attachmentName?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to reply." }, 403);
  }

  const { id } = await params;
  const ticket = await getPortalTicketForUser(access.effectiveUser, id);
  if (!ticket) {
    return asJson({ error: "Ticket not found." }, 404);
  }
  if (ticket.status === "archived") {
    return asJson({ error: "Archived tickets are read-only." }, 400);
  }

  let payload: MessageBody;
  let attachmentFile: File | null = null;
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      payload = {
        body: String(formData.get("body") || ""),
        isInternal: String(formData.get("isInternal") || "") === "true",
        attachmentName: String(formData.get("attachmentName") || ""),
      };
      const attachment = formData.get("attachment");
      attachmentFile = attachment instanceof File && attachment.size > 0 ? attachment : null;
    } else {
      payload = (await req.json()) as MessageBody;
    }
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const body = String(payload.body || "").trim();
  const isInternal = access.user.role === "support_admin" ? Boolean(payload.isInternal) : false;
  const attachmentName = String(payload.attachmentName || "").trim();

  if (!body && !attachmentFile) {
    return asJson({ error: "Reply text or an attachment is required." }, 400);
  }

  try {
    const admin = getServiceSupabase();
    const now = new Date().toISOString();
    const attachment = attachmentFile
      ? await uploadSupportAttachment({
          ticketId: ticket.id,
          companyId: access.company.id,
          file: attachmentFile,
        })
      : null;
    const messageBody = appendAttachmentToMessage(body || "Attachment added.", attachment, attachmentName);
    const { error } = await admin.from("portal_ticket_messages").insert({
      ticket_id: ticket.id,
      author_id: access.user.id,
      body: messageBody,
      is_internal: isInternal,
      created_at: now,
    });

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    if (access.user.role === "support_admin") {
      await admin
        .from("portal_tickets")
        .update({
          status: isInternal || ticket.status === "completed" ? ticket.status : "in_progress",
          owner_id: ticket.ownerId || access.user.id,
          updated_at: now,
        })
        .eq("id", ticket.id);

      await logPortalAdminAuditEvent({
        access,
        action: isInternal ? "ticket_internal_note" : "ticket_reply",
        title: ticket.subject,
        companyId: ticket.companyId,
        entityId: ticket.id,
        notes: isInternal
          ? "Support admin saved an internal note."
          : "Support admin posted a client-visible reply.",
        metadata: {
          ticketId: ticket.id,
          dashboardName: ticket.dashboardName,
          hasAttachment: Boolean(attachment),
        },
      });

      if (!isInternal) {
        const [requester] = await getPortalUsersByIds([ticket.requesterId]);
        if (requester) {
          try {
            await notifyClientOfPortalTicketUpdate({
              actionLabel: "Support reply",
              actor: access.user,
              dashboardName: ticket.dashboardName,
              message: body || attachmentName || "EcoFocus Support added a reply to your ticket.",
              origin: req.nextUrl.origin,
              requester,
              statusLabel: ticket.status === "completed" ? ticket.status : "in_progress",
              ticketId: ticket.id,
              ticketSubject: ticket.subject,
            });
          } catch (emailError) {
            console.warn("[api/portal/tickets/messages] Client notification email failed.", {
              ticketId: ticket.id,
              error: emailError instanceof Error ? emailError.message : String(emailError),
            });
          }
        }
      }
    } else {
      const updatePayload: Record<string, unknown> = {
        status: "open",
        updated_at: now,
      };
      if (ticket.status === "completed") {
        updatePayload.completed_at = null;
        updatePayload.client_reviewed_completed_at = null;
      }
      await admin.from("portal_tickets").update(updatePayload).eq("id", ticket.id);
    }

    return asJson({ ok: true }, 201);
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Ticket message storage unavailable.",
      },
      503,
    );
  }
}
