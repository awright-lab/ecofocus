"use client";

import Image from "next/image";
import { Paperclip, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function TicketReplyForm({
  ticketId,
  allowInternalNotes = false,
  readOnly = false,
}: {
  ticketId: string;
  allowInternalNotes?: boolean;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentPreviewUrl = useMemo(() => {
    if (!attachmentFile || !attachmentFile.type.startsWith("image/")) return null;
    return URL.createObjectURL(attachmentFile);
  }, [attachmentFile]);

  useEffect(() => {
    return () => {
      if (attachmentPreviewUrl) {
        URL.revokeObjectURL(attachmentPreviewUrl);
      }
    };
  }, [attachmentPreviewUrl]);

  function setSelectedAttachment(file: File | null) {
    setAttachmentFile(file);
    setAttachmentName(file?.name || "");
    setUploadProgress(null);
  }

  function clearAttachment() {
    setSelectedAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function formatFileSize(size: number) {
    if (size < 1024 * 1024) {
      return `${Math.max(size / 1024, 0.1).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly) {
      setError("Replies are disabled while support preview mode is active.");
      return;
    }
    if (!body.trim() && !attachmentFile) {
      setError("Reply text or an attachment is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.set("body", body);
      payload.set("isInternal", String(isInternal));
      payload.set("attachmentName", attachmentName);
      if (attachmentFile) {
        payload.set("attachment", attachmentFile);
      }

      const response = await new Promise<{ ok: boolean; data: { error?: string } }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/portal/tickets/${ticketId}/messages`);
        xhr.responseType = "json";
        xhr.upload.onprogress = (progressEvent) => {
          if (progressEvent.lengthComputable) {
            setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
          }
        };
        xhr.onload = () => {
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            data: (xhr.response || {}) as { error?: string },
          });
        };
        xhr.onerror = () => reject(new Error("upload_failed"));
        xhr.send(payload);
      });

      if (!response.ok) {
        setError(response.data.error || "We couldn't post your reply. Please try again.");
        setIsSubmitting(false);
        setUploadProgress(null);
        return;
      }

      setBody("");
      setIsInternal(false);
      clearAttachment();
      setIsSubmitting(false);
      setUploadProgress(null);
      router.refresh();
    } catch {
      setError("We couldn't post your reply. Please try again.");
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        disabled={readOnly}
        className="w-full rounded-[24px] border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        placeholder={allowInternalNotes ? "Add a client reply or internal support note." : "Reply with any additional context, screenshots, or follow-up questions."}
      />
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!readOnly) setIsDraggingFile(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDraggingFile(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingFile(false);
          if (readOnly) return;
          const file = event.dataTransfer.files?.[0] || null;
          setSelectedAttachment(file);
        }}
        className={`rounded-[24px] border border-dashed p-4 transition ${
          isDraggingFile ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-slate-50"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Attachment</p>
            <p className="mt-1 text-xs text-slate-500">
              Drag and drop a screenshot or choose a file to include with this reply.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={readOnly}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            Choose file
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setSelectedAttachment(file);
          }}
          disabled={readOnly}
          className="hidden"
        />
        {attachmentFile ? (
          <div className="mt-4 rounded-[20px] border border-slate-200 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                {attachmentPreviewUrl ? (
                  <Image
                    src={attachmentPreviewUrl}
                    alt={attachmentFile.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <Paperclip className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{attachmentName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {attachmentFile.type || "Unknown file type"} · {formatFileSize(attachmentFile.size)}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {attachmentPreviewUrl ? "Image preview will be included with the message." : "Attachment link will be added to the message thread."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearAttachment}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
            {uploadProgress != null ? (
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width]"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-600">Uploading {uploadProgress}%</p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">PNG, JPG, PDF, spreadsheets, and other support files up to 10 MB.</p>
        )}
      </div>
      {allowInternalNotes ? (
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(event) => setIsInternal(event.target.checked)}
            disabled={readOnly}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          />
          Save this as an internal support note
        </label>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || readOnly}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {readOnly ? "Reply disabled in preview" : isSubmitting ? "Sending..." : allowInternalNotes && isInternal ? "Save internal note" : "Send reply"}
        </button>
        <p className="text-xs text-slate-500">Tip: paste screenshot links, quote lines with <code>&gt;</code>, or drop files directly here.</p>
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    </form>
  );
}
