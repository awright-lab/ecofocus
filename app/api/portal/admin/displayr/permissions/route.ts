import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { getPortalOrigin } from "@/lib/portal/host";
import {
  validateDisplayrBinding,
  permissionStatus,
} from "@/lib/portal/displayr-permissions";
import {
  getDisplayrPermissionPlan,
  getDisplayrPermissionState,
} from "@/lib/portal/displayr-permission-store";
import { isDisplayrManagedUser } from "@/lib/portal/displayr-gateway-config";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
const headers = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers });
async function administrator() {
  const access = await getPortalAccessContext();
  return access?.session &&
    access.user.role === "support_admin" &&
    !access.isPreviewMode
    ? access
    : null;
}
export async function GET(req: NextRequest) {
  if (!(await administrator()))
    return json({ error: "Administrator session required." }, 403);
  const companyId = req.nextUrl.searchParams.get("companyId");
  const dashboardSlug = req.nextUrl.searchParams.get("dashboardSlug");
  if (!companyId || !dashboardSlug)
    return json({ error: "Workspace and dashboard are required." }, 400);
  try {
    const db = getServiceSupabase();
    const [binding, users, memberships, config] = await Promise.all([
      db
        .from("portal_displayr_bindings")
        .select("source_url,project_id,group_ids")
        .eq("company_id", companyId)
        .eq("dashboard_slug", dashboardSlug)
        .maybeSingle(),
      db
        .from("portal_users")
        .select("id,name")
        .eq("company_id", companyId)
        .eq("status", "active"),
      db
        .from("portal_workspace_memberships")
        .select("user_id")
        .eq("workspace_company_id", companyId)
        .eq("visibility_scope", "full"),
      db
        .from("portal_dashboard_configs")
        .select("displayr_embed_url")
        .eq("company_id", companyId)
        .eq("dashboard_slug", dashboardSlug)
        .maybeSingle(),
    ]);
    if (binding.error || users.error || memberships.error || config.error)
      throw new Error();
    const ids = [
      ...new Set([
        ...users.data.map((u) => u.id),
        ...memberships.data.map((m) => m.user_id),
      ]),
    ] as string[];
    const results = [];
    for (let offset = 0; offset < ids.length; offset += 10) {
      results.push(
        ...(await Promise.all(
          ids.slice(offset, offset + 10).map(async (userId) => {
            const [plan, state] = await Promise.all([
              getDisplayrPermissionPlan(userId),
              getDisplayrPermissionState(userId),
            ]);
            return {
              userId,
              name: users.data.find((u) => u.id === userId)?.name || userId,
              ...(isDisplayrManagedUser(userId)
                ? permissionStatus(plan, state)
                : { status: "needs_attention", reason: "viewer_not_enrolled" }),
              checkedAt: state?.checked_at || null,
            };
          }),
        )),
      );
    }
    return json({
      binding: binding.data,
      sourceUrl: config.data?.displayr_embed_url || "",
      viewers: results,
    });
  } catch {
    return json({ error: "Displayr permission storage is not ready." }, 503);
  }
}
export async function POST(req: NextRequest) {
  if (
    req.headers.get("origin") !== getPortalOrigin() ||
    !/^application\/json(?:;|$)/i.test(req.headers.get("content-type") || "")
  )
    return json({ error: "Request denied." }, 403);
  const access = await administrator();
  if (!access) return json({ error: "Administrator session required." }, 403);
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const { companyId, dashboardSlug } = body;
  if (
    typeof companyId !== "string" ||
    typeof dashboardSlug !== "string" ||
    body.viewOnlyConfirmed !== true
  )
    return json(
      { error: "Confirm the group grants view-only access to this report." },
      400,
    );
  const db = getServiceSupabase();
  const config = await db
    .from("portal_dashboard_configs")
    .select("displayr_embed_url")
    .eq("company_id", companyId)
    .eq("dashboard_slug", dashboardSlug)
    .maybeSingle();
  if (config.error)
    return json({ error: "Workspace assignment is unavailable." }, 503);
  if (!config.data)
    return json(
      {
        error:
          "Save the workspace assignment before configuring Displayr permissions.",
      },
      409,
    );
  let binding;
  try {
    binding = validateDisplayrBinding({
      sourceUrl: config.data.displayr_embed_url,
      projectId: body.projectId,
      groupIds: body.groupIds,
    });
  } catch {
    return json(
      {
        error:
          "Enter a valid project ID and restricted viewing group IDs matching the assigned report.",
      },
      400,
    );
  }
  const result = await db
    .from("portal_displayr_bindings")
    .upsert(
      {
        company_id: companyId,
        dashboard_slug: dashboardSlug,
        source_url: binding.sourceUrl,
        project_id: binding.projectId,
        group_ids: binding.groupIds,
        verified_by: access.user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "company_id,dashboard_slug" },
    );
  if (result.error)
    return json(
      { error: "Displayr permission mapping could not be saved." },
      503,
    );
  await logPortalAdminAuditEvent({
    access,
    action: "displayr_mapping_updated",
    title: dashboardSlug,
    companyId,
    entityId: `${companyId}:${dashboardSlug}`,
    notes:
      "View-only report/group mapping confirmed. Viewer synchronization is pending.",
    metadata: { projectId: binding.projectId, groupIds: binding.groupIds },
  });
  return json({ ok: true });
}
