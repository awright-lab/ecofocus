// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { listReports } from "@/lib/reports-repo";

export const revalidate = 0; // do not prerender this route

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

  const q = searchParams.get("q") || undefined;
  const year = searchParams.get("year") || undefined;
  const topic = searchParams.get("topic") || undefined;
  const type = searchParams.get("type") || undefined;
  const sort = ((searchParams.get("sort") as any) || "Newest") as "Newest" | "AtoZ";
  const limit = Number(searchParams.get("limit") || 24);
  const cursor = searchParams.get("cursor") || undefined;

  const access = normalizeAccess(searchParams.get("access"));

  const data = await listReports({
    q, year, topic, type, access, sort, limit, cursor,
  });

  return NextResponse.json(data, {
    headers: {
      // Kill caching while we stabilize filters:
      "Cache-Control": "no-store, must-revalidate",
      // Quick inspection helpers:
      "x-reports-total": String(data.total ?? data.items.length),
      "x-reports-access": access,
    },
  });
}



