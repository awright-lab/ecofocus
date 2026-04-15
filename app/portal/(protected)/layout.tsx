import { PortalShell } from "@/components/portal/PortalShell";
import { ProtectedRoute } from "@/components/portal/ProtectedRoute";

export const dynamic = "force-dynamic";

export default function ProtectedPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute redirectTarget="/portal/home">
      {(access) => <PortalShell access={access}>{children}</PortalShell>}
    </ProtectedRoute>
  );
}
