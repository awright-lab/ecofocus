import { test } from "node:test";
import assert from "node:assert/strict";
import {
  synchronizePermissions,
  createPermissionWorker,
} from "../permission-worker.mjs";
test("synchronizer verifies exact readback including removals; missing viewers never succeed", async () => {
  const viewers = new Map([
    ["u", { email: "viewer@example.org", password: "private" }],
  ]);
  let sent;
  const deps = {
    viewers,
    updateGroups: async (job) => {
      sent = job;
      return job.groupIds;
    },
  };
  assert.deepEqual(
    await synchronizePermissions(
      { userId: "u", groupIds: [], blocked: false },
      deps,
    ),
    { verified: true },
  );
  assert.deepEqual(sent, { email: "viewer@example.org", groupIds: [] });
  assert.equal(
    (await synchronizePermissions({ userId: "missing" }, deps)).reason,
    "viewer_missing",
  );
  assert.equal(
    (await synchronizePermissions({ userId: "u" }, { viewers })).reason,
    "administrator_unavailable",
  );
  assert.equal(
    (
      await synchronizePermissions(
        { userId: "u", groupIds: ["1"] },
        { viewers, updateGroups: async () => ["1", "2"] },
      )
    ).reason,
    "group_readback_failed",
  );
  assert.equal(
    (
      await synchronizePermissions(
        { userId: "u", groupIds: [], blocked: true },
        deps,
      )
    ).reason,
    "mapping_required",
  );
});
test("worker excludes passwords from requests and completes using its lease", async () => {
  const calls = [];
  const job = {
    userId: "u",
    revision: "a".repeat(64),
    leaseId: "12345678-1234-1234-1234-123456789012",
    groupIds: ["1"],
    blocked: false,
  };
  const worker = createPermissionWorker({
    endpoint: "https://portal.example.org/api/internal/displayr/permissions",
    secret: "x".repeat(32),
    viewers: new Map([
      ["u", { email: "viewer@example.org", password: "do-not-send" }],
    ]),
    updateGroups: async () => ["1"],
    send: async (_url, init) => {
      const body = JSON.parse(init.body);
      calls.push(body);
      return Response.json(
        body.operation === "claim" ? { job } : { accepted: true },
      );
    },
  });
  await worker.tick();
  assert.equal(calls[1].verified, true);
  assert.equal(calls[1].leaseId, job.leaseId);
  assert(!JSON.stringify(calls).includes("do-not-send"));
});
