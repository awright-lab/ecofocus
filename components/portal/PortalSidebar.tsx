"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircleHelp,
  FolderKanban,
  Home,
  LifeBuoy,
  PanelsTopLeft,
  ShieldCheck,
  Users,
} from "lucide-react";
import { WorkspaceSwitcher } from "@/components/portal/WorkspaceSwitcher";
import { cx } from "@/lib/utils";
import type { PortalCompany, PortalRole } from "@/lib/portal/types";

const clientNavItems = [
  { href: "/portal/home", label: "Home", icon: Home },
  { href: "/portal/dashboards", label: "My Dashboards", icon: BarChart3 },
  { href: "/portal/support", label: "Support Center", icon: LifeBuoy },
  { href: "/portal/help", label: "Knowledge Base", icon: CircleHelp },
  { href: "/portal/team", label: "Team", icon: Users },
];

const supportAdminNavItems = [
  { href: "/portal/home", label: "Overview", icon: Home },
  { href: "/portal/admin/library", label: "All Dashboards", icon: BarChart3 },
  { href: "/portal/admin/support", label: "Support Queue", icon: LifeBuoy },
  { href: "/portal/admin/dashboards", label: "Dashboard Access", icon: ShieldCheck },
  { href: "/portal/support/tickets", label: "Ticket Inbox", icon: FolderKanban },
  { href: "/portal/help", label: "Knowledge Base", icon: CircleHelp },
];

export function PortalSidebar({
  role,
  accessibleCompanies,
  currentCompanyId,
}: {
  role: PortalRole;
  accessibleCompanies: PortalCompany[];
  currentCompanyId: string;
}) {
  const pathname = usePathname();
  const normalizedPathname =
    pathname === "/"
      ? "/portal"
      : pathname.startsWith("/portal")
        ? pathname
        : `/portal${pathname}`;
  const navItems = role === "support_admin" ? supportAdminNavItems : clientNavItems;
  const canManageTeam = role === "client_admin" || role === "agency_admin" || role === "support_admin";
  const visibleNavItems = navItems.filter((item) => item.href !== "/portal/team" || canManageTeam);
  const navLabel = role === "support_admin" ? "EcoFocus Workspace" : "Portal Navigation";

  return (
    <aside className="w-full xl:w-64 2xl:w-72">
      <div className="sticky top-6">
        <div className="rounded-[28px] border border-emerald-100 bg-white/90 p-4 shadow-[0_18px_60px_-35px_rgba(6,95,70,0.45)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {navLabel}
          </p>
          {accessibleCompanies.length > 1 ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <PanelsTopLeft className="h-3.5 w-3.5" />
                <span>Workspaces</span>
              </div>
              <WorkspaceSwitcher
                companies={accessibleCompanies.map((company) => ({
                  id: company.id,
                  name: company.name,
                  subscriberType: company.subscriberType,
                }))}
                currentCompanyId={currentCompanyId}
                variant="sidebar"
              />
            </div>
          ) : null}
          <nav className="mt-4 space-y-1">
            {visibleNavItems.map((item) => {
              const isActive =
                normalizedPathname === item.href || normalizedPathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
