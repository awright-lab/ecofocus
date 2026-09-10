import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create role service_role;
create schema auth;
create table auth.users(id uuid, email text, deleted_at timestamptz, banned_until timestamptz);
create table auth.sessions(id uuid, user_id uuid, not_after timestamptz);
create table public.portal_users(id text,email text,status text,company_id text);
create table public.portal_companies(id text,subscription_id text);
create table public.portal_subscriptions(id text,status text);
create table public.portal_dashboard_entitlements(company_id text,dashboard_id text);
create table public.portal_dashboards(id text,slug text,is_hidden bool);
create table public.portal_dashboard_configs(company_id text,dashboard_slug text,displayr_embed_url text,is_active bool,is_hidden bool);
create table public.portal_workspace_memberships(user_id text,workspace_company_id text,visibility_scope text);
insert into auth.users values('00000000-0000-0000-0000-000000000001','pilot@example.org',null,null);
insert into auth.sessions values('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001',null);
insert into portal_users values('pilot','pilot@example.org','active','company');
insert into portal_companies values('company','subscription');
insert into portal_subscriptions values('subscription','active');
insert into portal_dashboard_entitlements values('company','dashboard');
insert into portal_dashboards values('dashboard','report',false);
insert into portal_dashboard_configs values('company','report','https://app.displayr.com/Dashboard?project_id=123',true,false);`);
await db.exec(await readFile(new URL('../../../docs/portal_displayr_gateway.sql', import.meta.url),'utf8'));
const call = `select public.portal_displayr_gateway_access('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','company','report') as result`;
async function check(allowed) { await db.exec('set role service_role'); try {const r=await db.query(call); assert.equal(Boolean(r.rows[0].result),allowed);} finally{await db.exec('reset role');} }
await check(true);
for(const [deny,restore] of [
 ["update portal_users set status='inactive'","update portal_users set status='active'"],
 ["update portal_users set company_id='other'","update portal_users set company_id='company'"],
 ["update portal_subscriptions set status='past_due'","update portal_subscriptions set status='active'"],
 ["update portal_dashboards set is_hidden=true","update portal_dashboards set is_hidden=false"],
 ["update portal_dashboard_configs set is_active=false","update portal_dashboard_configs set is_active=true"],
 ["update portal_dashboard_entitlements set company_id='other'","update portal_dashboard_entitlements set company_id='company'"],
 ["update auth.sessions set not_after=now()-interval '1 hour'","update auth.sessions set not_after=null"],
 ["update auth.users set banned_until=now()+interval '1 hour'","update auth.users set banned_until=null"]
]) { await db.exec(deny); await check(false); await db.exec(restore); await check(true); }
for (const role of ['anon','authenticated']) {await db.exec('set role '+role);await assert.rejects(db.query(call),/permission denied/);await db.exec('reset role');}
await db.exec('delete from auth.sessions');await check(false);
await db.close();console.log('SQL access checks passed: authorized access, 8 denial/restore cases, restricted roles, logout.');
