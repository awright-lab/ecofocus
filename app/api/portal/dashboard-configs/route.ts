import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalCompanies, getPortalDashboardCatalog, getPortalDashboardConfigsByCompany } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type DashboardConfigBody = {
  companyId?: string;
  dashboardSlug?: string;
  displayrEmbedUrl?: string;
  isActive?: boolean;
  notes?: string;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

function normalizeUrl(rawUrl?: string | null) {
  const trimmed = String(rawUrl || "").trim();
  if (!trimmed) return "";

  try {
    return new URL(trimmed).toString();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }

  let body: DashboardConfigBody;
  try {
    body = (await req.json()) as DashboardConfigBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const companyId = String(body.companyId || "").trim();
  const dashboardSlug = String(body.dashboardSlug || "").trim();
  const isActive = Boolean(body.isActive);
  const normalizedUrl = normalizeUrl(body.displayrEmbedUrl);
  const notes = String(body.notes || "").trim() || null;

  if (!companyId || !dashboardSlug) {
    return asJson({ error: "companyId and dashboardSlug are required." }, 400);
  }

  if (normalizedUrl === null) {
    return asJson({ error: "Please enter a valid dashboard URL." }, 400);
  }

  const companies = await getPortalCompanies();
  if (!companies.find((company) => company.id === companyId)) {
    return asJson({ error: "Company not found." }, 404);
  }

  const dashboard = (await getPortalDashboardCatalog()).find((item) => item.slug === dashboardSlug);
  if (!dashboard) {
    return asJson({ error: "Dashboard not found." }, 404);
  }

  const existingConfig = (await getPortalDashboardConfigsByCompany(companyId)).find((config) => config.dashboardSlug === dashboardSlug) || null;
  const persistedUrl = normalizedUrl || existingConfig?.displayrEmbedUrl || "";

  if (isActive && !persistedUrl) {
    return asJson({ error: "An active dashboard needs a private dashboard URL." }, 400);
  }

  if (!isActive && !existingConfig && !persistedUrl) {
    return asJson({ ok: true, skipped: true });
  }

  try {
    const admin = getServiceSupabase();
    const { error } = await admin.from("portal_dashboard_configs").upsert(
      {
        company_id: companyId,
        dashboard_slug: dashboardSlug,
        displayr_embed_url: persistedUrl,
        is_active: isActive,
        notes,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "company_id,dashboard_slug",
      },
    );

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Dashboard config storage unavailable.",
      },
      503,
    );
  }
}
