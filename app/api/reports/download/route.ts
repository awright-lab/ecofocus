import { NextResponse } from "next/server";
import { getPaidReportOrder, getPurchasedReport } from "@/lib/report-orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const sessionId = params.get("session_id") || "";
  const reportId = params.get("report_id") || "";
  try {
    const reportIds = await getPaidReportOrder(sessionId);
    if (!reportIds.includes(reportId)) return NextResponse.json({ error: "This report is not part of your order." }, { status: 403 });
    const file = await getPurchasedReport(reportId);
    const response = await fetch(file.url, { headers: file.headers, cache: "no-store", redirect: "error" });
    if (!response.ok || !response.body) throw new Error("The report file is unavailable.");
    return new Response(response.body, { headers: {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    } });
  } catch (error) {
    console.error("Report download failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "We couldn’t verify this download. Please use your order link or contact us with your receipt." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
}
