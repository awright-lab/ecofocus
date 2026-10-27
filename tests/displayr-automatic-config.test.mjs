import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isAutomaticDisplayrUser,isDisplayrManagedUser,isDisplayrGatewayPilotUser} from '../lib/portal/displayr-gateway-config.ts';
test('automatic rollout includes new viewers while preserving explicit legacy pilot scope',()=>{
 const keys=['DISPLAYR_GATEWAY_ENABLED','DISPLAYR_PROVISIONING_ENABLED','DISPLAYR_PROVISIONING_USER_IDS','DISPLAYR_GATEWAY_PILOT_USER_IDS','DISPLAYR_GATEWAY_MANAGED_USER_IDS'];
 const previous=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 try{
  Object.assign(process.env,{DISPLAYR_GATEWAY_ENABLED:'true',DISPLAYR_PROVISIONING_ENABLED:'false',DISPLAYR_PROVISIONING_USER_IDS:'*',DISPLAYR_GATEWAY_PILOT_USER_IDS:'legacy',DISPLAYR_GATEWAY_MANAGED_USER_IDS:'existing'});
  assert.equal(isAutomaticDisplayrUser('new'),false);assert.equal(isDisplayrManagedUser('existing'),true);
  process.env.DISPLAYR_PROVISIONING_ENABLED='true';process.env.DISPLAYR_PROVISIONING_USER_IDS='test';
  assert.equal(isDisplayrManagedUser('test'),true);assert.equal(isDisplayrGatewayPilotUser('new'),false);
  process.env.DISPLAYR_PROVISIONING_USER_IDS='*';
  assert.equal(isDisplayrManagedUser('new'),true);assert.equal(isAutomaticDisplayrUser('legacy'),false);assert.equal(isDisplayrManagedUser('legacy'),false);assert.equal(isDisplayrGatewayPilotUser('legacy'),true);
  process.env.DISPLAYR_GATEWAY_ENABLED='false';assert.equal(isDisplayrManagedUser('new'),false);
 }finally{for(const k of keys){if(previous[k]===undefined)delete process.env[k];else process.env[k]=previous[k];}}
});
