import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '../services/displayr-gateway/node_modules/playwright/index.mjs';
import { inspectActivationForm } from '../tools/displayr-activation-inspect.mjs';
test('inspects a synthetic activation page without scripts, writes, or token disclosure', async()=>{
 const link = new URL('https://app.displayr.com/SignUp/ConfirmEmail');
 for(const k of ['iid','lid','sid'])link.searchParams.set(k,'11111111-2222-4333-8444-555555555555');
 link.searchParams.set('signed_up_by_company_admin','True');link.searchParams.set('redir','/MyReports?company_id=123');
 let closed=false;let scriptEnabled;let writes=0;
 const wrapped={launch:async options=>{
  const browser=await chromium.launch({...options,args:['--no-sandbox']});
  return {close:async()=>{closed=true;await browser.close();},newContext:async options=>{
   scriptEnabled=options.javaScriptEnabled;
   const context=await browser.newContext(options);
   const route=context.route.bind(context);
   context.route=async(pattern,handler)=>{
    await route(pattern,async r=>{
     if(r.request().method()!=='GET')writes++;
     await r.fulfill({contentType:'text/html',body:'<form method="post" action="/SignUp/Activate?sid=secret"><input type="hidden" name="token" value="private-value"><input type="password" name="Password" id="Password"><button>Activate</button></form><script>document.forms[0].submit()</script>'});
    });
    await route(pattern,async r=>handler({request:()=>r.request(),abort:()=>r.abort(),continue:()=>r.fallback()}));
   };return context;
  }};
 }};
 const result=await inspectActivationForm({chromium:wrapped,link:link.href,companyId:'123',executablePath:process.env.TEST_CHROME_PATH});
 assert.equal(result.formAvailable,true);assert.equal(result.submitted,false);assert.equal(closed,true);assert.equal(scriptEnabled,false);assert.equal(writes,0);
 assert.equal(result.forms[0].actionPath,'/SignUp/Activate');
 assert.ok(!JSON.stringify(result).includes('secret'));assert.ok(!JSON.stringify(result).includes('private-value'));assert.ok(!JSON.stringify(result).includes('11111111'));
});
