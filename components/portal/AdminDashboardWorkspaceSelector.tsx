"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type WorkspaceOption = {
  id: string;
  name: string;
  subtitle: string;
};

export function AdminDashboardWorkspaceSelector({
  companies,
  selectedCompanyId,
}: {
  companies: WorkspaceOption[];
  selectedCompanyId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return companies;

    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.id.toLowerCase().includes(normalizedQuery) ||
        company.subtitle.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [companies, query]);

  function openCompany(companyId: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("company", companyId);
    nextParams.delete("start");
    nextParams.delete("end");
    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`);
    });
  }

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Workspace selection</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search across all client and internal workspaces, then jump straight into dashboard assignment for the one you need.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {companies.length} workspaces
        </div>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-600">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by workspace name or ID"
          className="w-full bg-transparent outline-none"
        />
      </label>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {filteredCompanies.slice(0, 8).map((company) => {
          const isSelected = company.id === selectedCompanyId;
          return (
            <button
              key={company.id}
              type="button"
              onClick={() => openCompany(company.id)}
              className={`rounded-[24px] border px-4 py-4 text-left transition ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <p className="font-semibold text-slate-900">{company.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{company.subtitle}</p>
              <p className="mt-1 text-sm text-slate-600">{company.id}</p>
            </button>
          );
        })}
      </div>

      {filteredCompanies.length > 8 ? (
        <p className="mt-4 text-xs text-slate-500">
          Showing the first 8 matches. Narrow the search to reach a specific workspace faster.
        </p>
      ) : null}

      {!filteredCompanies.length ? (
        <div className="mt-5 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
          No workspaces match this search yet.
        </div>
      ) : null}

      {isPending ? <p className="mt-4 text-xs text-emerald-700">Loading workspace…</p> : null}
    </div>
  );
}
