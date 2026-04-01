import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { isPortalWorkspaceManager } from "@/lib/portal/data";
import { updatePortalTeamMemberStatus } from "@/lib/portal/provisioning";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type StatusBody = {
  action?: "deactivate" | "reactivate";
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await getPortalAccessContext();
  if (!access || !isPortalWorkspaceManager(access.user.role)) {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to change teammate status." }, 403);
  }

  const { id } = await params;
  if (id === access.user.id) {
    return asJson({ error: "You cannot change your own access from the team page." }, 400);
  }

  let body: StatusBody;
  try {
    body = (await req.json()) as StatusBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const action = body.action;
  if (action !== "deactivate" && action !== "reactivate") {
    return asJson({ error: "A valid action is required." }, 400);
  }

  try {
    const result = await updatePortalTeamMemberStatus({
      userId: id,
      companyId: access.company.id,
      subscriptionId: access.subscription.id,
      action,
    });

    return asJson({ ok: true, status: result.status });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to update teammate status.",
      },
      400,
    );
  }
}
