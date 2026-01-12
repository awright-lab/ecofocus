import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "EcoFocus Portal",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession().catch(() => null);
  if (!session) {
    redirect("/login?redirect=/portal");
  }

  const navItems = [
    { href: "/portal", label: "Home" },
    { href: "/portal/dashboard", label: "Dashboard" },
    { href: "/portal/questions", label: "Questions" },
    { href: "/portal/crosstabs", label: "Crosstabs" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              EcoFocus Research
            </p>
            <h1 className="text-lg font-semibold text-gray-900">Client Portal</h1>
          </div>
          <span className="text-sm text-gray-500">Private access</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="w-52 shrink-0">
          <nav className="space-y-1 rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span>{item.label}</span>
                <span aria-hidden>→</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
