"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, ShieldAlert } from "lucide-react";
import type { PortalPreviewRole } from "@/lib/portal/types";

function formatRoleLabel(role: PortalPreviewRole | "off") {
  if (role === "off") return "EcoFocus admin";
  return role.replace("_", " ");
}

export function PreviewModeControls({
  workspaceName,
  previewRole,
  previewableRoles,
}: {
  workspaceName: string;
  previewRole: PortalPreviewRole | null;
  previewableRoles: PortalPreviewRole[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  if (!previewableRoles.length) {
    return null;
  }

  function updatePreview(role: PortalPreviewRole | "off") {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/portal/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        });

        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          setError(data.error || "Unable to switch preview mode.");
          return;
        }

        setIsOpen(false);
        router.refresh();
      } catch {
        setError("Unable to switch preview mode.");
      }
    });
  }

  const currentLabel = previewRole ? formatRoleLabel(previewRole) : "EcoFocus admin";

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(360px,calc(100vw-2rem))]">
      <details
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
        className="overflow-hidden rounded-[24px] border border-slate-900/10 bg-slate-950 text-white shadow-[0_24px_80px_-35px_rgba(15,23,42,0.7)]"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
              <Eye className="h-3.5 w-3.5" />
              <span>Support Preview</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">Viewing {workspaceName}</p>
            <p className="text-xs text-emerald-100/80">Current mode: {currentLabel}</p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-emerald-100 transition [&_details[open]_&]:rotate-180" />
        </summary>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
            <div className="flex items-center gap-2 font-semibold text-amber-50">
              <ShieldAlert className="h-4 w-4" />
              <span>Read-only simulation</span>
            </div>
            <p className="mt-1">
              This mode renders the portal like a workspace member would see it, but blocks account,
              invite, ticket, and configuration changes.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => updatePreview("off")}
              disabled={isPending}
              className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${
                !previewRole
                  ? "border-emerald-300 bg-emerald-500/15 text-white"
                  : "border-white/10 bg-white/5 text-emerald-50/85 hover:bg-white/10"
              }`}
            >
              <div className="font-semibold">EcoFocus admin</div>
              <div className="mt-1 text-xs text-emerald-100/70">Return to the full internal support workspace.</div>
            </button>

            {previewableRoles.map((role) => {
              const active = previewRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => updatePreview(role)}
                  disabled={isPending}
                  className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${
                    active
                      ? "border-emerald-300 bg-emerald-500/15 text-white"
                      : "border-white/10 bg-white/5 text-emerald-50/85 hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">{formatRoleLabel(role)}</div>
                  <div className="mt-1 text-xs text-emerald-100/70">Render navigation and permissions as this workspace role.</div>
                </button>
              );
            })}
          </div>

          {error ? <p className="mt-3 text-xs font-medium text-rose-300">{error}</p> : null}
        </div>
      </details>
    </div>
  );
}
