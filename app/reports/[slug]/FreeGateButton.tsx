// app/reports/[id]/sections/FreeGateButton.tsx
"use client";

import { useState } from "react";
import FreeDownloadModal from "./FreeDownloadModal";

export default function FreeGateButton({ fileHref }: { fileHref: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center justify-center rounded-full bg-[#FFC107] px-6 py-3 text-sm font-semibold text-emerald-950"
      >
        Download free
      </button>
      {open && <FreeDownloadModal fileHref={fileHref} onClose={() => setOpen(false)} />}
    </>
  );
}
