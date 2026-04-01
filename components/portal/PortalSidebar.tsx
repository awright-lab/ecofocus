"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircleHelp,
  CreditCard,
  FolderKanban,
  Home,
  LifeBuoy,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cx } from "@/lib/utils";
import type { PortalRole } from "@/lib/portal/types";

const clientNavItems = [
  { href: "/portal/home", label: "Home", icon: Home },
  { href: "/portal/dashboards", label: "My Dashboards", icon: BarChart3 },
  { href: "/portal/support", label: "Support Center", icon: LifeBuoy },
  { href: "/portal/help", label: "Knowledge Base", icon: CircleHelp },
  { href: "/portal/account", label: "Account", icon: CreditCard },
  { href: "/portal/team", label: "Team", icon: Users },
];

const supportAdminNavItems = [
  { href: "/portal/home", label: "Overview", icon: Home },
  { href: "/portal/admin/library", label: "All Dashboards", icon: BarChart3 },
  { href: "/portal/admin/support", label: "Support Queue", icon: LifeBuoy },
  { href: "/portal/admin/dashboards", label: "Dashboard Access", icon: ShieldCheck },
  { href: "/portal/support/tickets", label: "Ticket Inbox", icon: FolderKanban },
  { href: "/portal/help", label: "Knowledge Base", icon: CircleHelp },
  { href: "/portal/account", label: "Account", icon: CreditCard },
];

export function PortalSidebar({ role }: { role: PortalRole }) {
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
      <div className="sticky top-6 space-y-4">
        <div className="rounded-[28px] border border-emerald-100 bg-white/90 p-4 shadow-[0_18px_60px_-35px_rgba(6,95,70,0.45)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {navLabel}
          </p>
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

        {role === "support_admin" ? (
          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Internal Scope
            </p>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Internal routes are separated from the client workspace so EcoFocus reviews and configuration work stay operationally distinct.
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
