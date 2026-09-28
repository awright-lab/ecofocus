import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { NextRequest } from "next/server.js";
test("worker endpoint rejects browser calls and never verifies a stale plan", async () => {
  const dir = await mkdtemp(join(tmpdir(), "displayr-sync-route-"));
  const old = process.env.DISPLAYR_PERMISSION_SYNC_SECRET;
  process.env.DISPLAYR_PERMISSION_SYNC_SECRET = "x".repeat(32);
  const fixture = (globalThis.__permissionRoute = {
    revision: "b".repeat(64),
    writes: [],
    db: {
      rpc: async (name, args) => {
        fixture.writes.push({ name, args });
        return { data: true };
      },
    },
  });
  try {
    await build({
      entryPoints: ["app/api/internal/displayr/permissions/route.ts"],
      outfile: join(dir, "route.mjs"),
      bundle: true,
      platform: "node",
      format: "esm",
      plugins: [
        {
          name: "adapters",
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
                  /^@\/lib\/(supabase\/server|portal\/displayr-permission-store)$/,
              },
              (a) => ({ path: a.path, namespace: "fixture" }),
            );
            b.onLoad({ filter: /.*/, namespace: "fixture" }, (a) => ({
              contents: a.path.includes("supabase")
                ? "export const getServiceSupabase=()=>globalThis.__permissionRoute.db;"
                : "export const getDisplayrPermissionPlan=async()=>({revision:globalThis.__permissionRoute.revision,blocked:false});",
            }));
          },
        },
      ],
    });
    const { POST } = await import(pathToFileURL(join(dir, "route.mjs")));
    const body = {
      operation: "complete",
      userId: "u",
      revision: "a".repeat(64),
      leaseId: "12345678-1234-1234-1234-123456789012",
      verified: true,
    };
    const req = (headers) =>
      new NextRequest(
        "https://portal.ecofocusresearch.com/api/internal/displayr/permissions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify(body),
        },
      );
    assert.equal((await POST(req({}))).status, 401);
    assert.equal(
      (
        await POST(
          req({
            Authorization: "Bearer " + "x".repeat(32),
            Origin: "https://portal.ecofocusresearch.com",
          }),
        )
      ).status,
      401,
    );
    assert.equal(fixture.writes.length, 0);
    assert.equal(
      (await POST(req({ Authorization: "Bearer " + "x".repeat(32) }))).status,
      200,
    );
    assert.equal(fixture.writes[0].args.p_status, "pending");
    assert.equal(fixture.writes[0].args.p_reason, "assignments_changed");
    fixture.revision = body.revision;
    await POST(req({ Authorization: "Bearer " + "x".repeat(32) }));
    assert.equal(fixture.writes[1].args.p_status, "verified");
  } finally {
    if (old === undefined) delete process.env.DISPLAYR_PERMISSION_SYNC_SECRET;
    else process.env.DISPLAYR_PERMISSION_SYNC_SECRET = old;
    delete globalThis.__permissionRoute;
    await rm(dir, { recursive: true, force: true });
  }
});

test("admin mapping changes require an actual admin session, same origin and restricted groups", async () => {
  const dir = await mkdtemp(join(tmpdir(), "displayr-admin-route-"));
  const fixture = (globalThis.__permissionAdmin = {
    access: null,
    saved: [],
    db: {
      from() {
        const q = {
          select() {
            return q;
          },
          eq() {
            return q;
          },
          async maybeSingle() {
            return {
              data: {
                displayr_embed_url:
                  "https://app.displayr.com/Dashboard?project_id=123",
              },
            };
          },
          async upsert(row) {
            fixture.saved.push(row);
            return {};
          },
        };
        return q;
      },
    },
  });
  try {
    await build({
      entryPoints: ["app/api/portal/admin/displayr/permissions/route.ts"],
      outfile: join(dir, "admin.mjs"),
      bundle: true,
      platform: "node",
      format: "esm",
      plugins: [
        {
          name: "adapters",
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
                  /^@\/lib\/(supabase\/server|portal\/(auth|admin-audit))$/,
              },
              (a) => ({ path: a.path, namespace: "fixture" }),
            );
            b.onLoad({ filter: /.*/, namespace: "fixture" }, (a) => ({
              contents: a.path.includes("supabase")
                ? "export const getServiceSupabase=()=>globalThis.__permissionAdmin.db;"
                : a.path.endsWith("auth")
                  ? "export const getPortalAccessContext=async()=>globalThis.__permissionAdmin.access;"
                  : "export const logPortalAdminAuditEvent=async()=>{};",
            }));
          },
        },
      ],
    });
    const { POST } = await import(pathToFileURL(join(dir, "admin.mjs")));
    const body = {
      companyId: "a",
      dashboardSlug: "report",
      projectId: "123",
      groupIds: ["7"],
      viewOnlyConfirmed: true,
    };
    const call = (
      input = body,
      origin = "https://portal.ecofocusresearch.com",
    ) =>
      POST(
        new NextRequest(
          "https://portal.ecofocusresearch.com/api/portal/admin/displayr/permissions",
          {
            method: "POST",
            headers: { origin, "Content-Type": "application/json" },
            body: JSON.stringify(input),
          },
        ),
      );
    assert.equal((await call()).status, 403);
    fixture.access = {
      session: { id: "s" },
      user: { id: "admin", role: "client_admin" },
      isPreviewMode: false,
    };
    assert.equal((await call()).status, 403);
    fixture.access.user.role = "support_admin";
    fixture.access.isPreviewMode = true;
    assert.equal((await call()).status, 403);
    fixture.access.isPreviewMode = false;
    assert.equal((await call(body, "https://attacker.example")).status, 403);
    assert.equal(
      (await call({ ...body, viewOnlyConfirmed: false })).status,
      400,
    );
    assert.equal((await call({ ...body, groupIds: ["2886364"] })).status, 400);
    assert.equal((await call({ ...body, projectId: "456" })).status, 400);
    assert.equal(fixture.saved.length, 0);
    assert.equal((await call()).status, 200);
    assert.equal(fixture.saved.length, 1);
    assert.equal(fixture.saved[0].verified_by, "admin");
  } finally {
    delete globalThis.__permissionAdmin;
    await rm(dir, { recursive: true, force: true });
  }
});
