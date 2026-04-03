"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Shield } from "lucide-react";

export function PortalSessionMenu({
  userName,
  userRoleLabel,
  workspaceName,
  workspaceDescription,
  billedToName,
  showBilledTo,
  showDevBypassSession,
  hasSession,
}: {
  userName: string;
  userRoleLabel: string;
  workspaceName: string;
  workspaceDescription: string;
  billedToName?: string;
  showBilledTo: boolean;
  showDevBypassSession: boolean;
  hasSession: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-20 w-full max-w-sm xl:min-w-[320px]">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                <Shield className="h-3.5 w-3.5" />
                <span>Signed In</span>
              </div>
              <p className="mt-2 text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-emerald-50/75">{userRoleLabel}</p>
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 text-emerald-100 transition ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+0.75rem)] right-4 w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 px-4 py-3 text-sm text-emerald-50/85 shadow-[0_24px_80px_-40px_rgba(2,44,34,0.9)] backdrop-blur">
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Workspace</p>
              <p className="mt-1 font-medium text-white">{workspaceName}</p>
              <p className="text-xs text-emerald-50/75">{workspaceDescription}</p>
            </div>
            {showBilledTo && billedToName ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Billed To</p>
                <p className="mt-1 font-medium text-white">{billedToName}</p>
                <p className="text-xs text-emerald-50/75">Seats and usage stay with the subscriber that owns this login.</p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/portal/account"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
              >
                Account
              </Link>
              {showDevBypassSession ? (
                <form action="/portal/dev-logout" method="post">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>End test session</span>
                  </button>
                </form>
              ) : null}
              {hasSession ? (
                <form action="/api/portal/logout" method="post">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log out</span>
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
