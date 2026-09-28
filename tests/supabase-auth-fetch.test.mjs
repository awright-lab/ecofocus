import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAuthFetch } from '../lib/supabase/auth-fetch.ts';
const origin='https://fixture.supabase.co';
const target=origin+'/auth/v1/token?grant_type=refresh_token';
test('429 pauses refresh and password grants across clients without retaining tokens or extending on retries',async()=>{
 let time=100000, calls=0;const values=new Map();const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 const send=async()=>{calls++;return new Response('{}',{status:429,headers:{'retry-after':'120'}});};
 const client=createAuthFetch({origin,send,storage,now:()=>time});
 await client(target,{method:'POST',body:'synthetic-refresh-secret'});
 const second=createAuthFetch({origin,send,storage,now:()=>time});
 for(let i=0;i<20;i++)assert.equal((await second(target,{method:'POST'})).status,429);
 assert.equal(calls,1);assert.ok(!JSON.stringify([...values]).includes('secret'));
 time+=60000;await client(origin+'/auth/v1/token?grant_type=password',{method:'POST'});assert.equal(calls,1);
 time+=60001;await second(target,{method:'POST'});assert.equal(calls,2);
});
test('non-token requests pass through and unavailable storage has a memory fallback',async()=>{
 let calls=0;const client=createAuthFetch({origin,storage:{getItem(){throw Error();},setItem(){throw Error();}},send:async()=>{calls++;return new Response('{}',{status:429});}});
 await client(target,{method:'POST'});await client(target,{method:'POST'});assert.equal(calls,1);
 await client(origin+'/rest/v1/items');assert.equal(calls,2);
 await client('https://other.example/auth/v1/token',{method:'POST'});assert.equal(calls,3);
});
