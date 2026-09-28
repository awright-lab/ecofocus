import { createHash } from "node:crypto";
export const viewerKey = (email) =>
  createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
// Reconcile one leased identity at a time. No secret or raw upstream error is logged.
export async function synchronizePermissions(job, { viewers, updateGroups }) {
  const credentials = viewers.get(job.userId);
  if (!credentials) return { verified: false, reason: "viewer_missing" };
  if (!updateGroups)
    return { verified: false, reason: "administrator_unavailable" };
  try {
    // The complete union is used even when empty: removals are part of the job.
    const actual = await updateGroups({
      email: credentials.email,
      groupIds: job.groupIds,
    });
    if (
      !Array.isArray(actual) ||
      JSON.stringify([...new Set(actual)].sort()) !==
        JSON.stringify(job.groupIds)
    )
      return { verified: false, reason: "group_readback_failed" };
    return job.blocked
      ? { verified: false, reason: "mapping_required" }
      : { verified: true };
  } catch {
    return { verified: false, reason: "group_update_failed" };
  }
}
export function createPermissionWorker({
  endpoint,
  secret,
  viewers,
  updateGroups,
  send = fetch,
}) {
  const url = new URL(endpoint);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/api/internal/displayr/permissions" ||
    typeof secret !== "string" ||
    secret.length < 32
  )
    throw new Error("Invalid permission worker configuration");
  let running = false;
  async function request(body) {
    const response = await send(url, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(20_000),
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Permission worker request failed");
    return response.json();
  }
  return {
    async tick() {
      if (running) return;
      running = true;
      try {
        const { job } = await request({
          operation: "claim",
          viewerKeys: Object.fromEntries(
            [...viewers].map(([id, v]) => [id, viewerKey(v.email)]),
          ),
        });
        if (!job) return;
        if (
          typeof job.userId !== "string" ||
          !/^[a-f0-9]{64}$/.test(job.revision) ||
          !/^[a-f0-9-]{36}$/.test(job.leaseId) ||
          !Array.isArray(job.groupIds) ||
          job.groupIds.length > 100 ||
          job.groupIds.some(
            (id) =>
              !/^[1-9][0-9]{0,15}$/.test(id) ||
              ["2886362", "2886363", "2886364"].includes(id),
          )
        )
          throw new Error("Invalid permission job");
        const result = await synchronizePermissions(job, {
          viewers,
          updateGroups,
        });
        return await request({
          operation: "complete",
          userId: job.userId,
          revision: job.revision,
          leaseId: job.leaseId,
          ...result,
        });
      } finally {
        running = false;
      }
    },
  };
}
