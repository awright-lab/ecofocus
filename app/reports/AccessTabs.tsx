// app/reports/sections/AccessTabs.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TABS = ["All", "Free", "Premium"] as const;

export default function AccessTabs() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = (sp.get("access") ?? "All") as (typeof TABS)[number];

  function set(access: string) {
    const next = new URLSearchParams(sp.toString());
    if (access === "All") next.delete("access");
    else next.set("access", access);
    next.delete("cursor");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-2">
      <div className="flex w-full items-center justify-center gap-2">
        {TABS.map((t) => {
          const active = t === current;
          return (
            <button
              key={t}
              onClick={() => set(t)}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium
                ${active
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

