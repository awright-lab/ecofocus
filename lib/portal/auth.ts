import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import {
  getPortalAccessibleCompaniesForUser,
  getPortalCompany,
  getPortalHomeCompany,
  getPortalSubscription,
  getPortalUserByEmail,
  hasRequiredRole,
} from "@/lib/portal/data";
import { getPortalDevUserFromCookies } from "@/lib/portal/dev-auth";
import type { PortalPreviewRole, PortalRole, PortalUser } from "@/lib/portal/types";

export const PORTAL_WORKSPACE_COOKIE = "ecofocus_portal_workspace";
export const PORTAL_PREVIEW_ROLE_COOKIE = "ecofocus_portal_preview_role";

function getAllowedPreviewRolesForWorkspace(
  actualRole: PortalRole,
  subscriberType?: string | null,
): PortalPreviewRole[] {
  if (actualRole !== "support_admin") {
    return [];
  }

  if (subscriberType === "agency") {
    return ["agency_user", "agency_admin"];
  }

  if (subscriberType === "brand") {
    return ["client_user", "client_admin"];
  }

  return [];
}

function getPreviewRoleFromCookie(
  requestedRole: string | undefined,
  actualRole: PortalRole,
  subscriberType?: string | null,
): PortalPreviewRole | null {
  const allowedRoles = getAllowedPreviewRolesForWorkspace(actualRole, subscriberType);
  if (!requestedRole) {
    return null;
  }

  return allowedRoles.find((role) => role === requestedRole) || null;
}

export type PortalAccessContext = {
  session: Awaited<ReturnType<typeof getAuthenticatedUser>> | null;
  user: PortalUser;
  effectiveUser: PortalUser;
  effectiveRole: PortalRole;
  company: NonNullable<Awaited<ReturnType<typeof getPortalCompany>>>;
  homeCompany: NonNullable<Awaited<ReturnType<typeof getPortalHomeCompany>>>;
  billingCompany: NonNullable<Awaited<ReturnType<typeof getPortalHomeCompany>>>;
  subscription: NonNullable<Awaited<ReturnType<typeof getPortalSubscription>>>;
  accessibleCompanies: Awaited<ReturnType<typeof getPortalAccessibleCompaniesForUser>>;
  isPreviewMode: boolean;
  previewRole: PortalPreviewRole | null;
  previewableRoles: PortalPreviewRole[];
};

export async function getPortalAccessContext(): Promise<PortalAccessContext | null> {
  const devUser = await getPortalDevUserFromCookies();
  if (devUser) {
    const homeCompany = await getPortalHomeCompany(devUser);
    const accessibleCompanies = await getPortalAccessibleCompaniesForUser(devUser);
    const cookieStore = await cookies();
    const requestedWorkspaceId = cookieStore.get(PORTAL_WORKSPACE_COOKIE)?.value || "";
    const company = accessibleCompanies.find((item) => item.id === requestedWorkspaceId) || homeCompany;
    const previewableRoles = getAllowedPreviewRolesForWorkspace(devUser.role, company?.subscriberType);
    const previewRole = getPreviewRoleFromCookie(
      cookieStore.get(PORTAL_PREVIEW_ROLE_COOKIE)?.value,
      devUser.role,
      company?.subscriberType,
    );
    const effectiveUser = previewRole
      ? {
          ...devUser,
          companyId: company?.id || devUser.companyId,
          homeCompanyId: company?.id || devUser.companyId,
          role: previewRole,
        }
      : { ...devUser, companyId: company?.id || devUser.companyId };
    const subscription = await getPortalSubscription(effectiveUser);
    if (!company || !homeCompany || !subscription) return null;

    return {
      session: null,
      user: devUser,
      effectiveUser,
      effectiveRole: effectiveUser.role,
      company,
      homeCompany,
      billingCompany: homeCompany,
      subscription,
      accessibleCompanies,
      isPreviewMode: Boolean(previewRole),
      previewRole,
      previewableRoles,
    };
  }

  const authUser = await getAuthenticatedUser().catch(() => null);
  if (!authUser?.email) return null;

  const matchedUser = await getPortalUserByEmail(authUser.email);
  if (!matchedUser || matchedUser.status === "invited" || matchedUser.status === "inactive") {
    return null;
  }

  const user = matchedUser;
  const homeCompany = await getPortalHomeCompany(user);
  const accessibleCompanies = await getPortalAccessibleCompaniesForUser(user);
  const cookieStore = await cookies();
  const requestedWorkspaceId = cookieStore.get(PORTAL_WORKSPACE_COOKIE)?.value || "";
  const company = accessibleCompanies.find((item) => item.id === requestedWorkspaceId) || homeCompany;
  const previewableRoles = getAllowedPreviewRolesForWorkspace(user.role, company?.subscriberType);
  const previewRole = getPreviewRoleFromCookie(
    cookieStore.get(PORTAL_PREVIEW_ROLE_COOKIE)?.value,
    user.role,
    company?.subscriberType,
  );
  const effectiveUser = previewRole
    ? {
        ...user,
        companyId: company?.id || user.companyId,
        homeCompanyId: company?.id || user.companyId,
        role: previewRole,
      }
    : { ...user, companyId: company?.id || user.companyId };
  const subscription = await getPortalSubscription(effectiveUser);

  if (!company || !homeCompany || !subscription) return null;

  return {
    session: authUser,
    user,
    effectiveUser,
    effectiveRole: effectiveUser.role,
    company,
    homeCompany,
    billingCompany: homeCompany,
    subscription,
    accessibleCompanies,
    isPreviewMode: Boolean(previewRole),
    previewRole,
    previewableRoles,
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
  if (!hasRequiredRole(access.effectiveRole, requiredRole)) {
    redirect("/portal/home");
  }
  return access;
}
