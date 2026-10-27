import { test } from "node:test";
import assert from "node:assert/strict";
import { createProvisioningWorker } from "../provisioning-worker.mjs";
test("complete worker flow persists identity, loads dynamic credentials, synchronizes and marks ready without restarting", async () => {
  const credential = {
      email: "new@example.org",
      password: "generated-password",
    },
    job = {
      userId: "new",
      fullName: "Test",
      leaseId: "lease",
      createdAt: "2026-09-29",
      stage: "queued",
      credential,
    };
  const viewers = new Map([
      [
        "legacy",
        { email: "legacy@example.org", password: "existing-password" },
      ],
    ]),
    viewerIds = {},
    permits = new Set(),
    calls = [];
  let invited = false,
    active = false,
    verified = false,
    claimed = false;
  const request = async (_url, init) => {
    const b = JSON.parse(init.body);
    calls.push(b);
    assert(!JSON.stringify(b).includes(credential.password));
    if (b.operation === "credentials")
      return Response.json({
        records: ["credentials_verified", "ready"].includes(job.stage)
          ? [{ userId: "new", ...credential, displayrUserId: "123" }]
          : [],
      });
    if (b.operation === "claim") {
      assert.deepEqual(b.existingUserIds, ["legacy"]);
      if (claimed || job.stage === "ready") return Response.json({ job: null });
      claimed = true;
      return Response.json({ job });
    }
    if (b.operation === "eligible") return Response.json({ eligible: true });
    if (b.operation === "permit") {
      const accepted = !permits.has(b.kind);
      permits.add(b.kind);
      return Response.json({ accepted });
    }
    if (b.operation === "transition") {
      if (b.stage === "ready" && !verified)
        return Response.json({ accepted: false });
      job.stage = b.stage;
      return Response.json({ accepted: true });
    }
    if (b.operation === "identity") {
      assert.equal(b.displayrUserId, "123");
      return Response.json({ accepted: true });
    }
    if (b.operation === "invitation")
      return Response.json({ status: "verified", link: "private-url" });
    if (b.operation === "release") {
      claimed = false;
      return Response.json({ accepted: true });
    }
    throw Error("Unexpected operation");
  };
  const worker = createProvisioningWorker({
    endpoint: "https://portal.example/api/internal/displayr/provisioning",
    secret: "x".repeat(32),
    viewers,
    viewerIds,
    broker: { invalidate: () => {} },
    companyId: "984256",
    send: request,
    browser: {
      inspect: async () => ({
        status: active ? "active" : invited ? "invited" : "absent",
        displayrUserId: "123",
      }),
      invite: async () => {
        assert(!invited);
        invited = true;
      },
    },
    activate: async () => {
      active = true;
    },
    authenticateViewer: async (c) => {
      assert(active);
      assert.equal(c.password, credential.password);
    },
    synchronize: async () => {
      assert.equal(viewers.get("new").password, credential.password);
      assert.equal(viewerIds.new, "123");
      verified = true;
    },
  });
  await worker.tick();
  assert.equal(job.stage, "invitation_pending");
  await worker.tick();
  assert.equal(job.stage, "ready");
  assert(verified);
  assert(viewers.has("legacy"));
  assert.equal(
    calls.filter((c) => c.operation === "permit" && c.kind === "invite").length,
    1,
  );
});
test("a failed credential refresh preserves working identities and does not claim a job", async () => {
  const viewers = new Map([
    ["existing", { email: "e@example.org", password: "secret" }],
  ]);
  let calls = 0;
  const worker = createProvisioningWorker({
    endpoint: "https://portal.example/api/internal/displayr/provisioning",
    secret: "x".repeat(32),
    viewers,
    viewerIds: {},
    broker: { invalidate: () => assert.fail() },
    send: async () => {
      calls++;
      return new Response("", { status: 503 });
    },
  });
  await assert.rejects(worker.tick());
  assert.equal(calls, 1);
  assert(viewers.has("existing"));
});
