import { NextResponse } from "next/server";
import { getReportOrderStatus } from "@/lib/report-orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let sessionId: unknown;
  try { sessionId = (await req.json())?.sessionId; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof sessionId !== "string" || !/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId)) return NextResponse.json({ error: "Invalid order link." }, { status: 400 });
  try {
    const { state } = await getReportOrderStatus(sessionId);
    return NextResponse.json({ state }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Report status check failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "We couldn’t check your payment right now. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
