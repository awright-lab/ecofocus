import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalCompanies, getPortalSubscriptionByCompany } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type CapacityBody = {
  companyId?: string;
  seatsPurchased?: number;
  seatsUsed?: number;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to change seat capacity." }, 403);
  }

  let body: CapacityBody;
  try {
    body = (await req.json()) as CapacityBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const companyId = String(body.companyId || "").trim();
  const seatsPurchased = Number(body.seatsPurchased);
  const seatsUsed = Number(body.seatsUsed);

  if (!companyId || !Number.isFinite(seatsPurchased) || !Number.isFinite(seatsUsed)) {
    return asJson({ error: "companyId, seatsPurchased, and seatsUsed are required." }, 400);
  }

  if (seatsPurchased < 0 || seatsUsed < 0) {
    return asJson({ error: "Seat values cannot be negative." }, 400);
  }

  if (seatsUsed > seatsPurchased) {
    return asJson({ error: "Seats used cannot exceed seats purchased." }, 400);
  }

  const companies = await getPortalCompanies();
  if (!companies.find((company) => company.id === companyId)) {
    return asJson({ error: "Company not found." }, 404);
  }

  const subscription = await getPortalSubscriptionByCompany(companyId);
  if (!subscription) {
    return asJson({ error: "Subscription not found for this company." }, 404);
  }

  try {
    const admin = getServiceSupabase();
    const { error } = await admin
      .from("portal_subscriptions")
      .update({
        seats_purchased: seatsPurchased,
        seats_used: seatsUsed,
      })
      .eq("id", subscription.id);

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    await logPortalAdminAuditEvent({
      access,
      action: "subscription_capacity_updated",
      title: companies.find((company) => company.id === companyId)?.name || companyId,
      companyId,
      entityId: `subscription:${subscription.id}`,
      notes: `Seat capacity updated to ${seatsPurchased} purchased seats with ${seatsUsed} seats in use.`,
      metadata: {
        subscriptionId: subscription.id,
        seatsPurchased,
        seatsUsed,
      },
    });

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Subscription storage unavailable.",
      },
      503,
    );
  }
}
