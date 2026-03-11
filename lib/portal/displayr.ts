import type { PortalDashboard } from "@/lib/portal/types";
import { getServiceSupabase } from "@/lib/supabase/server";

type DisplayrEmbedState = {
  iframeUrl: string | null;
  isConfigured: boolean;
  accessMode: PortalDashboard["embedAccess"];
  requiresDisplayrLogin: boolean;
  configSource: "database" | "environment" | "inline" | "missing";
};

function slugToEnvKey(slug: string) {
  return slug.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
}

function normalizeDisplayrUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
}

async function getCompanyDashboardConfigUrl(companyId: string, dashboardSlug: string) {
  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_dashboard_configs")
      .select("displayr_embed_url")
      .eq("company_id", companyId)
      .eq("dashboard_slug", dashboardSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.warn("[portal/displayr] Dashboard config lookup failed.", {
        companyId,
        dashboardSlug,
        error: error.message,
      });
      return null;
    }

    return normalizeDisplayrUrl(data?.displayr_embed_url);
  } catch (error) {
    console.warn("[portal/displayr] Dashboard config storage unavailable.", {
      companyId,
      dashboardSlug,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export async function getDisplayrEmbedState(
  dashboard: PortalDashboard,
  companyId: string,
): Promise<DisplayrEmbedState> {
  const databaseUrl = await getCompanyDashboardConfigUrl(companyId, dashboard.slug);
  const envKey = `DISPLAYR_EMBED_URL_${slugToEnvKey(dashboard.slug)}`;
  const envUrl = normalizeDisplayrUrl(process.env[envKey]);
  const inlineUrl = normalizeDisplayrUrl(dashboard.embedUrl);
  const iframeUrl = databaseUrl || envUrl || inlineUrl;
  const configSource = databaseUrl ? "database" : envUrl ? "environment" : inlineUrl ? "inline" : "missing";

  return {
    iframeUrl,
    isConfigured: Boolean(iframeUrl),
    accessMode: dashboard.embedAccess,
    requiresDisplayrLogin: dashboard.embedAccess === "displayr_login_required",
    configSource,
  };
}

export function getDisplayrEmbedEnvKey(slug: string) {
  return `DISPLAYR_EMBED_URL_${slugToEnvKey(slug)}`;
}
