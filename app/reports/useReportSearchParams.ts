"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type Access = "All" | "Free" | "Premium";
export type Sort = "Newest" | "AtoZ";

export function useReportSearchParams() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const access = toCanonicalAccess(sp.get("access"));
  const year = sp.get("year") ?? "All";
  const topic = sp.get("topic") ?? "All";
  const type = sp.get("type") ?? "All";
  const sort = (sp.get("sort") as Sort) ?? "Newest";
  const limit = Math.max(1, parseInt(sp.get("limit") ?? "12", 10));

  function setParam(key: string, val?: string | number | null) {
    const next = new URLSearchParams(sp.toString());
    if (!val || val === "All" || val === "0" || val === "all") next.delete(key);
    else next.set(key, String(val));
    // When filters change, let the backend decide cursor again by removing it.
    next.delete("cursor");
    router.push(`${pathname}?${next.toString()}`);
  }

  const baseQuery = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    const a = toParamAccess(access);
    if (a) p.set("access", a);
    if (year !== "All") p.set("year", year);
    if (topic !== "All") p.set("topic", topic);
    if (type !== "All") p.set("type", type);
    p.set("sort", sort);
    p.set("limit", String(limit));
    return p;
  }, [q, access, year, topic, type, sort, limit]);

  return {
    pathname,
    router,
    searchParams: sp,
    values: { q, access, year, topic, type, sort, limit },
    setParam,
    baseQuery,
  };
}

function toCanonicalAccess(v: string | null): Access {
  const x = (v ?? "All").toLowerCase();
  if (x === "free") return "Free";
  if (x === "premium") return "Premium";
  return "All";
}
function toParamAccess(v: Access) {
  return v === "All" ? undefined : v.toLowerCase();
}
