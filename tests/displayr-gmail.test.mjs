import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProvisioningMailboxReader, displayrViewerAlias, MailboxReadError } from '../lib/portal/displayr-gmail.ts';
const mailbox='displayr-provisioning@ecofocusworldwide.com';
const config={clientId:'test',clientSecret:'client-secret',refreshToken:'refresh-secret'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
const token=()=>json({access_token:'access-secret',expires_in:3600});

test('refreshes saved token, verifies mailbox and exposes only health status',async()=>{
  const calls=[];
  const reader=createProvisioningMailboxReader({...config,fetchImpl:async(url,init)=>{
    calls.push([url,init]); assert.equal(init.redirect,'error'); assert.equal(init.cache,'no-store');
    if(url.includes('/token')) {assert.equal(init.body.get('grant_type'),'refresh_token');return token();}
    assert.equal(init.headers.Authorization,'Bearer access-secret');
    if(url.includes('/profile'))return json({emailAddress:mailbox});
    return json({messages:[{id:'private-id'}]});
  }});
  const result=await reader.checkAccess(); await reader.checkAccess();
  assert.deepEqual(Object.keys(result).sort(),['checkedAt','readable']); assert.equal(result.readable,true);
  assert.equal(calls.filter(([url])=>url.includes('/token')).length,1);
  assert.ok(!JSON.stringify(result).includes('secret')); assert.ok(!JSON.stringify(result).includes('private-id'));
});

test('revoked consent and wrong mailbox stop before reading mail',async()=>{
  let mailReads=0;
  for(const wrongMailbox of [false,true]){
    const reader=createProvisioningMailboxReader({...config,fetchImpl:async url=>{
      if(url.includes('/token'))return wrongMailbox?token():json({error:'invalid_grant',error_description:'secret details'},400);
      if(url.includes('/profile'))return json({emailAddress:'other@example.com'});
      mailReads++;return json({});
    }});
    await assert.rejects(reader.checkAccess(),error=>error instanceof MailboxReadError && error.reason===(wrongMailbox?'wrong-mailbox':'reconnect') && !error.message.includes('secret'));
  }
  assert.equal(mailReads,0);
});

test('a rejected access token triggers only one renewal retry',async()=>{
  let refreshes=0,profiles=0;
  const reader=createProvisioningMailboxReader({...config,fetchImpl:async url=>{
    if(url.includes('/token')){refreshes++;return token();}
    profiles++;return json({},401);
  }});
  await assert.rejects(reader.checkAccess(),{reason:'reconnect'});
  assert.equal(refreshes,2);assert.equal(profiles,2);
});

test('invitation candidates require exact viewer alias, sender, timestamp and invitation subject',async()=>{
  const alias=displayrViewerAlias('user-a'), now=Date.now(), since=new Date(now-60000);
  assert.equal(alias,displayrViewerAlias('user-a'));assert.notEqual(alias,displayrViewerAlias('user-b'));
  const message=(id,from='Displayr <support@displayr.com>',to=alias,date=now,subject='You have been invited')=>({id,internalDate:String(date),payload:{headers:[{name:'From',value:from},{name:'To',value:to},{name:'Subject',value:subject}]}});
  const records={good:message('good'),other:message('other',undefined,displayrViewerAlias('user-b')),spoof:message('spoof','support@displayr.com.evil'),old:message('old',undefined,undefined,now-120000),unrelated:message('unrelated',undefined,undefined,now,'Welcome')};
  const reader=createProvisioningMailboxReader({...config,fetchImpl:async url=>{
    if(url.includes('/token'))return token();if(url.includes('/profile'))return json({emailAddress:mailbox});
    const parsed=new URL(url);
    if(parsed.pathname.endsWith('/messages')){assert.ok(parsed.searchParams.get('q').includes('to:'+alias));assert.equal(parsed.searchParams.get('includeSpamTrash'),'false');return json({messages:Object.keys(records).map(id=>({id}))});}
    assert.equal(parsed.searchParams.get('format'),'metadata');return json(records[parsed.pathname.split('/').pop()]);
  }});
  const result=await reader.findInvitationCandidates('user-a',since);
  assert.equal(result.complete,true);assert.deepEqual(result.candidates.map(c=>c.messageId),['good']);
  await assert.rejects(reader.findInvitationCandidates('user-a',new Date('invalid')),{reason:'invalid-request'});
});

test('bounded pagination reports incomplete discovery instead of claiming no invitation exists',async()=>{
  let pages=0;
  const reader=createProvisioningMailboxReader({...config,fetchImpl:async url=>{
    if(url.includes('/token'))return token();if(url.includes('/profile'))return json({emailAddress:mailbox});
    pages++;return json({messages:[],nextPageToken:'more'});
  }});
  assert.deepEqual(await reader.findInvitationCandidates('user',new Date(Date.now()-1000)),{candidates:[],complete:false});assert.equal(pages,3);
});
