// app/reports/useReportSearchParams.ts
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Access = "All" | "Free" | "Premium";
export type Sort = "Newest" | "AtoZ";

function normAccess(v: string | null): Access {
  if (!v) return "All";
  const x = v.toLowerCase();
  if (x === "free") return "Free";
  if (x === "premium") return "Premium";
  return "All";
}

export function useReportSearchParams() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const values = {
    q: sp.get("q") ?? "",
    access: normAccess(sp.get("access")),
    year: sp.get("year") ?? "All",
    topic: sp.get("topic") ?? "All",
    type: sp.get("type") ?? "All",
    sort: (sp.get("sort") as Sort) || "Newest",
    limit: Number(sp.get("limit") || 24),
    page: Math.max(1, Number(sp.get("page") || 1)),
  };

  function setParam(key: string, val?: string | number | null) {
    const next = new URLSearchParams(sp.toString());

    const set = (k: string, v?: string | number | null) => {
      if (v === undefined || v === null || v === "" || v === "All") next.delete(k);
      else next.set(k, String(v));
    };

    if (key === "access") {
      const canon = typeof val === "string" ? val.toLowerCase() : "";
      if (!val || val === "All") next.delete("access");
      else next.set("access", canon); // free|premium
    } else if (key === "page") {
      set("page", val ?? 1);
    } else {
      set(key, val as any);
      // any non-page change resets to page 1
      next.delete("page");
    }

    // always keep limit & sort if present; otherwise default is fine
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return { values, setParam };
}

