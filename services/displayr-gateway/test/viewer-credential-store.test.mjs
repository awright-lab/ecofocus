import {test} from 'node:test';
import assert from 'node:assert/strict';
import {encryptViewerCredential,decryptViewerCredential,installViewerCredentials} from '../viewer-credential-store.mjs';
test('credentials are authenticated, bound to one portal user, and never stored in plaintext',()=>{
 const key='ab'.repeat(32),credential={email:'viewer@example.org',password:'long-random-test-password'};
 const sealed=encryptViewerCredential('u',credential,key);
 assert.deepEqual(decryptViewerCredential('u',sealed,key),credential);
 assert(!sealed.includes(credential.password));assert(!sealed.includes(credential.email));
 assert.throws(()=>decryptViewerCredential('other-user',sealed,key));
 assert.throws(()=>decryptViewerCredential('u',sealed,'cd'.repeat(32)));
 const fields=sealed.split('.');fields[3]='A'+fields[3].slice(1);
 assert.throws(()=>decryptViewerCredential('u',fields.join('.'),key));
});
test('runtime installation adds viewers without restart, invalidates rotated/deleted sessions, and preserves legacy users',()=>{
 const viewers=new Map([['legacy',{email:'legacy@example.org',password:'unchanged'}]]),viewerIds={},managedIds=new Set(),invalidated=[];
 const input={viewers,viewerIds,managedIds,broker:{invalidate:id=>invalidated.push(id)}};
 const record={userId:'new',email:'new@example.org',password:'generated-password',displayrUserId:'123'};
 installViewerCredentials({...input,records:[record]});assert(viewers.has('new'));assert.equal(viewerIds.new,'123');
 invalidated.length=0;installViewerCredentials({...input,records:[record]});assert.deepEqual(invalidated,[]);
 installViewerCredentials({...input,records:[{...record,password:'rotated-password'}]});assert.deepEqual(invalidated,['new']);
 installViewerCredentials({...input,records:[]});assert(!viewers.has('new'));assert(viewers.has('legacy'));
});
test('invalid snapshots and legacy collisions cause no partial credential changes',()=>{
 const viewers=new Map([['legacy',{email:'legacy@example.org',password:'unchanged'}]]),viewerIds={},managedIds=new Set();
 const input={viewers,viewerIds,managedIds,broker:{invalidate:()=>assert.fail('must not mutate')}};
 const first={userId:'new',email:'new@example.org',password:'generated-password',displayrUserId:'123'};
 for(const second of [{...first,userId:'other'},{...first,userId:'legacy'},{...first,userId:'other',email:'legacy@example.org'}])assert.throws(()=>installViewerCredentials({...input,records:[first,second]}));
 assert.equal(viewers.size,1);assert.equal(managedIds.size,0);
});
