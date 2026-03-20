import { TeamInviteHistory } from "@/components/portal/TeamInviteHistory";
import { TeamInviteForm } from "@/components/portal/TeamInviteForm";
import { TeamMemberActions } from "@/components/portal/TeamMemberActions";
import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalTeamInvitesByCompany, getPortalTeamMembers, getPortalUsersByIds } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";
import { formatDateTime } from "@/lib/utils";

export const metadata = buildPortalMetadata(
  "Team Management",
  "Private team and seat management view for the EcoFocus portal.",
);

export default async function TeamPage() {
  const access = await requirePortalAccess("/portal/team");
  const teamMembers = await getPortalTeamMembers(access.user);
  const inviteHistory = await getPortalTeamInvitesByCompany(access.company.id);
  const inviteActorIds = Array.from(new Set(inviteHistory.map((invite) => invite.invitedByUserId)));
  const inviteActors = await getPortalUsersByIds(inviteActorIds);
  const inviteActorsById = new Map(inviteActors.map((user) => [user.id, user]));
  const seatsAvailable = access.subscription.seatsPurchased - access.subscription.seatsUsed;
  const canManageTeam = access.user.role === "client_admin" || access.user.role === "support_admin";
  const invitedCount = teamMembers.filter((member) => member.status === "invited").length;
  const activeCount = teamMembers.filter((member) => member.status === "active").length;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Team"
          title="Team and seat management"
          description="Review seat availability, see active teammates, and prepare access updates for your organization."
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
              Add a teammate by reserving a seat and marking the user as invited for this account.
            </p>
            <TeamInviteForm canManage={canManageTeam} seatsAvailable={seatsAvailable} />
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Team members</h3>
          <div className="mt-5 space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[1.2fr_1fr_0.7fr_0.7fr_0.8fr] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-600">{member.email}</p>
                </div>
                <div className="text-sm text-slate-700">{member.role.replace("_", " ")}</div>
                <div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{member.status}</span>
                </div>
                <div className="text-sm text-slate-500">{member.status === "invited" ? "Seat reserved" : member.status === "active" ? "Seat assigned" : "Seat inactive"}</div>
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

      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-950">Invite activity</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Review recent invite activity, confirm whether delivery succeeded, and resend access emails when a teammate needs another copy.
        </p>
        <div className="mt-5">
          {inviteHistory.length ? (
            <TeamInviteHistory
              invites={inviteHistory.map((invite) => ({
                id: invite.id,
                invitedName: invite.invitedName,
                invitedEmail: invite.invitedEmail,
                invitedRole: invite.invitedRole,
                invitedByName: inviteActorsById.get(invite.invitedByUserId)?.name || invite.invitedByUserId,
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
    </div>
  );
}
