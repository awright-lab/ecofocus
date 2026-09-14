import {createServer} from 'node:http';
import {chromium} from '../services/displayr-gateway/node_modules/playwright/index.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { NextRequest } from 'next/server.js';

test('mailbox check requires public host, origin and administrator; returns no mail or tokens',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'mailbox-check-'));
  let server,browser;
  const fixture=globalThis.__mailboxCheck={admin:true,reads:0,reason:''};
  try{
    await build({entryPoints:['app/api/portal/admin/displayr/mailbox/check/route.ts'],outfile:join(dir,'route.mjs'),bundle:true,platform:'node',format:'esm',plugins:[{name:'adapters',setup(b){
      b.onResolve({filter:/^next\/server$/},()=>({path:import.meta.resolve('next/server.js').replace('file://',''),external:true}));
      b.onResolve({filter:/^@\/lib\/portal\/displayr-mailbox(?:-reader)?$/},args=>({path:args.path,namespace:'fixture'}));
      b.onLoad({filter:/.*/,namespace:'fixture'},args=>({resolveDir:process.cwd(),contents:args.path.endsWith('-reader')?`import {MailboxReadError} from ${JSON.stringify(join(process.cwd(),'lib/portal/displayr-gmail.ts'))}; export const getProvisioningMailboxReader=async()=>({checkAccess:async()=>{globalThis.__mailboxCheck.reads++;if(globalThis.__mailboxCheck.reason)throw new MailboxReadError(globalThis.__mailboxCheck.reason);return {readable:true,checkedAt:'2026-09-14T00:00:00Z'};}});`:'export const mailboxAdministrator=async()=>globalThis.__mailboxCheck.admin;'}));
    }}]});
    const {POST}=await import(pathToFileURL(join(dir,'route.mjs')));
    const request=(overrides={})=>new NextRequest('http://internal.netlify:3000/api/portal/admin/displayr/mailbox/check',{method:'POST',headers:{'x-forwarded-host':'portal.ecofocusresearch.com',origin:'https://portal.ecofocusresearch.com','content-type':'application/json',...overrides}});
    for(const h of [{origin:'https://attacker.example'},{origin:'null'},{'x-forwarded-host':'other.example'},{'content-type':'text/plain'}])assert.equal((await POST(request(h))).status,403);
    fixture.admin=false;assert.equal((await POST(request())).status,403);assert.equal(fixture.reads,0);
    fixture.admin=true;const success=await POST(request());assert.equal(success.headers.get('cache-control'),'no-store');assert.deepEqual(await success.json(),{readable:true,checkedAt:'2026-09-14T00:00:00Z'});
    fixture.reason='reconnect';const failure=await POST(request());assert.equal(failure.status,503);assert.deepEqual(await failure.json(),{reason:'reconnect'});
    await build({stdin:{contents:'import React from "react";import {createRoot} from "react-dom/client";import {DisplayrMailboxCheck} from "./components/portal/DisplayrMailboxCheck";createRoot(document.getElementById("root")).render(<DisplayrMailboxCheck disabled={false}/>);',resolveDir:process.cwd(),loader:'tsx'},outfile:join(dir,'client.js'),bundle:true,platform:'browser',jsx:'automatic'});
    const js=await readFile(join(dir,'client.js'));
    server=createServer(async(req,res)=>{
      if(req.url==='/client.js'){res.setHeader('Content-Type','application/javascript');res.end(js);return;}
      if(req.method==='POST'){const reply=await POST(request());res.statusCode=reply.status;res.setHeader('Content-Type','application/json');res.end(await reply.text());return;}
      res.setHeader('Content-Type','text/html');res.setHeader('Referrer-Policy','no-referrer');res.end('<div id="root"></div><script src="/client.js"></script>');
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    browser=await chromium.launch({headless:true,executablePath:process.env.TEST_CHROME_PATH,args:['--no-sandbox']});
    const page=await browser.newPage();fixture.reason='';
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.getByRole('button').click();await page.getByRole('status').filter({hasText:'Mailbox access verified.'}).waitFor();
    fixture.reason='reconnect';await page.getByRole('button').click();await page.getByRole('status').filter({hasText:'Please reconnect'}).waitFor();
  }finally{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));delete globalThis.__mailboxCheck;await rm(dir,{recursive:true,force:true});}
});
