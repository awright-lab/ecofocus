import type { PortalDashboard } from "@/lib/portal/types";

type DisplayrEmbedState = {
  iframeUrl: string | null;
  isConfigured: boolean;
  accessMode: PortalDashboard["embedAccess"];
  requiresDisplayrLogin: boolean;
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

export function getDisplayrEmbedState(dashboard: PortalDashboard): DisplayrEmbedState {
  const envKey = `DISPLAYR_EMBED_URL_${slugToEnvKey(dashboard.slug)}`;
  const envUrl = process.env[envKey];
  const iframeUrl = normalizeDisplayrUrl(envUrl || dashboard.embedUrl);

  return {
    iframeUrl,
    isConfigured: Boolean(iframeUrl),
    accessMode: dashboard.embedAccess,
    requiresDisplayrLogin: dashboard.embedAccess === "displayr_login_required",
  };
}

export function getDisplayrEmbedEnvKey(slug: string) {
  return `DISPLAYR_EMBED_URL_${slugToEnvKey(slug)}`;
}
