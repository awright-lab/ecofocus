import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const db = new PGlite();
await db.exec(`create role anon;create role authenticated;create role service_role;
create table portal_users(id text primary key,status text,company_id text);
create table portal_companies(id text primary key,subscription_id text);
create table portal_subscriptions(id text primary key,status text);
create table portal_dashboard_entitlements(company_id text,dashboard_id text,assigned_by_user_id text,unique(company_id,dashboard_id));
create table portal_dashboards(id text primary key,slug text unique,is_hidden bool);
create table portal_dashboard_configs(company_id text,dashboard_slug text,displayr_embed_url text,is_active bool,is_hidden bool,notes text,updated_at timestamptz,unique(company_id,dashboard_slug));
create table portal_workspace_memberships(user_id text,workspace_company_id text,visibility_scope text);
insert into portal_users values('u','active','a');
insert into portal_companies values('a','s'),('b','s');insert into portal_subscriptions values('s','active');
insert into portal_dashboards values('d','report',false);
insert into portal_workspace_memberships values('u','b','full');`);
await db.exec(
  await readFile(
    new URL("../../../docs/portal_displayr_permissions.sql", import.meta.url),
    "utf8",
  ),
);
const snapshot = async () =>
  (await db.query("select portal_displayr_permission_snapshot('u') as result"))
    .rows[0].result;
const save = async (company, active = true) =>
  db.query(
    "select portal_save_dashboard_assignment($1,'report','https://app.displayr.com/Dashboard?project_id=123',$2,false,null,'u')",
    [company, active],
  );
await save("a");
await save("b");
assert.equal((await snapshot()).assignments.length, 2);
await save("a", false);
assert.equal((await snapshot()).assignments.length, 1);
await db.exec("delete from portal_workspace_memberships");
assert.equal((await snapshot()).assignments.length, 0);
await save("a");
await db.exec("update portal_users set status='inactive'");
assert.equal((await snapshot()).assignments.length, 0);
await db.exec(
  "update portal_users set status='active';update portal_subscriptions set status='past_due'",
);
assert.equal((await snapshot()).assignments.length, 0);
await db.exec("update portal_subscriptions set status='active'");
const claim = async (rev) =>
  (
    await db.query("select portal_displayr_claim_permissions('u',$1) as id", [
      rev,
    ])
  ).rows[0].id;
const lease = await claim("revision1");
assert(lease);
assert.equal(await claim("revision2"), null);
let result = await db.query(
  "select portal_displayr_finish_permissions('u','revision2',$1,'verified',null) as ok",
  [lease],
);
assert.equal(result.rows[0].ok, false);
result = await db.query(
  "select portal_displayr_finish_permissions('u','revision1',$1,'verified',null) as ok",
  [lease],
);
assert.equal(result.rows[0].ok, true);
assert.equal(await claim("revision1"), null);
assert(await claim("revision2"));
await db.exec("delete from portal_users where id='u'");
assert.equal((await snapshot()).assignments.length, 0);
for (const role of ["anon", "authenticated"]) {
  await db.exec(`set role ${role}`);
  await assert.rejects(
    db.query("select portal_displayr_permission_snapshot('u')"),
    /permission denied/,
  );
  await assert.rejects(
    db.query("select * from portal_displayr_bindings"),
    /permission denied/,
  );
  await assert.rejects(
    db.query("select portal_displayr_claim_permissions('u','rev')"),
    /permission denied/,
  );
  await db.exec("reset role");
}
await db.close();
console.log(
  "Permission database checks passed: atomic assignments, membership/subscription revocation, deletion cleanup, lease fencing, browser-role denial.",
);
