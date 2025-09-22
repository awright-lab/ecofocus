// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { listReports } from "@/lib/reports-repo";

export const revalidate = 60; // cache at the route level (optional)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await listReports({
    q: searchParams.get("q") || undefined,
    year: searchParams.get("year") || undefined,
    topic: searchParams.get("topic") || undefined,
    type: searchParams.get("type") || undefined,
    sort: (searchParams.get("sort") as any) || "Newest",
    limit: Number(searchParams.get("limit") || 24),
    cursor: searchParams.get("cursor") || undefined,
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
