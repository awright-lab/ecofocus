import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {NextRequest} from 'next/server.js';

test('renewal accepts the configured public origin behind a proxy and rejects other origins', async()=>{
 const dir=await mkdtemp(join(tmpdir(),'renew-route-'));
 const previous=process.env.PORTAL_HOSTNAME;
 process.env.PORTAL_HOSTNAME='portal.ecofocusresearch.com';
 try {
  await build({entryPoints:['app/api/portal/displayr/renew/route.ts'],outfile:join(dir,'route.mjs'),bundle:true,platform:'node',format:'esm',plugins:[{name:'fixtures',setup(b){
   b.onResolve({filter:/^next\/server$/},()=>({path:import.meta.resolve('next/server.js').replace('file://',''),external:true}));
   b.onResolve({filter:/^@\/lib\/(portal\/(auth|displayr-gateway|displayr-gateway-config)|supabase\/server)$/},a=>({path:a.path,namespace:'fixture'}));
   b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`export const getPortalAccessContext=async()=>null; export const getServerSupabase=()=>{throw Error('must not call');}; export const isDisplayrGatewayPilotUser=()=>true; export const launchDisplayrGateway=()=>{throw Error('must not call');};`}));
  }}]});
  const {POST}=await import(pathToFileURL(join(dir,'route.mjs')));
  const request=origin=>new NextRequest('http://internal-function/api/portal/displayr/renew',{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify({dashboardSlug:'2024-dashboard'})});
  const accepted=await POST(request('https://portal.ecofocusresearch.com'));
  assert.deepEqual(await accepted.json(),{error:'Session unavailable'});
  for(const origin of ['https://evil.example','http://internal-function',null]) {
   const denied=await POST(request(origin));
   assert.equal(denied.status,403);
   assert.deepEqual(await denied.json(),{error:'Request denied'});
  }
 } finally {if(previous===undefined)delete process.env.PORTAL_HOSTNAME;else process.env.PORTAL_HOSTNAME=previous;await rm(dir,{recursive:true,force:true});}
});
