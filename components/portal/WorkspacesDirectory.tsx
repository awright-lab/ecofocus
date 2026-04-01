"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { EmptyState } from "@/components/portal/EmptyState";
import type { PortalCompany } from "@/lib/portal/types";
import { cx } from "@/lib/utils";

const PAGE_SIZE = 6;

function getCompanyInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) return "EF";
  return words.map((word) => word[0]?.toUpperCase() || "").join("");
}

export function WorkspacesDirectory({
  companies,
  currentCompanyId,
  isSupportAdmin,
}: {
  companies: PortalCompany[];
  currentCompanyId: string;
  isSupportAdmin: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingCompanyId, setPendingCompanyId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const filteredCompanies = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    if (!query) return companies;

    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(query) ||
        company.id.toLowerCase().includes(query) ||
        (company.subscriberType || "").toLowerCase().includes(query)
      );
    });
  }, [companies, deferredSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedCompanies = filteredCompanies.slice(start, start + PAGE_SIZE);

  function handleWorkspaceSwitch(companyId: string) {
    setPendingCompanyId(companyId);
    startTransition(async () => {
      try {
        const response = await fetch("/api/portal/workspace", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyId }),
        });

        if (!response.ok) {
          setPendingCompanyId(null);
          return;
        }

        router.push("/portal/home");
        router.refresh();
      } finally {
        setPendingCompanyId(null);
      }
    });
  }

  const resultLabel =
    filteredCompanies.length === 1 ? "1 workspace" : `${filteredCompanies.length} workspaces`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm text-slate-600">
            Browse every available company workspace, switch into the one you need, and jump into
            access controls without hunting through a long sidebar list.
          </p>
        </div>
        <div className="w-full max-w-md">
          <label
            htmlFor="workspace-search"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500"
          >
            Search Companies
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="workspace-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by company name, id, or type"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Workspace Directory
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {resultLabel}
            {search.trim() ? ` matching "${search.trim()}"` : " available to this account"}.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            Page {safePage} of {totalPages}
          </div>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={safePage === totalPages}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {paginatedCompanies.length ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {paginatedCompanies.map((company) => {
            const isCurrent = company.id === currentCompanyId;
            const isSwitching = pendingCompanyId === company.id && isPending;
            const subscriberTypeLabel = company.subscriberType
              ? company.subscriberType.replace("_", " ")
              : "subscriber";

            return (
              <article
                key={company.id}
                className={cx(
                  "rounded-[30px] border bg-white p-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.28)] transition",
                  isCurrent ? "border-emerald-300" : "border-slate-200",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#dcfce7_0%,#dbeafe_100%)] text-lg font-semibold text-emerald-900">
                    <span className="sr-only">{company.name} logo placeholder</span>
                    <span>{getCompanyInitials(company.name)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                        {subscriberTypeLabel}
                      </p>
                      {isCurrent ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          Current workspace
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{company.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{company.id}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {isCurrent ? (
                    <Link
                      href="/portal/home"
                      className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Open workspace
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleWorkspaceSwitch(company.id)}
                      disabled={isSwitching}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSwitching ? "Switching..." : "Switch workspace"}
                    </button>
                  )}

                  {isSupportAdmin ? (
                    <Link
                      href={`/portal/admin/dashboards?company=${encodeURIComponent(company.id)}`}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      Manage access
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No workspaces match this search"
          description="Try a different company name, workspace id, or subscriber type."
        />
      )}
    </div>
  );
}
