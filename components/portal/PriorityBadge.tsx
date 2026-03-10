import { cx } from "@/lib/utils";
import type { PortalTicket } from "@/lib/portal/types";

const toneMap: Record<PortalTicket["priority"], string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  urgent: "bg-rose-50 text-rose-700 border-rose-200",
};

export function PriorityBadge({ priority }: { priority: PortalTicket["priority"] }) {
  return (
    <span className={cx("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", toneMap[priority])}>
      {priority}
    </span>
  );
}
