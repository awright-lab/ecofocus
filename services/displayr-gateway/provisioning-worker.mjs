import { advanceProvisioning } from "./provisioning-workflow.mjs";
import { installViewerCredentials } from "./viewer-credential-store.mjs";
export function createProvisioningWorker({
  endpoint,
  secret,
  viewers,
  viewerIds,
  broker,
  browser,
  activate,
  authenticateViewer,
  synchronize,
  companyId,
  send = fetch,
}) {
  const url = new URL(endpoint);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/api/internal/displayr/provisioning" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    typeof secret !== "string" ||
    secret.length < 32
  )
    throw Error("Invalid provisioning configuration");
  const legacyIds = [...viewers.keys()],
    managedIds = new Set();
  let running = false;
  async function request(body) {
    const response = await send(url, {
      method: "POST",
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw Error("Provisioning request failed");
    return response.json();
  }
  async function refresh() {
    const { records } = await request({ operation: "credentials" });
    installViewerCredentials({
      viewers,
      viewerIds,
      broker,
      records,
      managedIds,
    });
  }
  return {
    async tick() {
      if (running) return;
      running = true;
      let job;
      try {
        await refresh();
        ({ job } = await request({
          operation: "claim",
          existingUserIds: legacyIds,
        }));
        if (!job) return;
        if (
          typeof job.userId !== "string" ||
          typeof job.leaseId !== "string" ||
          typeof job.credential?.email !== "string" ||
          typeof job.credential?.password !== "string"
        )
          throw Error("Invalid provisioning job");
        const call = (operation, extra = {}) =>
          request({
            operation,
            userId: job.userId,
            leaseId: job.leaseId,
            ...extra,
          });
        const result = await advanceProvisioning(job, {
          eligible: async () => (await call("eligible")).eligible === true,
          store: {
            ensureCredentials: async () => job.credential,
            credentials: async () => job.credential,
            transition: async (_, next) =>
              (await call("transition", next)).accepted === true,
            consumePermit: async (_, kind) =>
              (await call("permit", { kind })).accepted === true,
          },
          inspectAccount: browser.inspect,
          invite: (credential) =>
            browser.invite({ ...credential, fullName: job.fullName }),
          findInvitation: () => call("invitation"),
          activate: (credential) => activate({ ...credential, companyId }),
          verifyLogin: async (credential) => {
            try {
              await authenticateViewer(credential);
              const account = await browser.inspect(credential.email);
              if (account.status !== "active") return false;
              return (
                (
                  await call("identity", {
                    displayrUserId: account.displayrUserId,
                  })
                ).accepted === true
              );
            } catch {
              return false;
            }
          },
          synchronize: async () => {
            await refresh();
            await synchronize();
            return { verified: false };
          },
        });
        // A separate permission worker stores authoritative readback. The server
        // rejects ready until that current revision is verified.
        if (result.reason === "permissions_pending")
          await call("transition", { stage: "ready" });
        return { status: result.status };
      } finally {
        if (job)
          await request({
            operation: "release",
            userId: job.userId,
            leaseId: job.leaseId,
          }).catch(() => {});
        running = false;
      }
    },
  };
}
