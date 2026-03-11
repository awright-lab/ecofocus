const DEFAULT_PORTAL_HOSTNAME = "portal.ecofocusresearch.com";

function normalizeHost(host?: string | null) {
  return (host || "").toLowerCase().replace(/:\d+$/, "");
}

export function getPortalHostname() {
  return normalizeHost(process.env.PORTAL_HOSTNAME || DEFAULT_PORTAL_HOSTNAME);
}

export function isPortalHost(host?: string | null) {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  return normalized === getPortalHostname();
}
