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

export function toInternalPortalPath(pathname: string) {
  if (pathname === "/") return "/portal";
  if (pathname === "/portal" || pathname.startsWith("/portal/")) return pathname;
  return `/portal${pathname}`;
}

export function toExternalPortalPath(pathname: string) {
  if (pathname === "/portal") return "/";
  if (pathname.startsWith("/portal/")) {
    const trimmed = pathname.slice("/portal".length);
    return trimmed || "/";
  }
  return pathname;
}
