import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/supabase/server";
import {
  getPortalAccessibleCompaniesForUser,
  getPortalCompany,
  getPortalHomeCompany,
  getPortalSubscription,
  getPortalUserByEmail,
  hasRequiredRole,
} from "@/lib/portal/data";
import { getPortalDevUserFromCookies } from "@/lib/portal/dev-auth";
import type { PortalRole, PortalUser } from "@/lib/portal/types";

export const PORTAL_WORKSPACE_COOKIE = "ecofocus_portal_workspace";

export type PortalAccessContext = {
  session: Awaited<ReturnType<typeof getSession>>;
  user: PortalUser;
  company: NonNullable<Awaited<ReturnType<typeof getPortalCompany>>>;
  homeCompany: NonNullable<Awaited<ReturnType<typeof getPortalHomeCompany>>>;
  billingCompany: NonNullable<Awaited<ReturnType<typeof getPortalHomeCompany>>>;
  subscription: NonNullable<Awaited<ReturnType<typeof getPortalSubscription>>>;
  accessibleCompanies: Awaited<ReturnType<typeof getPortalAccessibleCompaniesForUser>>;
};

export async function getPortalAccessContext(): Promise<PortalAccessContext | null> {
  const devUser = await getPortalDevUserFromCookies();
  if (devUser) {
    const homeCompany = await getPortalHomeCompany(devUser);
    const accessibleCompanies = await getPortalAccessibleCompaniesForUser(devUser);
    const cookieStore = await cookies();
    const requestedWorkspaceId = cookieStore.get(PORTAL_WORKSPACE_COOKIE)?.value || "";
    const company = accessibleCompanies.find((item) => item.id === requestedWorkspaceId) || homeCompany;
    const subscription = await getPortalSubscription({ ...devUser, companyId: company?.id || devUser.companyId });
    if (!company || !homeCompany || !subscription) return null;

    return {
      session: null,
      user: devUser,
      company,
      homeCompany,
      billingCompany: homeCompany,
      subscription,
      accessibleCompanies,
    };
  }

  const session = await getSession().catch(() => null);
  if (!session?.user) return null;

  const matchedUser = await getPortalUserByEmail(session.user.email);
  if (!matchedUser || matchedUser.status === "invited" || matchedUser.status === "inactive") {
    return null;
  }

  const user = matchedUser;
  const homeCompany = await getPortalHomeCompany(user);
  const accessibleCompanies = await getPortalAccessibleCompaniesForUser(user);
  const cookieStore = await cookies();
  const requestedWorkspaceId = cookieStore.get(PORTAL_WORKSPACE_COOKIE)?.value || "";
  const company = accessibleCompanies.find((item) => item.id === requestedWorkspaceId) || homeCompany;
  const subscription = await getPortalSubscription({ ...user, companyId: company?.id || user.companyId });

  if (!company || !homeCompany || !subscription) return null;

  return {
    session,
    user,
    company,
    homeCompany,
    billingCompany: homeCompany,
    subscription,
    accessibleCompanies,
  };
}

export async function requirePortalAccess(redirectTarget = "/portal/home") {
  const access = await getPortalAccessContext();
  if (!access) {
    redirect(`/portal/login?redirect=${encodeURIComponent(redirectTarget)}`);
  }
  return access;
}

export async function requirePortalRole(requiredRole: PortalRole, redirectTarget = "/portal/home") {
  const access = await requirePortalAccess(redirectTarget);
  if (!hasRequiredRole(access.user.role, requiredRole)) {
    redirect("/portal/home");
  }
  return access;
}
