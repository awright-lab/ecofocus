import { cookies } from "next/headers";
import { portalUsers } from "@/lib/portal/mock-data";
import type { PortalRole, PortalUser } from "@/lib/portal/types";

export const PORTAL_DEV_COOKIE = "ecofocus_portal_dev_user";
export const PORTAL_DEV_USAGE_COOKIE = "ecofocus_portal_dev_usage";

export function isPortalDevBypassEnabled() {
  return process.env.PORTAL_DEV_BYPASS === "true";
}

export function getDevPortalUserByRole(role: PortalRole): PortalUser | null {
  return (
    portalUsers.find((user) => user.role === role) ??
    null
  );
}

export async function getPortalDevUserFromCookies(): Promise<PortalUser | null> {
  if (!isPortalDevBypassEnabled()) return null;
  const cookieStore = await cookies();
  const role = cookieStore.get(PORTAL_DEV_COOKIE)?.value as PortalRole | undefined;
  if (!role) return null;
  if (role !== "client_user" && role !== "client_admin" && role !== "support_admin") {
    return null;
  }
  return getDevPortalUserByRole(role);
}

export async function getPortalDevUsageOverrideFromCookies(): Promise<"available" | "exhausted" | null> {
  if (!isPortalDevBypassEnabled()) return null;
  const cookieStore = await cookies();
  const value = cookieStore.get(PORTAL_DEV_USAGE_COOKIE)?.value;
  if (value === "available" || value === "exhausted") return value;
  return null;
}
