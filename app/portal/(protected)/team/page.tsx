import { TeamInviteHistory } from "@/components/portal/TeamInviteHistory";
import { TeamInviteForm } from "@/components/portal/TeamInviteForm";
import { TeamMemberActions } from "@/components/portal/TeamMemberActions";
import { TeamMemberUsageAllocation } from "@/components/portal/TeamMemberUsageAllocation";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalRole } from "@/lib/portal/auth";
import {
  getPortalTeamInvitesByCompany,
  getPortalTeamMembers,
  getPortalUsageAllowanceByCompany,
  getPortalUsageAllocationsByCompany,
  getPortalUsersByIds,
  isPortalWorkspaceManager,
} from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Team",
  "Private team and seat management view for the EcoFocus portal.",
);

export default async function TeamPage() {
  const access = await requirePortalRole("client_admin", "/portal/team");
  const canManageTeam = isPortalWorkspaceManager(access.effectiveRole) && !access.isPreviewMode;
  const [teamMembers, usageAllowance, usageAllocations, inviteHistory] = await Promise.all([
    getPortalTeamMembers(access.effectiveUser, access.company.id),
    getPortalUsageAllowanceByCompany(access.company.id),
    getPortalUsageAllocationsByCompany(access.company.id),
    canManageTeam ? getPortalTeamInvitesByCompany(access.company.id) : Promise.resolve([]),
  ]);
  const usageAllocationsByUserId = new Map(usageAllocations.map((allocation) => [allocation.userId, allocation]));
  const inviteActorIds = Array.from(new Set(inviteHistory.map((invite) => invite.invitedByUserId)));
  const inviteActors = await getPortalUsersByIds(inviteActorIds);
  const inviteActorsById = new Map(inviteActors.map((user) => [user.id, user]));
  const seatsAvailable = access.subscription.seatsPurchased - access.subscription.seatsUsed;
  const invitedCount = teamMembers.filter((member) => member.status === "invited").length;
  const activeCount = teamMembers.filter((member) => member.status === "active").length;
  const allocatedHoursTotal = usageAllocations.reduce((total, allocation) => total + allocation.allocatedHours, 0);
  const annualHoursLimit = usageAllowance?.annualHoursLimit ?? 0;
  const unallocatedHours = Math.max(annualHoursLimit - allocatedHoursTotal, 0);
  const allocatedMembers = usageAllocations
    .map((allocation) => ({
      allocation,
      member: teamMembers.find((member) => member.id === allocation.userId) || null,
    }))
    .filter((item) => item.allocation.allocatedHours > 0);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Team"
          title="Team access"
          description={
            access.isPreviewMode
              ? "This read-only preview shows the team management workspace as the simulated admin role would see it."
              : "Review seat availability, see active teammates, and manage access for your workspace."
          }
        />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-950">Seat summary</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Purchased</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{access.subscription.seatsPurchased}</p>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Available</p>
            <p className="mt-2 text-3xl font-semibold">{seatsAvailable}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Active</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{activeCount}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Invited</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{invitedCount}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Hours allocation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track how many dashboard hours are assigned to teammates and how many are still available to allocate.
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
            {annualHoursLimit ? `${unallocatedHours} hours left to assign` : "No hour limit set"}
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Plan hours</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{annualHoursLimit || "Included"}</p>
          </div>
          <div className="rounded-[24px] bg-sky-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Allocated</p>
            <p className="mt-2 text-3xl font-semibold text-sky-950">{allocatedHoursTotal}</p>
          </div>
          <div className="rounded-[24px] bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Unassigned</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-950">{annualHoursLimit ? unallocatedHours : "Open"}</p>
          </div>
        </div>
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Assigned by teammate</p>
          {allocatedMembers.length ? (
            <div className="mt-3 divide-y divide-slate-200">
              {allocatedMembers.map(({ allocation, member }) => (
                <div key={allocation.userId} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{member?.name || allocation.userId}</p>
                    <p className="text-xs text-slate-500">{member?.email || "Workspace teammate"}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                    {allocation.allocatedHours} hours
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">No teammate hours have been assigned yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Team members</h3>
          <div className="mt-5 overflow-x-auto rounded-[26px] border border-slate-200 bg-white">
            <div className="hidden grid-cols-[minmax(220px,1.3fr)_minmax(120px,0.75fr)_minmax(110px,0.65fr)_minmax(130px,0.7fr)_minmax(190px,0.95fr)_minmax(130px,0.7fr)] border-b border-slate-200 bg-slate-50/80 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid">
              <span>Teammate</span>
              <span>Role</span>
              <span>Status</span>
              <span>Seat</span>
              <span>Hours</span>
              <span className="text-right">Actions</span>
            </div>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="grid gap-4 border-b border-slate-100 bg-white px-5 py-4 last:border-b-0 lg:grid-cols-[minmax(220px,1.3fr)_minmax(120px,0.75fr)_minmax(110px,0.65fr)_minmax(130px,0.7fr)_minmax(190px,0.95fr)_minmax(130px,0.7fr)] lg:items-center"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="truncate text-sm text-slate-600">{member.email}</p>
                </div>
                <div className="border-slate-200 lg:border-l lg:pl-4">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 lg:hidden">
                    Role
                  </p>
                  <p className="text-sm capitalize text-slate-700">{member.role.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 lg:hidden">
                    Status
                  </p>
                  <span className="inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {member.status}
                  </span>
                </div>
                <div className="border-slate-200 lg:border-l lg:pl-4">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 lg:hidden">
                    Seat
                  </p>
                  <p className="text-sm text-slate-500">
                    {member.status === "invited" ? "Reserved" : member.status === "active" ? "Assigned" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 lg:hidden">
                    Hours
                  </p>
                  {member.role === "client_user" || member.role === "agency_user" ? (
                    <TeamMemberUsageAllocation
                      userId={member.id}
                      allocatedHours={usageAllocationsByUserId.get(member.id)?.allocatedHours ?? null}
                      canManage={canManageTeam}
                    />
                  ) : (
                    <p className="text-sm text-slate-400">Admin account</p>
                  )}
                </div>
                <div className="border-slate-200 lg:border-l lg:pl-4 lg:text-right">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 lg:hidden">
                    Actions
                  </p>
                  <TeamMemberActions
                    memberId={member.id}
                    memberStatus={member.status}
                    canManage={canManageTeam}
                    isSelf={member.id === access.user.id}
                  />
                </div>
              </div>
            ))}
          </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="max-w-xl">
          <h3 className="text-lg font-semibold text-slate-950">Invite teammate</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {access.isPreviewMode
              ? "Invites are disabled in support preview mode so you can inspect the screen without changing access."
              : "Add a teammate by reserving a seat and sending them access for this workspace."}
          </p>
          <TeamInviteForm
            canManage={canManageTeam}
            seatsAvailable={seatsAvailable}
            subscriberType={access.company.subscriberType || "brand"}
          />
        </div>
      </section>

      {canManageTeam ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Invite activity</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Review recent invite activity and resend setup links when a teammate needs another copy.
          </p>
          <div className="mt-5">
            {inviteHistory.length ? (
              <TeamInviteHistory
                canManage={canManageTeam}
                invites={inviteHistory.map((invite) => ({
                  id: invite.id,
                  invitedName: invite.invitedName,
                  invitedEmail: invite.invitedEmail,
                  invitedRole: invite.invitedRole,
                  invitedByName: inviteActorsById.get(invite.invitedByUserId)?.name || invite.invitedByUserId,
                  inviteUrl: invite.inviteUrl,
                  deliveryStatus: invite.deliveryStatus,
                  deliveryMessage: invite.deliveryMessage || null,
                  createdAt: formatDateTime(invite.createdAt),
                  lastSentAt: invite.lastSentAt ? formatDateTime(invite.lastSentAt) : null,
                }))}
              />
            ) : (
              <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
                No invite activity has been recorded for this account yet.
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
