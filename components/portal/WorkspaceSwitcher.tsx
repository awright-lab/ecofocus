"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type WorkspaceOption = {
  id: string;
  name: string;
  subscriberType?: string;
};

export function WorkspaceSwitcher({
  companies,
  currentCompanyId,
  variant = "hero",
}: {
  companies: WorkspaceOption[];
  currentCompanyId: string;
  variant?: "hero" | "sidebar";
}) {
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState(currentCompanyId);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onChange(nextCompanyId: string) {
    setSelectedCompanyId(nextCompanyId);
    setError(null);

    try {
      const response = await fetch("/api/portal/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyId: nextCompanyId }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Unable to switch workspace.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to switch workspace.");
      setSelectedCompanyId(currentCompanyId);
    }
  }

  const isSidebar = variant === "sidebar";

  return (
    <div className={isSidebar ? "mt-4 rounded-2xl bg-slate-50 p-3" : "rounded-2xl border border-white/15 bg-white/10 px-4 py-3"}>
      <p
        className={
          isSidebar
            ? "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500"
            : "text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200"
        }
      >
        Workspace
      </p>
      <select
        value={selectedCompanyId}
        onChange={(event) => onChange(event.target.value)}
        disabled={isPending}
        className={
          isSidebar
            ? "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
            : "mt-2 w-full rounded-xl border border-white/15 bg-slate-950/20 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-300"
        }
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id} className="text-slate-900">
            {company.name}
            {company.subscriberType ? ` (${company.subscriberType})` : ""}
          </option>
        ))}
      </select>
      {error ? (
        <p className={isSidebar ? "mt-2 text-xs text-rose-600" : "mt-2 text-xs text-rose-200"}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
