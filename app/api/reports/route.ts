// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { listReports } from "@/lib/reports-repo";

export const revalidate = 60;

function normalizeAccess(val: string | null): "All" | "Free" | "Premium" {
  if (!val) return "All";
  const x = val.trim().toLowerCase();
  if (x === "free") return "Free";
  if (x === "premium") return "Premium";
  if (x === "all") return "All";
  // tolerate "Free"/"Premium" etc.
  if (x === "free" || x === "premium") return x === "free" ? "Free" : "Premium";
  return val === "Free" || val === "Premium" ? (val as any) : "All";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const data = await listReports({
    q: searchParams.get("q") || undefined,
    year: searchParams.get("year") || undefined,
    topic: searchParams.get("topic") || undefined,
    type: searchParams.get("type") || undefined,
    access: normalizeAccess(searchParams.get("access")),
    sort: ((searchParams.get("sort") as any) || "Newest") as "Newest" | "AtoZ",
    limit: Number(searchParams.get("limit") || 24),
    cursor: searchParams.get("cursor") || undefined,
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      "x-reports-total": String(data.total ?? data.items.length),
    },
  });
}



