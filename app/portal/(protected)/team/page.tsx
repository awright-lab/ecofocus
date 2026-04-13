import { TeamInviteHistory } from "@/components/portal/TeamInviteHistory";
import { TeamInviteForm } from "@/components/portal/TeamInviteForm";
import { TeamMemberActions } from "@/components/portal/TeamMemberActions";
import { TeamMemberUsageAllocation } from "@/components/portal/TeamMemberUsageAllocation";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalRole } from "@/lib/portal/auth";
import {
  getPortalTeamInvitesByCompany,
  getPortalTeamMembers,
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
  const [teamMembers, usageAllocations, inviteHistory] = await Promise.all([
    getPortalTeamMembers(access.effectiveUser, access.company.id),
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

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Seat summary</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
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
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Team members</h3>
          <div className="mt-5 space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[1.15fr_0.9fr_0.7fr_0.7fr_0.9fr_0.75fr] md:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-600">{member.email}</p>
                </div>
                <div className="text-sm text-slate-700">{member.role.replace("_", " ")}</div>
                <div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{member.status}</span>
                </div>
                <div className="text-sm text-slate-500">{member.status === "invited" ? "Seat reserved" : member.status === "active" ? "Seat assigned" : "Seat inactive"}</div>
                {member.role === "client_user" || member.role === "agency_user" ? (
                  <TeamMemberUsageAllocation
                    userId={member.id}
                    allocatedHours={usageAllocationsByUserId.get(member.id)?.allocatedHours ?? null}
                    canManage={canManageTeam}
                  />
                ) : (
                  <div className="text-sm text-slate-400">Admin account</div>
                )}
                <TeamMemberActions
                  memberId={member.id}
                  memberStatus={member.status}
                  canManage={canManageTeam}
                  isSelf={member.id === access.user.id}
                />
              </div>
            ))}
          </div>
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
