import { createHash } from "node:crypto";

export type DisplayrBinding = {
  sourceUrl: string;
  projectId: string;
  groupIds: string[];
};
export type DisplayrAssignment = {
  companyId: string;
  dashboardSlug: string;
  sourceUrl: string;
  binding: DisplayrBinding | null;
};
export type DisplayrSnapshot = {
  userId: string;
  assignments: DisplayrAssignment[];
};
const forbiddenGroups = new Set(["2886362", "2886363", "2886364"]);
const numericId = /^[1-9][0-9]{0,15}$/;

export function validateDisplayrBinding(value: DisplayrBinding) {
  if (
    !value ||
    !numericId.test(value.projectId) ||
    !Array.isArray(value.groupIds) ||
    !value.groupIds.length ||
    value.groupIds.length > 20 ||
    value.groupIds.some(
      (id) =>
        typeof id !== "string" ||
        !numericId.test(id) ||
        forbiddenGroups.has(id),
    )
  ) {
    throw new Error(
      "Use a numeric project ID and verified, restricted viewing group IDs.",
    );
  }
  const url = new URL(value.sourceUrl);
  if (
    url.origin !== "https://app.displayr.com" ||
    url.pathname !== "/Dashboard" ||
    url.username ||
    url.password ||
    [...url.searchParams].length !== 1 ||
    !["id", "project_id"].some((key) =>
      /^[\w-]{1,100}$/.test(url.searchParams.get(key) || ""),
    ) ||
    (url.searchParams.has("project_id") &&
      url.searchParams.get("project_id") !== value.projectId)
  ) {
    throw new Error(
      "The mapping must match the assigned Displayr dashboard URL.",
    );
  }
  return { ...value, groupIds: [...new Set(value.groupIds)].sort() };
}

export function permissionPlan(snapshot: DisplayrSnapshot) {
  const assignments = snapshot.assignments
    .map((a) => ({
      ...a,
      binding: a.binding && {
        ...a.binding,
        groupIds: [...a.binding.groupIds].sort(),
      },
    }))
    .sort((a, b) =>
      `${a.companyId}/${a.dashboardSlug}`.localeCompare(
        `${b.companyId}/${b.dashboardSlug}`,
      ),
    );
  const revision = createHash("sha256")
    .update(JSON.stringify({ userId: snapshot.userId, assignments }))
    .digest("hex");
  const groupIds = new Set<string>();
  let blocked = false;
  for (const assignment of assignments) {
    try {
      if (
        !assignment.binding ||
        assignment.binding.sourceUrl !== assignment.sourceUrl
      )
        throw new Error("Mapping missing");
      for (const id of validateDisplayrBinding(assignment.binding).groupIds)
        groupIds.add(id);
    } catch {
      blocked = true;
    }
  }
  return {
    userId: snapshot.userId,
    revision,
    groupIds: [...groupIds].sort(),
    blocked,
    assignments,
  };
}

export function permissionStatus(
  plan: ReturnType<typeof permissionPlan>,
  state?: {
    revision: string;
    status: string;
    checked_at?: string | null;
    reason?: string | null;
  } | null,
) {
  if (plan.blocked)
    return { status: "needs_attention", reason: "mapping_required" };
  if (!state || state.revision !== plan.revision)
    return { status: "pending", reason: null };
  if (
    state.status === "verified" &&
    (!state.checked_at ||
      Date.parse(state.checked_at) + 5 * 60 * 60_000 < Date.now())
  )
    return { status: "pending", reason: "verification_expired" };
  return { status: state.status, reason: state.reason || null };
}
