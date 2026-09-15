import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { chromium } from '../services/displayr-gateway/node_modules/playwright/index.mjs';
import { NextRequest } from 'next/server.js';
import { recoveryRedirectScript } from '../lib/portal/recovery-redirect.ts';

test('homepage recovery fragments move only to fixed portal destination and are scrubbed first',()=>{
 const events=[];
 const window={location:{hostname:'ecofocusresearch.com',pathname:'/',search:'',hash:'#type=recovery&access_token=synthetic&refresh_token=synthetic-refresh',replace:url=>events.push(['redirect',url])},history:{replaceState:(_,__,url)=>events.push(['clean',url])}};
 vm.runInNewContext(recoveryRedirectScript,{window,URL,URLSearchParams});
 assert.equal(events[0][0],'clean');assert.equal(new URL(events[1][1]).origin,'https://portal.ecofocusresearch.com');
 assert.equal(new URL(events[1][1]).pathname,'/reset-password');
 events.length=0;window.location.hash='#ordinary';vm.runInNewContext(recoveryRedirectScript,{window,URL,URLSearchParams});assert.equal(events.length,0);
});

test('reset request uses Supabase delivery, canonical redirect, and never exposes a link',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'recovery-route-'));globalThis.__resetFixture={error:null,calls:[]};
 try{
  await build({entryPoints:['app/api/portal/password-reset/request/route.ts'],outfile:join(dir,'route.mjs'),bundle:true,format:'esm',platform:'node',plugins:[{name:'fixture',setup(b){
   b.onResolve({filter:/^next\/server$/},()=>({path:import.meta.resolve('next/server.js').replace('file://',''),external:true}));
   b.onResolve({filter:/^@\/lib\/supabase\/server$/},()=>({path:'server',namespace:'fixture'}));
   b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export const getInviteSupabase=()=>({auth:{resetPasswordForEmail:async(...args)=>{globalThis.__resetFixture.calls.push(args);return {error:globalThis.__resetFixture.error};}}});'}));
  }}]});
  const {POST}=await import(pathToFileURL(join(dir,'route.mjs')));
  const req=email=>new NextRequest('http://internal.netlify/api/portal/password-reset/request',{method:'POST',body:JSON.stringify({email})});
  assert.equal((await POST(req('bad'))).status,400);
  const response=await POST(req('TEST@example.com'));assert.deepEqual(await response.json(),{ok:true});
  assert.equal(globalThis.__resetFixture.calls[0][0],'test@example.com');
  assert.equal(globalThis.__resetFixture.calls[0][1].redirectTo,'https://portal.ecofocusresearch.com/reset-password');
  globalThis.__resetFixture.error={status:429,code:'over_email_send_rate_limit'};
  const failure=await POST(req('test@example.com'));assert.equal(failure.status,503);assert.ok(!(await failure.text()).includes('resetUrl'));
 }finally{delete globalThis.__resetFixture;await rm(dir,{recursive:true,force:true});}
});

test('Supabase recovery enables password update once, scrubs fragment, and rejects invalid sessions',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'recovery-browser-'));let browser,server;
 try{
  await build({stdin:{contents:'import React from "react";import {createRoot} from "react-dom/client";import {ResetPasswordHandler} from "./components/portal/ResetPasswordHandler";createRoot(document.getElementById("root")).render(<React.StrictMode><ResetPasswordHandler/></React.StrictMode>);',loader:'tsx',resolveDir:process.cwd()},outfile:join(dir,'client.js'),bundle:true,platform:'browser',jsx:'automatic',plugins:[{name:'fixture',setup(b){
   b.onResolve({filter:/^@\/lib\/supabase\/client$/},()=>({path:'client',namespace:'fixture'}));
   b.onResolve({filter:/^next\/navigation$/},()=>({path:'navigation',namespace:'fixture'}));
   b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='navigation'?'export const useRouter=()=>({push:path=>window.__destination=path});':`export const getBrowserSupabase=()=>({auth:{setSession:async()=>{window.__calls=(window.__calls||0)+1;return {error:window.__invalid?new Error('invalid'):null};},updateUser:async()=>{window.__updated=true;return {error:null};},signOut:async()=>({error:null})}});`}));
  }}]});
  const js=await readFile(join(dir,'client.js'));
  server=createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/client.js'?'application/javascript':'text/html');res.end(req.url==='/client.js'?js:'<div id="root"></div><script src="/client.js"></script>');});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  browser=await chromium.launch({headless:true,executablePath:process.env.TEST_CHROME_PATH,args:['--no-sandbox']});
  for(const invalid of [false,true]){
   const page=await browser.newPage();await page.addInitScript(value=>window.__invalid=value,invalid);
   await page.goto(`http://127.0.0.1:${server.address().port}/reset-password#type=recovery&access_token=synthetic&refresh_token=synthetic-refresh`);
   if(invalid){await page.getByRole('alert').waitFor();assert.equal(await page.locator('input[type=password]').count(),0);}
   else {await page.locator('#password').fill('Synthetic-pass-123!');await page.locator('#confirmPassword').fill('Synthetic-pass-123!');await page.getByRole('button').click();await page.waitForFunction(()=>window.__updated===true);assert.equal(await page.evaluate(()=>window.__calls),1);}
   assert.equal(new URL(page.url()).hash,'');await page.close();
  }
 }finally{await browser?.close();if(server)await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
