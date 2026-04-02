"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AuditFilterOption = {
  id: string;
  name: string;
};

export function AdminAuditFilters({
  companies,
  selectedCompanyId,
  selectedUserId,
  selectedStart,
  selectedEnd,
  users,
}: {
  companies: AuditFilterOption[];
  selectedCompanyId: string;
  selectedUserId: string;
  selectedStart: string;
  selectedEnd: string;
  users: AuditFilterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function pushParams(nextParams: URLSearchParams) {
    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`);
    });
  }

  function handleWorkspaceChange(nextCompanyId: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("company", nextCompanyId);
    nextParams.delete("user");
    nextParams.delete("embedPage");
    nextParams.delete("usagePage");
    pushParams(nextParams);
  }

  function applyPreset(preset: "today" | "last_7_days" | "this_month") {
    const now = new Date();
    const formatDate = (value: Date) => value.toISOString().slice(0, 10);
    const nextParams = new URLSearchParams(searchParams.toString());

    if (preset === "today") {
      const today = formatDate(now);
      nextParams.set("start", today);
      nextParams.set("end", today);
    }

    if (preset === "last_7_days") {
      const start = new Date(now);
      start.setUTCDate(start.getUTCDate() - 6);
      nextParams.set("start", formatDate(start));
      nextParams.set("end", formatDate(now));
    }

    if (preset === "this_month") {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      nextParams.set("start", formatDate(start));
      nextParams.set("end", formatDate(now));
    }

    nextParams.delete("embedPage");
    nextParams.delete("usagePage");
    pushParams(nextParams);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => applyPreset("today")}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => applyPreset("last_7_days")}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          Last 7 days
        </button>
        <button
          type="button"
          onClick={() => applyPreset("this_month")}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          This month
        </button>
      </div>
      <form method="get" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Workspace</span>
        <select
          name="company"
          value={selectedCompanyId}
          onChange={(event) => handleWorkspaceChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">User</span>
        <select
          name="user"
          defaultValue={selectedUserId}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">All users</option>
          {users.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Start date</span>
        <input
          type="date"
          name="start"
          defaultValue={selectedStart}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">End date</span>
        <input
          type="date"
          name="end"
          defaultValue={selectedEnd}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </label>
      <div className="flex items-end gap-3">
        <button
          type="submit"
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Apply filters
        </button>
        <a
          href="/portal/admin/audit"
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          Clear
        </a>
      </div>
      {isPending ? <p className="text-xs text-emerald-700 xl:col-span-5">Loading audit filters…</p> : null}
      </form>
    </div>
  );
}
