import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '../services/displayr-gateway/node_modules/playwright/index.mjs';
import { inspectNewUserForm, inspectionRequestGuard } from '../tools/displayr-admin-inspect.mjs';

test('inspects the supplied company form without submitting or exposing field values',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.TEST_CHROME_PATH,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();let posts=0;
  await page.route('https://app.displayr.com/**',async route=>{
   if(route.request().method()!=='GET'){posts++;return route.abort();}
   await route.fulfill({contentType:'text/html',body:`<form method="post" action="/User?company_id=123"><input type="hidden" name="csrf" value="secret-token"><input name="FullName" value="private-name"><input name="Email" value="private@example.com"><textarea name="Notes">private notes</textarea><select name="Groups" multiple><option value="viewer">Viewers</option><option value="admin">Administrators</option></select><button>Save</button></form>`});
  });
  const result=await inspectNewUserForm(page,'123');
  assert.equal(result.newUserFormAvailable,true);assert.equal(result.forms[0].method,'POST');assert.equal(result.forms[0].actionPath,'/User');assert.deepEqual(result.forms[0].actionParameterNames,['company_id']);
  assert.deepEqual(result.forms[0].fields.find(f=>f.name==='Groups').options,[{value:'viewer',label:'Viewers'},{value:'admin',label:'Administrators'}]);
  assert.ok(!JSON.stringify(result).includes('secret-token'));assert.ok(!JSON.stringify(result).includes('private'));assert.equal(posts,0);
  const allowed=inspectionRequestGuard();assert.equal(allowed({url:()=>page.url(),method:()=> 'POST',isNavigationRequest:()=>true}),false);
  await assert.rejects(inspectNewUserForm(page,'123&user_id=1'),/company ID/);
 }finally{await browser.close();}
});
