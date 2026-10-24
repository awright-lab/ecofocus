import { NextResponse } from "next/server";
import { sendReportOrderEmail } from "@/lib/report-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let sessionId: unknown;
  try { sessionId = (await req.json())?.sessionId; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof sessionId !== "string" || !/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId)) return NextResponse.json({ error: "Invalid order link." }, { status: 400 });
  try {
    // Recipient always comes from the verified Stripe order, never the request.
    return NextResponse.json(await sendReportOrderEmail(sessionId), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Report email failed", error instanceof Error ? error.message : "Unknown error");
    const code = error && typeof error === "object" && "code" in error && (error.code === "email_not_configured" || error.code === "email_provider_rejected") ? error.code : "email_delivery_failed";
    return NextResponse.json({ code, error: "We couldn’t email your link yet. Your downloads are still available here. Save this page and try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
