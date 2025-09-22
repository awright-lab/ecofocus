// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { listReports } from "@/lib/reports-repo";

export const revalidate = 0;

function normalizeAccess(val: string | null): "All" | "Free" | "Premium" {
  if (!val) return "All";
  const x = val.trim().toLowerCase();
  if (x === "free") return "Free";
  if (x === "premium") return "Premium";
  if (x === "all") return "All";
  return "All";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") || 24);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const cursor = String((page - 1) * limit); // 0-based start index

  const data = await listReports({
    q: searchParams.get("q") || undefined,
    year: searchParams.get("year") || undefined,
    topic: searchParams.get("topic") || undefined,
    type: searchParams.get("type") || undefined,
    access: normalizeAccess(searchParams.get("access")),
    sort: ((searchParams.get("sort") as any) || "Newest") as "Newest" | "AtoZ",
    limit,
    cursor,
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
      "x-reports-total": String(data.total ?? data.items.length),
      "x-reports-limit": String(limit),
      "x-reports-page": String(page),
    },
  });
}



