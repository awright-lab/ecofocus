import { cx } from "@/lib/utils";
import type { PortalTicket } from "@/lib/portal/types";

const toneMap: Record<PortalTicket["status"], string> = {
  open: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-sky-50 text-sky-700 border-sky-200",
  waiting_on_client: "bg-violet-50 text-violet-700 border-violet-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function TicketStatusBadge({ status }: { status: PortalTicket["status"] }) {
  return (
    <span className={cx("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", toneMap[status])}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
