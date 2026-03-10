import { SectionHeader } from "@/components/portal/SectionHeader";
import { requirePortalAccess } from "@/lib/portal/auth";
import { getPortalTeamMembers } from "@/lib/portal/data";
import { buildPortalMetadata } from "@/lib/portal/metadata";

export const metadata = buildPortalMetadata(
  "Team Management",
  "Private team and seat management scaffold for the EcoFocus portal.",
);

export default async function TeamPage() {
  const access = await requirePortalAccess("/portal/team");
  const teamMembers = getPortalTeamMembers(access.user);
  const seatsAvailable = access.subscription.seatsPurchased - access.subscription.seatsUsed;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <SectionHeader
          eyebrow="Team"
          title="Seat management scaffold"
          description="This MVP intentionally stops short of provisioning logic. It shows how team members, roles, invitations, and seat availability can live in the portal."
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
            </div>
          </div>

          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Invite teammate</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Placeholder UI for role assignment, invitation email, and seat consumption rules.
            </p>
            <div className="mt-5 grid gap-3">
              <input placeholder="teammate@company.com" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none" />
              <select className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none">
                <option>client_user</option>
                <option>client_admin</option>
              </select>
              <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Send invite placeholder</button>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Team members</h3>
          <div className="mt-5 space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-[1.2fr_1.1fr_0.7fr_0.7fr] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-600">{member.email}</p>
                </div>
                <div className="text-sm text-slate-700">{member.role.replace("_", " ")}</div>
                <div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{member.status}</span>
                </div>
                <div className="text-sm text-slate-500">Seat-aware TODO</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
