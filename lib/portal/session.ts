export const PORTAL_REMEMBER_COOKIE = "ecofocus_portal_remember";
export const PORTAL_REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;

export function getPortalCookieDomain(hostOrOrigin?: string | null) {
  if (!hostOrOrigin) return undefined;

  const normalized = hostOrOrigin
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0]
    .toLowerCase();

  if (normalized === "ecofocusresearch.com" || normalized.endsWith(".ecofocusresearch.com")) {
    return ".ecofocusresearch.com";
  }

  return undefined;
}
