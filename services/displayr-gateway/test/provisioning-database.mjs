import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const db = new PGlite();
await db.exec(
  "create role anon;create role authenticated;create role service_role;",
);
await db.exec(
  await readFile(
    new URL("../../../supabase/migrations/20260929192356_displayr_automatic_provisioning.sql", import.meta.url),
    "utf8",
  ),
);
await db.exec(
  "insert into portal_displayr_provisioning(user_id,email,credential_ciphertext) values('u','fixture@example.org','encrypted-fixture')",
);
const claim = async () =>
  (await db.query("select portal_displayr_claim_provisioning('u') as result"))
    .rows[0].result;
const lease = await claim();
assert(lease);
assert.equal(await claim(), null);
const rpc = async (sql, values = []) =>
  (await db.query(sql, values)).rows[0].result;
assert.equal(
  await rpc(
    "select portal_displayr_advance_provisioning('u',$1,'queued','ready',null) as result",
    [lease],
  ),
  false,
);
assert.equal(
  await rpc(
    "select portal_displayr_advance_provisioning('u',$1,'queued','invitation_pending',null) as result",
    [lease],
  ),
  true,
);
assert.equal(
  await rpc(
    "select portal_displayr_provisioning_permit('u',$1,'invite') as result",
    [lease],
  ),
  true,
);
assert.equal(
  await rpc(
    "select portal_displayr_provisioning_permit('u',$1,'invite') as result",
    [lease],
  ),
  false,
);
await db.exec(
  "update portal_displayr_provisioning set lease_until=now()-interval '1 second'",
);
assert.equal(
  await rpc(
    "select portal_displayr_advance_provisioning('u',$1,'invitation_pending','activation_pending',null) as result",
    [lease],
  ),
  false,
);
const newer = await claim();
assert(newer);
assert.notEqual(newer, lease);
assert.equal(
  await rpc("select portal_displayr_release_provisioning('u',$1) as result", [
    lease,
  ]),
  false,
);
assert.equal(
  await rpc(
    "select portal_displayr_provisioning_permit('u',$1,'invite') as result",
    [newer],
  ),
  false,
);
assert.equal(
  await rpc(
    "select portal_displayr_advance_provisioning('u',$1,'invitation_pending','activation_pending',null) as result",
    [newer],
  ),
  true,
);
assert.equal(
  await rpc(
    "select portal_displayr_advance_provisioning('u',$1,'activation_pending','credentials_verified',null) as result",
    [newer],
  ),
  false,
);
assert.equal(
  await rpc(
    "select portal_displayr_provisioning_identity('u',$1,'123') as result",
    [newer],
  ),
  true,
);
assert.equal(
  await rpc(
    "select portal_displayr_provisioning_identity('u',$1,'456') as result",
    [newer],
  ),
  false,
);
assert.equal(
  await rpc(
    "select portal_displayr_advance_provisioning('u',$1,'activation_pending','credentials_verified',null) as result",
    [newer],
  ),
  true,
);
await db.exec("set role anon");
await assert.rejects(db.query("select * from portal_displayr_provisioning"));
await assert.rejects(
  db.query("select portal_displayr_claim_provisioning('u')"),
);
await db.exec("reset role");
await db.close();
console.log(
  "Provisioning leases, permits, identity fences and browser denial passed",
);
