import { createHmac, timingSafeEqual } from "node:crypto";
import type { PortalDashboard } from "@/lib/portal/types";
import { getServiceSupabase } from "@/lib/supabase/server";

type DisplayrEmbedState = {
  iframeSrc: string | null;
  isConfigured: boolean;
  accessMode: PortalDashboard["embedAccess"];
  requiresDisplayrLogin: boolean;
  configSource: "database" | "development_fallback" | "missing";
};

type DisplayrEmbedTokenPayload = {
  viewerCompanyId: string;
  targetCompanyId: string;
  dashboardSlug: string;
  userId: string;
  exp: number;
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

function getDisplayrEmbedTokenSecret() {
  return (
    process.env.DISPLAYR_EMBED_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "local-displayr-embed-secret"
  );
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signDisplayrPayload(payload: string) {
  return createHmac("sha256", getDisplayrEmbedTokenSecret()).update(payload).digest("base64url");
}

function buildDisplayrEmbedToken(payload: DisplayrEmbedTokenPayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signDisplayrPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySignature(encodedPayload: string, signature: string) {
  const expectedSignature = signDisplayrPayload(encodedPayload);

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

function getDevFallbackUrl(dashboard: PortalDashboard) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const envKey = `DISPLAYR_EMBED_URL_${slugToEnvKey(dashboard.slug)}`;
  return normalizeDisplayrUrl(process.env[envKey]) || normalizeDisplayrUrl(dashboard.embedUrl);
}

async function logDisplayrEmbedAuditEvent({
  userId,
  companyId,
  dashboardId,
  dashboardName,
  note,
  metadata,
}: {
  userId: string;
  companyId: string;
  dashboardId: string;
  dashboardName: string;
  note: string;
  metadata: Record<string, unknown>;
}) {
  try {
    const admin = getServiceSupabase();
    await admin.from("portal_usage_logs").insert({
      user_id: userId,
      company_id: companyId,
      dashboard_id: dashboardId,
      dashboard_name: dashboardName,
      event_type: "viewer_opened",
      event_at: new Date().toISOString(),
      minutes_tracked: 0,
      source: "portal_runtime",
      notes: note,
      metadata,
    });
  } catch (error) {
    console.warn("[portal/displayr] Unable to write embed audit event.", {
      companyId,
      dashboardId,
      note,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getDisplayrEmbedState(
  dashboard: PortalDashboard,
  targetCompanyId: string,
  userId: string,
  viewerCompanyId = targetCompanyId,
): Promise<DisplayrEmbedState> {
  const databaseUrl = await getCompanyDashboardConfigUrl(targetCompanyId, dashboard.slug);
  const devFallbackUrl = getDevFallbackUrl(dashboard);
  const resolvedUrl = databaseUrl || devFallbackUrl;
  const configSource = databaseUrl ? "database" : devFallbackUrl ? "development_fallback" : "missing";
  const iframeSrc = resolvedUrl
    ? `/api/portal/displayr/embed?token=${encodeURIComponent(
        buildDisplayrEmbedToken({
          viewerCompanyId,
          targetCompanyId,
          dashboardSlug: dashboard.slug,
          userId,
          exp: Date.now() + 1000 * 60 * 10,
        }),
      )}`
    : null;

  if (iframeSrc) {
    await logDisplayrEmbedAuditEvent({
      userId,
      companyId: viewerCompanyId,
      dashboardId: dashboard.id,
      dashboardName: dashboard.name,
      note: "Displayr embed token issued.",
      metadata: {
        phase: "token_issued",
        dashboardSlug: dashboard.slug,
        configSource,
        targetCompanyId,
        viewerCompanyId,
        internalSupportView: viewerCompanyId !== targetCompanyId,
      },
    });
  }

  return {
    iframeSrc,
    isConfigured: Boolean(resolvedUrl),
    accessMode: dashboard.embedAccess,
    requiresDisplayrLogin: dashboard.embedAccess === "displayr_login_required",
    configSource,
  };
}

export function getDisplayrEmbedEnvKey(slug: string) {
  return `DISPLAYR_EMBED_URL_${slugToEnvKey(slug)}`;
}

export async function resolveDisplayrEmbedUrl(companyId: string, dashboardSlug: string) {
  const databaseUrl = await getCompanyDashboardConfigUrl(companyId, dashboardSlug);
  if (databaseUrl) return databaseUrl;
  return null;
}

export async function logDisplayrEmbedRedirectEvent({
  userId,
  companyId,
  targetCompanyId,
  dashboardId,
  dashboardName,
  dashboardSlug,
  userAgent,
}: {
  userId: string;
  companyId: string;
  targetCompanyId: string;
  dashboardId: string;
  dashboardName: string;
  dashboardSlug: string;
  userAgent?: string | null;
}) {
  await logDisplayrEmbedAuditEvent({
    userId,
    companyId,
    dashboardId,
    dashboardName,
    note: "Displayr embed redirect served.",
    metadata: {
      phase: "redirect_served",
      dashboardSlug,
      userAgent: userAgent || null,
      targetCompanyId,
      viewerCompanyId: companyId,
      internalSupportView: companyId !== targetCompanyId,
    },
  });
}

export function verifyDisplayrEmbedToken(token: string): DisplayrEmbedTokenPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  if (!verifySignature(encodedPayload, signature)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as DisplayrEmbedTokenPayload;
    if (!payload.viewerCompanyId || !payload.targetCompanyId || !payload.dashboardSlug || !payload.userId || !payload.exp) {
      return null;
    }
    if (payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
