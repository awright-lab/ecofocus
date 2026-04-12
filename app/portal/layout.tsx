import type { Metadata } from "next";
import { portalRobots } from "@/lib/portal/metadata";

export const metadata: Metadata = {
  title: {
    default: "EcoFocus Portal",
    template: "%s | EcoFocus Portal",
  },
  robots: portalRobots,
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div data-portal-root="true">{children}</div>;
}
