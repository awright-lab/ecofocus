"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

type WorkspaceOption = {
  id: string;
  name: string;
  subtitle: string;
};

export function AdminWorkspacePicker({
  companies,
  selectedCompanyId,
}: {
  companies: WorkspaceOption[];
  selectedCompanyId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || companies[0] || null;
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
    nextParams.delete("user");
    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`);
    });
    setIsOpen(false);
  }

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Workspace selection</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search across all client and internal workspaces, then choose the one whose dashboard access you want to edit.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {companies.length} workspaces
        </div>
      </div>

      <div className="relative mt-5">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-[24px] border border-slate-300 bg-slate-50 px-5 py-4 text-left transition hover:border-emerald-300"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Editing workspace</p>
            <p className="mt-1 text-base font-semibold text-slate-950">{selectedCompany?.name || "Select workspace"}</p>
            <p className="mt-1 text-sm text-slate-600">{selectedCompany?.subtitle || "No workspace selected"}</p>
          </div>
          <ChevronDown className={`h-5 w-5 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen ? (
          <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-20 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.45)]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-600">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by workspace name or ID"
                className="w-full bg-transparent outline-none"
              />
            </label>

            <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto">
              {filteredCompanies.map((company) => {
                const isSelected = company.id === selectedCompanyId;
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => openCompany(company.id)}
                    className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${
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

            {!filteredCompanies.length ? (
              <div className="mt-4 rounded-[20px] bg-slate-50 p-4 text-sm text-slate-600">
                No workspaces match this search yet.
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {isPending ? <p className="mt-4 text-xs text-emerald-700">Loading workspace…</p> : null}
    </div>
  );
}
