import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('mailbox storage denies browser roles and consumes session-bound state once', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    await db.exec(await readFile(new URL('../../../docs/portal_displayr_mailbox.sql', import.meta.url), 'utf8'));
    for (const role of ['anon', 'authenticated']) {
      await db.exec('set role ' + role);
      for (const table of ['portal_displayr_mailbox_connection', 'portal_displayr_mailbox_oauth_states']) {
        await assert.rejects(db.query('select * from ' + table), /permission denied/);
        await assert.rejects(db.query('delete from ' + table), /permission denied/);
      }
      await db.exec('reset role');
    }
    await db.exec('set role service_role');
    const user = '00000000-0000-0000-0000-000000000001', session = '00000000-0000-0000-0000-000000000002';
    const insert = () => db.query(`insert into portal_displayr_mailbox_oauth_states values ($1,'hash',$2,'ciphertext',now()+interval '10 minutes')`, [user, session]);
    const consume = (u = user, s = session, hash = 'hash') => db.query(`delete from portal_displayr_mailbox_oauth_states where auth_user_id=$1 and portal_session_id=$2 and state_hash=$3 and expires_at>now() returning verifier_ciphertext`, [u, s, hash]);
    await insert();
    assert.equal((await consume(session, session)).rows.length, 0);
    assert.equal((await consume(user, user)).rows.length, 0);
    assert.equal((await consume(user, session, 'wrong')).rows.length, 0);
    assert.equal((await consume()).rows.length, 1);
    assert.equal((await consume()).rows.length, 0);
    await insert();
    await db.exec("update portal_displayr_mailbox_oauth_states set expires_at=now()-interval '1 minute'");
    assert.equal((await consume()).rows.length, 0);
    await assert.rejects(db.query(`insert into portal_displayr_mailbox_connection values ('other@example.com','ciphertext',$1,now(),'https://www.googleapis.com/auth/gmail.readonly')`, [user]), /check constraint/);
  } finally { await db.close(); }
});
