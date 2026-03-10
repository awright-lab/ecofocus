import { RoleGuard } from "@/components/portal/RoleGuard";
import { PriorityBadge } from "@/components/portal/PriorityBadge";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { TicketStatusBadge } from "@/components/portal/TicketStatusBadge";
import { getPortalTicketsForUser, getPortalUserName } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Admin Support Queue",
  "Internal support admin queue for the EcoFocus portal.",
);

const filterOptions = {
  status: ["open", "in_progress", "waiting_on_client", "resolved"],
  priority: ["low", "medium", "high", "urgent"],
  issueType: ["Login / Access", "Dashboard Navigation", "Chart Export", "Data Question", "Possible Bug", "Feature Request", "Training Request"],
};

export default function AdminSupportPage() {
  return (
    <RoleGuard role="support_admin" redirectTarget="/portal/admin/support">
      {(access) => {
        const tickets = getPortalTicketsForUser(access.user);

        return (
          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6">
              <SectionHeader
                eyebrow="Internal Admin"
                title="Support queue"
                description="Protected internal view for ticket operations, assignment, prioritization, internal notes, and escalation handling."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {Object.entries(filterOptions).map(([key, values]) => (
                  <div key={key} className="rounded-[24px] bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{key}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {values.map((value) => (
                        <span key={value} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
              <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr_0.9fr_0.8fr_1fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span>Ticket</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Issue Type</span>
                <span>Owner</span>
                <span>Updated</span>
              </div>
              {tickets.map((ticket) => (
                <div key={ticket.id} className="grid grid-cols-[1.4fr_0.9fr_0.8fr_0.9fr_0.8fr_1fr] gap-4 border-b border-slate-100 px-6 py-5 text-sm last:border-b-0">
                  <div>
                    <p className="font-semibold text-slate-900">{ticket.subject}</p>
                    <p className="mt-1 text-slate-600">{ticket.id}</p>
                  </div>
                  <div className="self-center">
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <div className="self-center">
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <div className="self-center text-slate-700">{ticket.issueType}</div>
                  <div className="self-center text-slate-700">
                    {ticket.ownerId ? getPortalUserName(ticket.ownerId) : "Unassigned"}
                  </div>
                  <div className="self-center text-slate-600">{formatDate(ticket.updatedAt)}</div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Assignment placeholder</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  TODO: add queue ownership, workload balancing, and SLA-aware assignment actions.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Internal notes placeholder</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  TODO: persist internal-only notes and separate them from client-visible conversation threads.
                </p>
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Escalation placeholder</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  TODO: add escalation paths for delivery blockers, data integrity incidents, and vendor-related issues.
                </p>
              </div>
            </section>
          </div>
        );
      }}
    </RoleGuard>
  );
}
