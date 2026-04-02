import { getServiceSupabase } from "@/lib/supabase/server";

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

export async function uploadSupportAttachment({
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

export function appendAttachmentToMessage(body: string, attachment?: { name: string; url: string } | null, attachmentName?: string) {
  if (attachment) {
    return `${body}\n\nAttachment:\n${attachment.name}\n${attachment.url}`;
  }

  if (attachmentName) {
    return `${body}\n\nAttachment noted:\n${attachmentName}`;
  }

  return body;
}
