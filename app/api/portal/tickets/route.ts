import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalDashboardsForUser } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type TicketBody = {
  dashboardName?: string;
  issueType?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  description?: string;
  notes?: string;
  attachmentName?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

const ATTACHMENT_BUCKET = "portal-support-attachments";
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

async function ensureAttachmentBucket() {
  const admin = getServiceSupabase();
  const { data: bucket } = await admin.storage.getBucket(ATTACHMENT_BUCKET).catch(() => ({ data: null }));
  if (bucket) return;

  const { error } = await admin.storage.createBucket(ATTACHMENT_BUCKET, {
    public: false,
    fileSizeLimit: `${MAX_ATTACHMENT_SIZE}`,
  });

  if (error && !error.message.toLowerCase().includes("already")) {
    throw new Error(error.message);
  }
}

function sanitizeAttachmentName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}

async function uploadAttachment({
  ticketId,
  companyId,
  file,
}: {
  ticketId: string;
  companyId: string;
  file: File;
}) {
  if (!file.size) return null;
  if (file.size > MAX_ATTACHMENT_SIZE) {
    throw new Error("Attachments must be 10 MB or smaller.");
  }

  await ensureAttachmentBucket();
  const admin = getServiceSupabase();
  const safeName = sanitizeAttachmentName(file.name || "attachment");
  const path = `${companyId}/${ticketId}/${crypto.randomUUID()}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage.from(ATTACHMENT_BUCKET).upload(path, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: signedUrlData, error: signedUrlError } = await admin.storage
    .from(ATTACHMENT_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 30);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    throw new Error(signedUrlError?.message || "Unable to create attachment link.");
  }

  return {
    name: file.name || safeName,
    url: signedUrlData.signedUrl,
  };
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: TicketBody;
  let attachmentFile: File | null = null;
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = {
        dashboardName: String(formData.get("dashboardName") || ""),
        issueType: String(formData.get("issueType") || ""),
        priority: (String(formData.get("priority") || "medium") as TicketBody["priority"]) || "medium",
        description: String(formData.get("description") || ""),
        notes: String(formData.get("notes") || ""),
        attachmentName: String(formData.get("attachmentName") || ""),
      };
      const attachment = formData.get("attachment");
      attachmentFile = attachment instanceof File && attachment.size > 0 ? attachment : null;
    } else {
      body = (await req.json()) as TicketBody;
    }
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const dashboardName = String(body.dashboardName || "").trim();
  const issueType = String(body.issueType || "").trim();
  const priority = body.priority || "medium";
  const description = String(body.description || "").trim();
  const notes = String(body.notes || "").trim();
  const attachmentName = String(body.attachmentName || "").trim();

  if (!dashboardName || !issueType || !description) {
    return asJson({ error: "dashboardName, issueType, and description are required." }, 400);
  }

  const allowedDashboard = (await getPortalDashboardsForUser(access.user)).find((dashboard) => dashboard.name === dashboardName);
  if (!allowedDashboard) {
    return asJson({ error: "Dashboard not available for this user." }, 403);
  }

  const ticketId = `TCK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const subject = `${issueType}: ${dashboardName}`;

  try {
    const admin = getServiceSupabase();
    const now = new Date().toISOString();
    const { error: ticketError } = await admin.from("portal_tickets").insert({
      id: ticketId,
      company_id: access.company.id,
      subject,
      dashboard_name: dashboardName,
      issue_type: issueType,
      priority,
      status: "open",
      requester_id: access.user.id,
      owner_id: null,
      created_at: now,
      updated_at: now,
    });

    if (ticketError) {
      return asJson({ error: ticketError.message }, 500);
    }

    const attachment = attachmentFile
      ? await uploadAttachment({
          ticketId,
          companyId: access.company.id,
          file: attachmentFile,
        })
      : null;

    const attachmentSection = attachment
      ? `\n\nAttachment:\n${attachment.name}\n${attachment.url}`
      : attachmentName
        ? `\n\nAttachment noted:\n${attachmentName}`
        : "";
    const messageBody = notes
      ? `${description}\n\nEnvironment notes:\n${notes}${attachmentSection}`
      : `${description}${attachmentSection}`;

    const { error: messageError } = await admin.from("portal_ticket_messages").insert({
      ticket_id: ticketId,
      author_id: access.user.id,
      body: messageBody,
      is_internal: false,
      created_at: now,
    });

    if (messageError) {
      await admin.from("portal_tickets").delete().eq("id", ticketId);
      return asJson({ error: messageError.message }, 500);
    }

    return asJson({ ok: true, ticketId }, 201);
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Ticket storage unavailable.",
      },
      503,
    );
  }
}
