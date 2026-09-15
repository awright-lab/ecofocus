import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDisplayrPrivateTestUser, isDisplayrPrivateTestScope } from '../lib/portal/displayr-gateway-config.ts';
test('private test users need both allowlists and enabled gateway; original pilot remains default',()=>{
 const keys=['DISPLAYR_GATEWAY_ENABLED','DISPLAYR_GATEWAY_PILOT_USER_IDS','DISPLAYR_GATEWAY_PRIVATE_TEST_USER_IDS','DISPLAYR_GATEWAY_PRIVATE_TEST_SCOPES_JSON'];
 const before=keys.map(k=>process.env[k]);
 try{
  process.env.DISPLAYR_GATEWAY_ENABLED='true';process.env.DISPLAYR_GATEWAY_PILOT_USER_IDS='user-arif,test-user';delete process.env.DISPLAYR_GATEWAY_PRIVATE_TEST_USER_IDS;
  assert.equal(isDisplayrPrivateTestScope('user-arif','company-ecofocus','interactive-dashboard-2024'),true);
  assert.equal(isDisplayrPrivateTestScope('user-arif','other-company','interactive-dashboard-2024'),false);
  assert.equal(isDisplayrPrivateTestUser('user-arif'),true);assert.equal(isDisplayrPrivateTestUser('test-user'),false);
  process.env.DISPLAYR_GATEWAY_PRIVATE_TEST_USER_IDS='user-arif, test-user, outsider';
  assert.equal(isDisplayrPrivateTestUser('test-user'),true);assert.equal(isDisplayrPrivateTestUser('outsider'),false);assert.equal(isDisplayrPrivateTestUser(''),false);
  process.env.DISPLAYR_GATEWAY_PRIVATE_TEST_SCOPES_JSON=JSON.stringify([{userId:'test-user',companyId:'test-company',dashboardSlug:'2024-dashboard'}]);
  assert.equal(isDisplayrPrivateTestScope('test-user','test-company','2024-dashboard'),true);
  assert.equal(isDisplayrPrivateTestScope('test-user','other-company','2024-dashboard'),false);
  assert.equal(isDisplayrPrivateTestScope('test-user','test-company','2025-dashboard'),false);
  process.env.DISPLAYR_GATEWAY_PRIVATE_TEST_SCOPES_JSON='invalid';
  assert.equal(isDisplayrPrivateTestScope('test-user','test-company','2024-dashboard'),false);
  process.env.DISPLAYR_GATEWAY_ENABLED='false';assert.equal(isDisplayrPrivateTestUser('test-user'),false);
  process.env.DISPLAYR_GATEWAY_ENABLED='true';process.env.DISPLAYR_GATEWAY_PRIVATE_TEST_USER_IDS='';assert.equal(isDisplayrPrivateTestUser('user-arif'),false);
 }finally{keys.forEach((key,i)=>{if(before[i]===undefined)delete process.env[key];else process.env[key]=before[i];});}
});
