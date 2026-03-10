import { cookies } from "next/headers";
import { portalUsers } from "@/lib/portal/mock-data";
import type { PortalRole, PortalUser } from "@/lib/portal/types";

export const PORTAL_DEV_COOKIE = "ecofocus_portal_dev_user";

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
