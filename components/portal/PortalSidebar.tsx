"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  CircleHelp,
  Gauge,
  Home,
  LifeBuoy,
  PanelsTopLeft,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cx } from "@/lib/utils";
import type { PortalRole } from "@/lib/portal/types";

const clientNavItems = [
  { href: "/portal/home", label: "Home", icon: Home },
  { href: "/portal/workspaces", label: "Switch Workspace", icon: PanelsTopLeft },
  { href: "/portal/dashboards", label: "Dashboards", icon: BarChart3 },
  { href: "/portal/support", label: "Support", icon: LifeBuoy },
  { href: "/portal/help", label: "Help", icon: CircleHelp },
  { href: "/portal/team", label: "Team", icon: Users },
];

const supportAdminNavSections = [
  {
    title: "Operations",
    items: [
      { href: "/portal/home", label: "Overview", icon: Home },
      { href: "/portal/admin/support", label: "Support Queue", icon: LifeBuoy },
      { href: "/portal/admin/audit", label: "Audit", icon: Activity },
    ],
  },
  {
    title: "Access",
    items: [
      { href: "/portal/workspaces", label: "Workspaces", icon: PanelsTopLeft },
      { href: "/portal/admin/library", label: "Dashboard Library", icon: BarChart3 },
      { href: "/portal/admin/dashboards", label: "Dashboard Access", icon: ShieldCheck },
    ],
  },
  {
    title: "Billing and Admin",
    items: [{ href: "/portal/admin/usage", label: "Usage Controls", icon: Gauge }],
  },
  {
    title: "Help",
    items: [{ href: "/portal/help", label: "Knowledge Base", icon: CircleHelp }],
  },
] as const;

export function PortalSidebar({
  role,
  showWorkspaceDirectory,
}: {
  role: PortalRole;
  showWorkspaceDirectory: boolean;
}) {
  const pathname = usePathname();
  const normalizedPathname =
    pathname === "/"
      ? "/portal"
      : pathname.startsWith("/portal")
        ? pathname
        : `/portal${pathname}`;
  const canManageTeam = role === "client_admin" || role === "agency_admin" || role === "support_admin";
  const navLabel = role === "support_admin" ? "EcoFocus Workspace" : "Portal Navigation";
  const filteredClientNavItems = clientNavItems
    .filter((item) => item.href !== "/portal/team" || canManageTeam)
    .filter((item) => item.href !== "/portal/workspaces" || showWorkspaceDirectory);
  const filteredAdminSections = supportAdminNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.href !== "/portal/workspaces" || showWorkspaceDirectory),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className="w-full xl:w-64 2xl:w-72">
      <div className="sticky top-6">
        <div className="rounded-[28px] border border-emerald-100 bg-white/90 p-4 shadow-[0_18px_60px_-35px_rgba(6,95,70,0.45)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {navLabel}
          </p>
          {role === "support_admin" ? (
            <div className="mt-4 space-y-5">
              {filteredAdminSections.map((section) => (
                <div key={section.title}>
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {section.title}
                  </p>
                  <nav className="mt-2 space-y-1">
                    {section.items.map((item) => {
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
              ))}
            </div>
          ) : (
            <nav className="mt-4 space-y-1">
              {filteredClientNavItems.map((item) => {
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
          )}
        </div>
      </div>
    </aside>
  );
}
