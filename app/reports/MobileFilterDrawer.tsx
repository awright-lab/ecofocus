"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
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
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-[110] lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <DialogPanel className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <DialogTitle className="font-semibold text-emerald-900">Filters</DialogTitle>
          <button onClick={onClose} className="text-emerald-800">Close</button>
        </div>
        <LeftFilterRail access={access} year={year} topic={topic} type={type} setParam={setParam} />
      </DialogPanel>
    </Dialog>
  );
}
