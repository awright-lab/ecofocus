import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalDashboardsForUser } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type TicketBody = {
  dashboardName?: string;
  issueType?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  description?: string;
  notes?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: TicketBody;
  try {
    body = (await req.json()) as TicketBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const dashboardName = String(body.dashboardName || "").trim();
  const issueType = String(body.issueType || "").trim();
  const priority = body.priority || "medium";
  const description = String(body.description || "").trim();
  const notes = String(body.notes || "").trim();

  if (!dashboardName || !issueType || !description) {
    return asJson({ error: "dashboardName, issueType, and description are required." }, 400);
  }

  const allowedDashboard = (await getPortalDashboardsForUser(access.user)).find((dashboard) => dashboard.name === dashboardName);
  if (!allowedDashboard) {
    return asJson({ error: "Dashboard not available for this user." }, 403);
  }

  const ticketId = `TCK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const subject = `${issueType}: ${dashboardName}`;
  const messageBody = notes
    ? `${description}\n\nEnvironment notes:\n${notes}`
    : description;

  try {
    const admin = getServiceSupabase();
    const now = new Date().toISOString();
    const { error: ticketError } = await admin.from("portal_tickets").insert({
      id: ticketId,
      company_id: access.company.id,
      subject,
      dashboard_name: dashboardName,
      issue_type: issueType,
      priority,
      status: "open",
      requester_id: access.user.id,
      owner_id: null,
      created_at: now,
      updated_at: now,
    });

    if (ticketError) {
      return asJson({ error: ticketError.message }, 500);
    }

    const { error: messageError } = await admin.from("portal_ticket_messages").insert({
      ticket_id: ticketId,
      author_id: access.user.id,
      body: messageBody,
      is_internal: false,
      created_at: now,
    });

    if (messageError) {
      await admin.from("portal_tickets").delete().eq("id", ticketId);
      return asJson({ error: messageError.message }, 500);
    }

    return asJson({ ok: true, ticketId }, 201);
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Ticket storage unavailable.",
      },
      503,
    );
  }
}
