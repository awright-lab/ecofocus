"use client";

import { LeftFilterRail } from "./LeftFilterRail";
import type { Access } from "./useReportSearchParams";

export function MobileFilterDrawer({
  open,
  onClose,
  access,
  year,
  topic,
  type,
  setParam,
}: {
  open: boolean;
  onClose: () => void;
  access: Access;
  year: string;
  topic: string;
  type: string;
  setParam: (k: string, v?: string | number | null) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-emerald-900">Filters</h3>
          <button onClick={onClose} className="text-emerald-800">Close</button>
        </div>
        <LeftFilterRail access={access} year={year} topic={topic} type={type} setParam={setParam} />
      </div>
    </div>
  );
}
