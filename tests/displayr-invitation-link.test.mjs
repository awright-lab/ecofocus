import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspectDisplayrInvitationLink } from '../lib/portal/displayr-invitation-link.ts';
const company = '123';
function fixture() {
 const url = new URL('https://app.displayr.com/SignUp/ConfirmEmail');
 for (const key of ['iid','lid','sid','ajs_aid']) url.searchParams.set(key,'11111111-2222-4333-8444-555555555555');
 url.searchParams.set('firstname','Synthetic Test');
 url.searchParams.set('signed_up_by_company_admin','True');
 url.searchParams.set('redir','/MyReports?company_id=123');
 return url;
}
test('returns only structural metadata and makes no activation claim',()=>{
 const report=inspectDisplayrInvitationLink(fixture().href,company);
 assert.equal(report.companyId,company);assert.equal(report.recipientVerified,false);assert.equal(report.activated,false);
 assert.ok(!JSON.stringify(report).includes('11111111'));assert.ok(!JSON.stringify(report).includes('Synthetic'));
});
test('rejects alternate destinations, duplicate parameters, missing tokens and company mismatches',()=>{
 const mutations=[
  u=>u.hostname='attacker.example',u=>u.protocol='http:',u=>u.port='8443',u=>u.username='user',
  u=>u.pathname='/Login',u=>u.hash='secret',u=>u.searchParams.append('iid','another'),
  u=>u.searchParams.delete('lid'),u=>u.searchParams.set('sid','malformed'),
  u=>u.searchParams.set('next','https://attacker.example'),u=>u.searchParams.set('signed_up_by_company_admin','False'),
  u=>u.searchParams.set('redir','https://app.displayr.com/MyReports?company_id=123'),
  u=>u.searchParams.set('redir','//attacker.example'),u=>u.searchParams.set('redir','/MyReports?company_id=999'),
  u=>u.searchParams.set('redir','/MyReports?company_id=123&next=other'),
 ];
 for(const mutate of mutations){const u=fixture();mutate(u);assert.throws(()=>inspectDisplayrInvitationLink(u.href,company),{message:'Invalid Displayr invitation link'});}
 assert.throws(()=>inspectDisplayrInvitationLink(fixture().href,'999'));
 assert.throws(()=>inspectDisplayrInvitationLink('not a URL',company),{message:'Invalid Displayr invitation link'});
});
