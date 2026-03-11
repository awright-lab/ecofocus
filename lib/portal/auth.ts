import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import { getPortalCompany, getPortalSubscription, getPortalUserByEmail, normalizePortalRole, hasRequiredRole } from "@/lib/portal/data";
import { getPortalDevUserFromCookies } from "@/lib/portal/dev-auth";
import type { PortalRole, PortalUser } from "@/lib/portal/types";

export type PortalAccessContext = {
  session: Awaited<ReturnType<typeof getSession>>;
  user: PortalUser;
  company: NonNullable<Awaited<ReturnType<typeof getPortalCompany>>>;
  subscription: NonNullable<Awaited<ReturnType<typeof getPortalSubscription>>>;
};

function fallbackPortalUser(session: NonNullable<Awaited<ReturnType<typeof getSession>>>): PortalUser {
  const email = session.user.email || "unknown@ecofocusresearch.com";
  const metadataRole =
    session.user.app_metadata?.portal_role ||
    session.user.user_metadata?.portal_role ||
    session.user.user_metadata?.role;

  return {
    id: session.user.id,
    name: session.user.user_metadata?.full_name || email.split("@")[0] || "Portal User",
    email,
    companyId: "company-greenloop",
    role: normalizePortalRole(typeof metadataRole === "string" ? metadataRole : null),
  };
}

export async function getPortalAccessContext(): Promise<PortalAccessContext | null> {
  const devUser = await getPortalDevUserFromCookies();
  if (devUser) {
    const company = await getPortalCompany(devUser);
    const subscription = await getPortalSubscription(devUser);
    if (!company || !subscription) return null;

    return {
      session: null,
      user: devUser,
      company,
      subscription,
    };
  }

  const session = await getSession().catch(() => null);
  if (!session?.user) return null;

  const matchedUser = await getPortalUserByEmail(session.user.email);
  const user = matchedUser ?? fallbackPortalUser(session);
  const company = await getPortalCompany(user);
  const subscription = await getPortalSubscription(user);

  if (!company || !subscription) return null;

  return {
    session,
    user,
    company,
    subscription,
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
