import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspectionRequestGuard, inspectDisplayrAdministrator, classifyAdministratorLogin } from '../tools/displayr-admin-inspect.mjs';

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
 let closed=false;let currentUrl='https://app.displayr.com/Login?private=secret';const visits=[];const fills=[];
 const page={on(){},url(){return currentUrl;},setDefaultTimeout(){},async goto(url){visits.push(url);currentUrl=url;return {ok:()=>true,status:()=>200};},getByRole(role,{name}){return{async fill(value){fills.push([name,value]);},async click(){},async isVisible(){return true;}};},async waitForURL(){},locator(selector){return{async innerText(){return 'The email or password is incorrect. Please try again. private-test';},async evaluateAll(){return selector === 'a[href]' ? ['/Account/Settings'] : ['users'];}};}};
 const chromium={async launch(){return{async newContext(){return{async route(){},async newPage(){return page;}};},async close(){closed=true;}};}};
 assert.deepEqual(await inspectDisplayrAdministrator({chromium,email:'admin@example.com',password:'private-test'}),{signedIn:true,accountPageAvailable:true,managementPaths:['/Account/Settings'],managementControls:['users'],blockedWrites:0,blockedNavigations:0,userCreationTested:false});
 assert.deepEqual(visits,['https://app.displayr.com/Login','https://app.displayr.com/MyAccount']);
 assert.deepEqual(fills,[['Email','admin@example.com'],['Password','private-test']]);assert.equal(closed,true);
 page.waitForURL=async()=>{throw new Error('sensitive private-test');};closed=false;
 const report=await inspectDisplayrAdministrator({chromium,email:'admin@example.com',password:'private-test'});
 assert.equal(report.signedIn,false);assert.equal(report.signals.credentialsRejected,true);assert.equal(report.landingPath,'/Login');assert.equal(report.loginFormStillVisible,true);
 assert.ok(!JSON.stringify(report).includes('private-test'));assert.ok(!JSON.stringify(report).includes('private=secret'));
 assert.equal(closed,true);
});

test('login signals distinguish a password rejection, challenge and rate limit',()=>{
 assert.equal(classifyAdministratorLogin('The email or password is incorrect.').credentialsRejected,true);
 assert.equal(classifyAdministratorLogin('Enter your verification code').verificationRequested,true);
 assert.equal(classifyAdministratorLogin('Too many attempts').rateLimited,true);
 assert.deepEqual(classifyAdministratorLogin('Welcome'),{credentialsRejected:false,verificationRequested:false,rateLimited:false});
});
