import { requirePortalAccess } from "@/lib/portal/auth";

export async function ProtectedRoute({
  children,
  redirectTarget,
}: {
  children: (access: Awaited<ReturnType<typeof requirePortalAccess>>) => React.ReactNode;
  redirectTarget?: string;
}) {
  const access = await requirePortalAccess(redirectTarget);
  return <>{children(access)}</>;
}
