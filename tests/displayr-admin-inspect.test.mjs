import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspectionRequestGuard, inspectDisplayrAdministrator } from '../tools/displayr-admin-inspect.mjs';

test('inspection permits one login POST and denies all other mutations and external navigation',()=>{
 const allowed=inspectionRequestGuard();
 const req=(url,method='GET',navigation=true)=>({url:()=>url,method:()=>method,isNavigationRequest:()=>navigation});
 assert.equal(allowed(req('https://app.displayr.com/Login','POST')),true);
 assert.equal(allowed(req('https://app.displayr.com/Login','POST')),false);
 for(const method of ['POST','PUT','PATCH','DELETE'])assert.equal(allowed(req('https://app.displayr.com/Users/New',method)),false);
 assert.equal(allowed(req('https://outside.example/Login')),false);
 assert.equal(allowed(req('https://app.displayr.com/MyReports')),true);
});

test('inspection targets the administrator and closes its isolated browser without returning cookies',async()=>{
 let closed=false;const fills=[];
 const page={setDefaultTimeout(){},async goto(){},getByRole(role,{name}){return{async fill(value){fills.push([name,value]);},async click(){}};},async waitForURL(){},locator(){return{async evaluateAll(){return ['/Account/Settings'];}};}};
 const chromium={async launch(){return{async newContext(){return{async route(){},async newPage(){return page;}};},async close(){closed=true;}};}};
 assert.deepEqual(await inspectDisplayrAdministrator({chromium,email:'admin@example.com',password:'private-test'}),{signedIn:true,managementPaths:['/Account/Settings'],userCreationTested:false});
 assert.deepEqual(fills,[['Email','admin@example.com'],['Password','private-test']]);assert.equal(closed,true);
 page.waitForURL=async()=>{throw new Error('sensitive private-test');};closed=false;
 await assert.rejects(inspectDisplayrAdministrator({chromium,email:'admin@example.com',password:'private-test'}),error=>error.message.includes('login-completion')&&!error.message.includes('private-test'));
 assert.equal(closed,true);
});
