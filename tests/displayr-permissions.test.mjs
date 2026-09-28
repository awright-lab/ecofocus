import { test } from "node:test";
import assert from "node:assert/strict";
import {
  permissionPlan,
  permissionStatus,
  validateDisplayrBinding,
} from "../lib/portal/displayr-permissions.ts";
const assignment = (companyId, projectId, groupIds) => ({
  companyId,
  dashboardSlug: "report",
  sourceUrl: `https://app.displayr.com/Dashboard?project_id=${projectId}`,
  binding: {
    sourceUrl: `https://app.displayr.com/Dashboard?project_id=${projectId}`,
    projectId,
    groupIds,
  },
});
test("permission union retains groups needed by other workspaces and supports removing all groups", () => {
  const first = assignment("a", "123", ["1", "2"]),
    second = assignment("b", "456", ["2", "3"]);
  const plan = permissionPlan({ userId: "u", assignments: [first, second] });
  assert.deepEqual(plan.groupIds, ["1", "2", "3"]);
  assert.equal(plan.blocked, false);
  assert.equal(
    permissionPlan({ userId: "u", assignments: [second, first] }).revision,
    plan.revision,
  );
  assert.deepEqual(
    permissionPlan({ userId: "u", assignments: [second] }).groupIds,
    ["2", "3"],
  );
  assert.deepEqual(
    permissionPlan({ userId: "u", assignments: [] }).groupIds,
    [],
  );
  assert.equal(
    permissionStatus(plan, {
      revision: plan.revision,
      status: "verified",
      checked_at: new Date().toISOString(),
    }).status,
    "verified",
  );
  assert.equal(
    permissionStatus(permissionPlan({ userId: "u", assignments: [second] }), {
      revision: plan.revision,
      status: "verified",
      checked_at: new Date().toISOString(),
    }).status,
    "pending",
  );
});
test("unverified, changed, privileged and substituted mappings never become verified", () => {
  for (const binding of [
    null,
    { sourceUrl: "https://evil.test", projectId: "123", groupIds: ["1"] },
    {
      sourceUrl: "https://app.displayr.com/Dashboard?project_id=123",
      projectId: "123",
      groupIds: ["2886364"],
    },
  ]) {
    const plan = permissionPlan({
      userId: "u",
      assignments: [{ ...assignment("a", "123", ["1"]), binding }],
    });
    assert.equal(plan.blocked, true);
    assert.equal(
      permissionStatus(plan, {
        revision: plan.revision,
        status: "verified",
        checked_at: new Date().toISOString(),
      }).status,
      "needs_attention",
    );
  }
  assert.throws(() =>
    validateDisplayrBinding({
      sourceUrl: "https://app.displayr.com/Dashboard?project_id=123",
      projectId: "456",
      groupIds: ["1"],
    }),
  );
  assert.throws(() =>
    validateDisplayrBinding({
      sourceUrl: "https://app.displayr.com/Dashboard?project_id=123&id=456",
      projectId: "123",
      groupIds: ["1"],
    }),
  );
});
