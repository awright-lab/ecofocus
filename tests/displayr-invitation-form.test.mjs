import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '../services/displayr-gateway/node_modules/playwright/index.mjs';
import { groupsForAssignedDashboards } from '../tools/displayr-dashboard-groups.mjs';
import { prepareDisplayrInvitation } from '../tools/displayr-invitation-form.mjs';

test('prepares only verified groups, preserves hidden fields, and never submits', async () => {
 const browser = await chromium.launch({headless:true,executablePath:process.env.TEST_CHROME_PATH,args:['--no-sandbox']});
 try {
  const page = await browser.newPage(); let posts = 0;
  await page.route('https://app.displayr.com/**', async route => {
   if (route.request().method() !== 'GET') { posts++; return route.abort(); }
   await route.fulfill({contentType:'text/html',body:`<form method="POST" action="/User/AjaxNewUser">
    <input id="txtCompanyID" name="company_id" type="hidden" value="984256">
    <input id="txtDuplicatesOK" name="duplicates_ok" type="hidden" value="false">
    <input id="cboUserType" name="cboUserType" type="hidden" value="preserved-default">
    <input name="csrf" type="hidden" value="secret-token">
    <input id="txtName" name="txtName" type="text"><input id="txtEmail" name="txtEmail" type="email">
    <textarea id="txtNotes" name="txtNotes"></textarea>
    <select multiple id="cboGroupMembershipSelect" name="cboGroupMembership">
     <option value="2954016">2024 Dashboard</option><option value="99999">Additional fixture dashboard</option><option selected value="2886364">Administrators</option>
    </select><input type="submit" value="Save"></form>`});
  });
  await page.goto('https://app.displayr.com/User?company_id=984256');
  const input = {companyId:'984256',fullName:'Test Viewer',email:`displayr-provisioning+${'a'.repeat(32)}@ecofocusworldwide.com`,groups:[{id:'2954016',label:'2024 Dashboard',viewOnlyVerified:true,dashboardAccessVerified:true}]};
  await assert.rejects(prepareDisplayrInvitation(page,{...input,groups:[{...input.groups[0],viewOnlyVerified:false}]}));
  assert.equal(await page.locator('#txtEmail').inputValue(),'');
  await assert.rejects(prepareDisplayrInvitation(page,{...input,companyId:'123'}));
  await assert.rejects(prepareDisplayrInvitation(page,{...input,groups:[{...input.groups[0],id:'2886364',label:'Administrators'}]}));
  const draft = await prepareDisplayrInvitation(page,input);
  assert.equal(draft.submitted,false);
  assert.equal(await page.locator('#txtEmail').inputValue(),input.email);
  assert.deepEqual(await page.locator('select').evaluate(el=>[...el.selectedOptions].map(o=>o.value)),['2954016']);
  const multiple = await prepareDisplayrInvitation(page,{...input,groups:[...input.groups,{id:'99999',label:'Additional fixture dashboard',viewOnlyVerified:true,dashboardAccessVerified:true}]});
  assert.equal(multiple.groups.length,2);
  assert.deepEqual(await page.locator('select').evaluate(el=>[...el.selectedOptions].map(o=>o.value)),['2954016','99999']);
  await prepareDisplayrInvitation(page,input);
  assert.deepEqual(await page.locator('select').evaluate(el=>[...el.selectedOptions].map(o=>o.value)),['2954016']);
  assert.equal(await page.locator('#cboUserType').inputValue(),'preserved-default');
  assert.equal(await page.locator('[name=csrf]').inputValue(),'secret-token');
  assert.ok(!JSON.stringify(draft).includes('secret-token'));
  await page.locator('form').evaluate(el=>el.action='/Wrong');
  await assert.rejects(prepareDisplayrInvitation(page,input));
  assert.equal(posts,0);
 } finally { await browser.close(); }
});

test('workspace assignments require verified mappings and deduplicate groups', () => {
 const groups = groupsForAssignedDashboards(['interactive-dashboard-2024','interactive-dashboard-2024']);
 assert.equal(groups.length,1); assert.equal(groups[0].id,'2954016');
 assert.equal(groups[0].viewOnlyVerified,true);
 assert.throws(()=>groupsForAssignedDashboards(['interactive-dashboard-2025']));
 assert.throws(()=>groupsForAssignedDashboards(['constructor']));
 assert.throws(()=>groupsForAssignedDashboards([]));
 groups[0].id='modified';
 assert.equal(groupsForAssignedDashboards(['interactive-dashboard-2024'])[0].id,'2954016');
});
