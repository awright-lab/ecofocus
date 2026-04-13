import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalTeamMembersByCompany } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type AllocationBody = {
  userId?: string;
  allocatedHours?: number;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access) {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Preview mode is read-only. Exit preview mode to update allocations." }, 403);
  }
  if (
    access.effectiveRole !== "client_admin" &&
    access.effectiveRole !== "agency_admin" &&
    access.effectiveRole !== "support_admin"
  ) {
    return asJson({ error: "Only admins can update usage allocations." }, 403);
  }

  let body: AllocationBody;
  try {
    body = (await req.json()) as AllocationBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const userId = String(body.userId || "").trim();
  const allocatedHours = Number(body.allocatedHours);
  if (!userId || !Number.isFinite(allocatedHours) || allocatedHours < 0) {
    return asJson({ error: "userId and a non-negative allocatedHours value are required." }, 400);
  }

  const teamMembers = await getPortalTeamMembersByCompany(access.company.id);
  const targetMember = teamMembers.find((member) => member.id === userId);
  if (!targetMember && access.effectiveRole !== "support_admin") {
    return asJson({ error: "Team member not found for this workspace." }, 404);
  }

  const companyId =
    access.effectiveRole === "support_admin"
      ? String(targetMember?.companyId || access.company.id)
      : access.company.id;

  try {
    const admin = getServiceSupabase();
    const { error } = await admin.from("portal_usage_allocations").upsert({
      company_id: companyId,
      user_id: userId,
      allocated_hours: allocatedHours,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Allocation storage unavailable.",
      },
      503,
    );
  }
}
