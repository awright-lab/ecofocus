import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceProvisioning } from '../provisioning-workflow.mjs';
function fixture(stage='queued') {
 const job={userId:'u',leaseId:'lease',stage,createdAt:'2026-09-29T00:00:00Z'};
 const saved={email:'viewer@example.org',password:'never-log-this'};
 const events=[]; const permits=new Set();
 const f={job,events,allowed:true,lease:true,login:true,account:'absent',invitation:'verified',synced:true};
 f.effects={
  store:{ensureCredentials:async()=>{events.push('save-credentials');return saved;},credentials:async()=>saved,
   transition:async(_,next)=>{if(!f.lease)return false;events.push(next.stage);Object.assign(job,next);return true;},
   consumePermit:async(_,operation)=>{if(!f.lease||permits.has(operation))return false;permits.add(operation);events.push('permit-'+operation);return true;}},
  eligible:async()=>f.allowed,
  inspectAccount:async()=>({status:f.account}),
  invite:async()=>{events.push('invite');},
  findInvitation:async()=>({status:f.invitation,link:'private-activation-url'}),
  activate:async()=>{events.push('activate');},
  verifyLogin:async()=>f.login,
  synchronize:async()=>{events.push('sync-current-assignments');return {verified:f.synced};},
 };
 return f;
}
test('persists credentials before invitation and verifies activation and permissions before ready',async()=>{
 const f=fixture();
 assert.equal((await advanceProvisioning(f.job,f.effects)).status,'waiting');
 assert.deepEqual(f.events,['save-credentials','invitation_pending','permit-invite','invite']);
 assert.deepEqual(await advanceProvisioning(f.job,f.effects),{status:'ready'});
 assert.equal(f.events.filter(x=>x==='invite').length,1);
 assert(f.events.indexOf('activate')<f.events.indexOf('sync-current-assignments'));
 assert.equal(f.events.at(-1),'ready');
});
test('lost creation response never causes another invitation on retry',async()=>{
 const f=fixture();f.effects.invite=async()=>{f.events.push('invite');throw Error('private data');};
 await advanceProvisioning(f.job,f.effects);
 f.invitation='none';await advanceProvisioning(f.job,f.effects);
 assert.equal(f.events.filter(x=>x==='invite').length,1);
 assert.equal(f.job.stage,'invitation_pending');
});
test('uncertain activation is resolved by login, never repeated',async()=>{
 const f=fixture('invitation_pending');
 f.effects.activate=async()=>{f.events.push('activate');throw Error('private data');};
 assert.equal((await advanceProvisioning(f.job,f.effects)).status,'ready');
 assert.equal(f.events.filter(x=>x==='activate').length,1);
 const restart=fixture('activation_pending');restart.login=false;
 const result=await advanceProvisioning(restart.job,restart.effects);
 assert.equal(result.reason,'activation_requires_review');
 assert(!restart.events.includes('activate'));
 assert(!JSON.stringify(result).includes('private'));
});
test('untrusted invitations, stale leases, disabled users, and mismatched existing credentials never write upstream',async()=>{
 const untrusted=fixture('invitation_pending');untrusted.invitation='ambiguous';
 assert.equal((await advanceProvisioning(untrusted.job,untrusted.effects)).reason,'invitation_not_verified');
 assert(!untrusted.events.includes('activate'));
 const stale=fixture();stale.lease=false;
 await assert.rejects(advanceProvisioning(stale.job,stale.effects));assert(!stale.events.includes('invite'));
 const disabled=fixture();disabled.allowed=false;
 assert.equal((await advanceProvisioning(disabled.job,disabled.effects)).status,'paused');assert.deepEqual(disabled.events,[]);
 const existing=fixture();existing.account='active';existing.login=false;
 assert.equal((await advanceProvisioning(existing.job,existing.effects)).reason,'existing_account_credentials');assert(!existing.events.includes('invite'));
});
test('pending permission readback never becomes ready',async()=>{
 const f=fixture('credentials_verified');f.synced=false;
 assert.equal((await advanceProvisioning(f.job,f.effects)).reason,'permissions_pending');
 assert.equal(f.job.stage,'credentials_verified');
});
