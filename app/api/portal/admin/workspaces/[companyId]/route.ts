import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

const LOGO_BUCKET = process.env.PORTAL_COMPANY_LOGO_BUCKET || "portal-company-logos";

type DeleteBody = {
  confirmation?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

async function deleteFromTable(
  table: string,
  column: string,
  values: string[],
): Promise<void> {
  if (!values.length) return;

  const admin = getServiceSupabase();
  const { error } = await admin.from(table).delete().in(column, values);
  if (error) throw new Error(error.message);
}

async function deleteByCompanyColumn(table: string, column: string, companyId: string): Promise<void> {
  const admin = getServiceSupabase();
  const { error } = await admin.from(table).delete().eq(column, companyId);
  if (error) throw new Error(error.message);
}

function getPortalLogoStoragePath(logoUrl?: string | null) {
  if (!logoUrl) return null;

  try {
    const parsedUrl = new URL(logoUrl);
    const bucketMarker = `/storage/v1/object/public/${LOGO_BUCKET}/`;
    const markerIndex = parsedUrl.pathname.indexOf(bucketMarker);
    if (markerIndex === -1) return null;

    return decodeURIComponent(parsedUrl.pathname.slice(markerIndex + bucketMarker.length));
  } catch {
    return null;
  }
}

async function removeCompanyLogo(logoUrl?: string | null) {
  const logoPath = getPortalLogoStoragePath(logoUrl);
  if (!logoPath) {
    return { removed: false, path: null };
  }

  const admin = getServiceSupabase();
  const { error } = await admin.storage.from(LOGO_BUCKET).remove([logoPath]);
  if (error) throw new Error(error.message);

  return { removed: true, path: logoPath };
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to delete workspaces." }, 403);
  }

  let body: DeleteBody;
  try {
    body = (await req.json()) as DeleteBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  if (body.confirmation !== "DELETE") {
    return asJson({ error: "Type DELETE to confirm workspace deletion." }, 400);
  }

  const { companyId } = await params;
  const targetCompanyId = String(companyId || "").trim();
  if (!targetCompanyId) {
    return asJson({ error: "Company id is required." }, 400);
  }

  try {
    const admin = getServiceSupabase();
    const { data: company, error: companyError } = await admin
      .from("portal_companies")
      .select("id, name, subscription_id, subscriber_type, logo_url")
      .eq("id", targetCompanyId)
      .maybeSingle();

    if (companyError) return asJson({ error: companyError.message }, 500);
    if (!company) return asJson({ error: "Workspace not found." }, 404);

    if (company.subscriber_type === "internal" || company.id === access.homeCompany.id) {
      return asJson({ error: "Internal EcoFocus workspaces cannot be deleted from this tool." }, 400);
    }

    const { data: users, error: usersError } = await admin
      .from("portal_users")
      .select("id")
      .eq("company_id", targetCompanyId);
    if (usersError) return asJson({ error: usersError.message }, 500);
    const userIds = (users || []).map((user) => String(user.id)).filter(Boolean);

    const { data: tickets, error: ticketsError } = await admin
      .from("portal_tickets")
      .select("id")
      .eq("company_id", targetCompanyId);
    if (ticketsError) return asJson({ error: ticketsError.message }, 500);
    const ticketIds = (tickets || []).map((ticket) => String(ticket.id)).filter(Boolean);
    const logoRemoval = await removeCompanyLogo(company.logo_url);

    await deleteFromTable("portal_ticket_messages", "ticket_id", ticketIds);
    await deleteFromTable("portal_ticket_messages", "author_id", userIds);
    await deleteByCompanyColumn("portal_tickets", "company_id", targetCompanyId);

    await deleteByCompanyColumn("portal_team_invites", "company_id", targetCompanyId);
    await deleteFromTable("portal_team_invites", "invited_user_id", userIds);

    await deleteByCompanyColumn("portal_dashboard_entitlements", "company_id", targetCompanyId);
    await deleteByCompanyColumn("portal_dashboard_configs", "company_id", targetCompanyId);
    await deleteByCompanyColumn("portal_usage_allowances", "company_id", targetCompanyId);

    await deleteByCompanyColumn("portal_usage_logs", "company_id", targetCompanyId);
    await deleteByCompanyColumn("portal_usage_logs", "workspace_company_id", targetCompanyId);
    await deleteByCompanyColumn("portal_usage_logs", "billing_company_id", targetCompanyId);
    await deleteByCompanyColumn("portal_usage_logs", "user_home_company_id", targetCompanyId);
    await deleteFromTable("portal_usage_logs", "user_id", userIds);

    await deleteByCompanyColumn("portal_workspace_memberships", "workspace_company_id", targetCompanyId);
    await deleteFromTable("portal_workspace_memberships", "user_id", userIds);

    await deleteFromTable("portal_users", "id", userIds);

    const { error: companyDeleteError } = await admin
      .from("portal_companies")
      .delete()
      .eq("id", targetCompanyId);
    if (companyDeleteError) return asJson({ error: companyDeleteError.message }, 500);

    const { error: subscriptionDeleteError } = await admin
      .from("portal_subscriptions")
      .delete()
      .eq("id", String(company.subscription_id));
    if (subscriptionDeleteError) return asJson({ error: subscriptionDeleteError.message }, 500);

    return asJson({
      ok: true,
      deletedCompanyId: targetCompanyId,
      deletedCompanyName: company.name,
      deletedUserCount: userIds.length,
      deletedTicketCount: ticketIds.length,
      deletedLogoPath: logoRemoval.path,
      deletedLogoFromStorage: logoRemoval.removed,
    });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to delete workspace.",
      },
      500,
    );
  }
}
