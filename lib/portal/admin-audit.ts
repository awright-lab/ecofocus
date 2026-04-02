import type { PortalAccessContext } from "@/lib/portal/auth";
import { getServiceSupabase } from "@/lib/supabase/server";

type AdminAuditInput = {
  access: PortalAccessContext;
  action: string;
  title: string;
  companyId?: string | null;
  entityId?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
};

function sanitizeEntityId(value: string) {
  return value.replace(/[^a-zA-Z0-9:_-]+/g, "-").slice(0, 120);
}

export async function logPortalAdminAuditEvent({
  access,
  action,
  title,
  companyId,
  entityId,
  notes,
  metadata,
}: AdminAuditInput) {
  const targetCompanyId = companyId || access.company.id;
  const admin = getServiceSupabase();

  try {
    await admin.from("portal_usage_logs").insert({
      user_id: access.user.id,
      company_id: targetCompanyId,
      workspace_company_id: targetCompanyId,
      billing_company_id: targetCompanyId,
      user_home_company_id: access.homeCompany.id,
      dashboard_id: sanitizeEntityId(entityId || `admin:${action}`),
      dashboard_name: title,
      event_type: "admin_action",
      event_at: new Date().toISOString(),
      minutes_tracked: 0,
      source: "portal_runtime",
      notes: notes || null,
      metadata: {
        action,
        actorRole: access.user.role,
        actorName: access.user.name,
        companyId: targetCompanyId,
        ...metadata,
      },
    });
  } catch (error) {
    console.warn("[portal/admin-audit] Unable to persist admin audit event.", {
      action,
      title,
      targetCompanyId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
