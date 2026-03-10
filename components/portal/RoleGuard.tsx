import { requirePortalRole } from "@/lib/portal/auth";
import type { PortalRole } from "@/lib/portal/types";

export async function RoleGuard({
  children,
  role,
  redirectTarget,
}: {
  children: (access: Awaited<ReturnType<typeof requirePortalRole>>) => React.ReactNode;
  role: PortalRole;
  redirectTarget?: string;
}) {
  const access = await requirePortalRole(role, redirectTarget);
  return <>{children(access)}</>;
}
