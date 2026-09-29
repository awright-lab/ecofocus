import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { NextRequest } from "next/server.js";
test("provisioning requires a private worker, current lease, eligibility and permissions bound to this viewer", async () => {
  const dir = await mkdtemp(join(tmpdir(), "provision-route-")),
    previous = process.env.DISPLAYR_PERMISSION_SYNC_SECRET;
  process.env.DISPLAYR_PERMISSION_SYNC_SECRET = "x".repeat(32);
  const f = (globalThis.__provisionRoute = {
    enabled: true,
    eligible: true,
    row: { email: "viewer@example.org", stage: "credentials_verified" },
    state: {
      revision: "r",
      status: "verified",
      checked_at: new Date().toISOString(),
      viewer_key: "wrong",
    },
    calls: [],
    db: {
      from() {
        const q = {
          select: () => q,
          eq: () => q,
          gt: () => q,
          maybeSingle: async () => ({ data: f.row }),
        };
        return q;
      },
      rpc: async (name, args) => {
        f.calls.push({ name, args });
        return { data: true };
      },
    },
  });
  try {
    await build({
      entryPoints: ["app/api/internal/displayr/provisioning/route.ts"],
      outfile: join(dir, "route.mjs"),
      bundle: true,
      platform: "node",
      format: "esm",
      plugins: [
        {
          name: "fixtures",
          setup(b) {
            b.onResolve({ filter: /^next\/server$/ }, () => ({
              path: import.meta
                .resolve("next/server.js")
                .replace("file://", ""),
              external: true,
            }));
            b.onResolve(
              {
                filter:
                  /^@\/lib\/(supabase\/server|portal\/(displayr-provisioning-store|displayr-permission-store|displayr-mailbox-reader))$/,
              },
              (a) => ({ path: a.path, namespace: "fixture" }),
            );
            b.onLoad({ filter: /.*/, namespace: "fixture" }, (a) => ({
              contents: a.path.includes("supabase")
                ? "export const getServiceSupabase=()=>globalThis.__provisionRoute.db;"
                : a.path.endsWith("displayr-provisioning-store")
                  ? 'export const provisioningEnabled=()=>globalThis.__provisionRoute.enabled;export const provisioningEligible=async()=>globalThis.__provisionRoute.eligible;export const ensureProvisioning=async()=>{};export const openProvisioningCredential=()=>{throw Error("Unexpected credential read")};'
                  : a.path.endsWith("displayr-permission-store")
                    ? 'export const getDisplayrPermissionPlan=async()=>({revision:"r",blocked:false});export const getDisplayrPermissionState=async()=>globalThis.__provisionRoute.state;'
                    : 'export const getProvisioningMailboxReader=async()=>{throw Error("Unexpected mailbox read")};',
            }));
          },
        },
      ],
    });
    const { POST } = await import(pathToFileURL(join(dir, "route.mjs")));
    const call = (
      body,
      headers = { Authorization: "Bearer " + "x".repeat(32) },
    ) =>
      POST(
        new NextRequest(
          "https://portal.example/api/internal/displayr/provisioning",
          { method: "POST", headers, body: JSON.stringify(body) },
        ),
      );
    const body = {
      operation: "transition",
      userId: "u",
      leaseId: "12345678-1234-1234-1234-123456789012",
      stage: "ready",
    };
    assert.equal((await call(body, {})).status, 401);
    assert.equal(
      (
        await call(body, {
          Authorization: "Bearer " + "x".repeat(32),
          Origin: "https://portal.example",
        })
      ).status,
      401,
    );
    f.enabled = false;
    assert.equal((await call(body)).status, 503);
    f.enabled = true;
    const saved = f.row;
    f.row = null;
    assert.equal((await call(body)).status, 409);
    f.row = saved;
    f.eligible = false;
    assert.equal((await call(body)).status, 409);
    f.eligible = true;
    assert.deepEqual(await (await call(body)).json(), { accepted: false });
    assert.equal(f.calls.length, 0);
    f.state.viewer_key = createHash("sha256").update(f.row.email).digest("hex");
    assert.deepEqual(await (await call(body)).json(), { accepted: true });
    assert.equal(f.calls.length, 1);
    f.state.revision = "old";
    assert.deepEqual(await (await call(body)).json(), { accepted: false });
    assert.equal(f.calls.length, 1);
    assert.equal(
      (
        await call({
          ...body,
          operation: "identity",
          displayrUserId: "not-an-id",
        })
      ).status,
      400,
    );
    f.eligible = false;
    assert.equal((await call({ ...body, operation: "release" })).status, 200);
  } finally {
    if (previous === undefined)
      delete process.env.DISPLAYR_PERMISSION_SYNC_SECRET;
    else process.env.DISPLAYR_PERMISSION_SYNC_SECRET = previous;
    delete globalThis.__provisionRoute;
    await rm(dir, { recursive: true, force: true });
  }
});
