import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, modules = {}, globals = {}) {
  const source = fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => { if (!(name in modules)) throw Error(name); return modules[name]; }, URL, Request, Response, AbortSignal, console: { error() {} }, process: { env: {} }, ...globals });
  return exports;
}

const { clearPurchasedCart } = load('lib/report-cart.ts');
function storage(cart) {
  const values = new Map([['ef_cart', JSON.stringify(cart)]]);
  return { getItem: key => values.get(key) ?? null, setItem: (key,value) => values.set(key,value), cart: () => JSON.parse(values.get('ef_cart')) };
}
test('cart cleanup removes purchased quantities and preserves unrelated or newly added items', () => {
  const local = storage([{priceId:'price_a',title:'A',qty:3},{priceId:'price_b',title:'B',qty:1}]);
  clearPurchasedCart(local,'EF-ORDER1',[{priceId:'price_a',qty:2}]);
  assert.deepEqual(local.cart(),[{priceId:'price_a',title:'A',qty:1},{priceId:'price_b',title:'B',qty:1}]);
});
test('returning to an old order never clears a newly populated cart', () => {
  const local=storage([{priceId:'price_a',qty:1}]);
  clearPurchasedCart(local,'EF-ORDER1',[{priceId:'price_a',qty:1}]);
  local.setItem('ef_cart',JSON.stringify([{priceId:'price_a',qty:4}]));
  clearPurchasedCart(local,'EF-ORDER1',[{priceId:'price_a',qty:1}]);
  assert.equal(local.cart()[0].qty,4);
});
test('cart cleanup consumes duplicate purchased line quantities correctly', () => {
  const local=storage([{priceId:'price_a',qty:3}]);
  clearPurchasedCart(local,'EF-ORDER1',[{priceId:'price_a',qty:1},{priceId:'price_a',qty:2}]);
  assert.equal(local.cart().length,0);
});
test('order summary uses Stripe paid amount, reference and all line items', async () => {
  const session={id:'cs_test_abc1234567890',status:'complete',payment_status:'paid',amount_total:50,currency:'usd',customer_details:{email:'buyer@example.com'},metadata:{source:'report-store',report_ids:'["1"]'}};
  const {getReportOrderDetails}=load('lib/report-orders.ts',{'server-only':{},'@/lib/stripe':{getStripeServer:()=>({checkout:{sessions:{retrieve:async()=>session,listLineItems:async(_id,args)=>{assert.equal(args.limit,100);return {data:[{price:{id:'price_a'},quantity:2,description:'Research'}]};}}}})}});
  const order=await getReportOrderDetails(session.id);
  assert.equal(order.amountTotal,50);
  assert.equal(order.reference,'EF-1234567890');
  assert.equal(order.items[0].priceId,'price_a');
  assert.equal(order.items[0].qty,2);
  assert.equal(order.emailSent,false);
});
function emailHarness({sent=false,valid=true,configured=true,providerOk=true}={}) {
  const requests=[],updates=[];
  const order={reference:'EF-1234567890',currency:'usd',amountTotal:50,email:'buyer@example.com',emailSent:sent,items:[{title:'Report <script> & charts',priceId:'price_a',qty:1}]};
  const email=load('lib/report-email.ts',{
    'server-only':{},
    '@/lib/report-site':{getReportSiteOrigin:()=> 'https://ecofocusresearch.com'},
    '@/lib/report-orders':{getReportOrderDetails:async()=>{if(!valid)throw Error('Payment not confirmed');return order;}},
    '@/lib/stripe':{getStripeServer:()=>({checkout:{sessions:{update:async(...args)=>updates.push(args)}}})},
  },{process:{env:configured?{RESEND_API_KEY:'test-provider-key',PORTAL_FROM_EMAIL:'reports@example.com'}:{}},fetch:async(url,options)=>{requests.push({url,options});return {ok:providerOk,status:providerOk?200:500,json:async()=>({id:'email_test'})};}});
  return {...email,requests,updates};
}
test('email sends to the Stripe buyer with an escaped message and private order link',async()=>{
  const email=emailHarness();
  const result=await email.sendReportOrderEmail('cs_test_abc123');
  assert.equal(result.sent,true);
  const request=email.requests[0],body=JSON.parse(request.options.body);
  assert.deepEqual(body.to,['buyer@example.com']);
  assert.equal(request.options.headers['Idempotency-Key'],'report-order/cs_test_abc123');
  assert.ok(body.html.includes('Report &lt;script&gt; &amp; charts'));
  assert.ok(body.text.includes('https://ecofocusresearch.com/checkout/success?session_id=cs_test_abc123'));
  assert.equal(email.updates[0][1].metadata.report_email_sent,'true');
});
test('repeat email requests use the recorded success instead of resending',async()=>{
  const email=emailHarness({sent:true});
  assert.equal((await email.sendReportOrderEmail('cs_test_abc123')).alreadySent,true);
  assert.equal(email.requests.length,0);
});
test('unpaid orders and missing email configuration never send a message',async()=>{
  for(const options of [{valid:false},{configured:false}]){
    const email=emailHarness(options);
    await assert.rejects(email.sendReportOrderEmail('cs_test_abc123'));
    assert.equal(email.requests.length,0);
    assert.equal(email.updates.length,0);
  }
});
test('provider failures are not recorded or reported as successful delivery',async()=>{
  const email=emailHarness({providerOk:false});
  await assert.rejects(email.sendReportOrderEmail('cs_test_abc123'),/not accepted/);
  assert.equal(email.updates.length,0);
});
test('email endpoint ignores caller-supplied recipient and forwards only a valid order token',async()=>{
  let received;
  const {POST}=load('app/api/reports/order-email/route.ts',{'next/server':{NextResponse:{json:(data,options)=>Response.json(data,options)}},'@/lib/report-email':{sendReportOrderEmail:async id=>{received=id;return {sent:true};}}});
  const result=await POST(new Request('https://example.com/api/reports/order-email',{method:'POST',body:JSON.stringify({sessionId:'cs_test_abc123',to:'attacker@example.com'})}));
  assert.equal(result.status,200);assert.equal(received,'cs_test_abc123');
  assert.equal((await POST(new Request('https://example.com/api/reports/order-email',{method:'POST',body:'{}'}))).status,400);
});
test('webhook emails only paid report-store sessions, including delayed success',async()=>{
  let event;const sent=[];
  const {POST}=load('app/api/stripe/webhook/route.ts',{
    'next/server':{NextResponse:{json:(data,options)=>Response.json(data,options)}},
    '@/lib/portal/billing':{syncPortalInvoiceStatusFromStripeInvoice:async()=>{},syncPortalSubscriptionStatusFromStripeSubscription:async()=>{}},
    '@/lib/portal/data':{getPortalCompanies:async()=>[]},
    '@/lib/portal/email':{sendPortalInvoicePaidNotificationEmail:async()=>{}},
    '@/lib/portal/provisioning':{getPortalProvisioningMetadata:()=>null,upsertPortalAccountRecords:async()=>{},upsertPortalDashboardConfig:async()=>{}},
    '@/lib/report-email':{sendReportOrderEmail:async id=>sent.push(id)},
    '@/lib/stripe':{getStripeServer:()=>({webhooks:{constructEventAsync:async()=>event}})},
  },{process:{env:{STRIPE_WEBHOOK_SECRET:'test-secret'}}});
  for(const [type,status,source] of [['checkout.session.completed','unpaid','report-store'],['checkout.session.completed','paid','report-store'],['checkout.session.async_payment_succeeded','paid','report-store'],['checkout.session.completed','paid','other']]) {
    event={type,data:{object:{id:'cs_test_abc123',payment_status:status,metadata:{source}}}};
    assert.equal((await POST(new Request('https://example.com/api/stripe/webhook',{method:'POST',headers:{'stripe-signature':'test-signature'},body:'{}'}))).status,200);
  }
  assert.equal(sent.length,2);
});


test('bank payments have distinct pending, paid, failed, incomplete and expired states', async()=>{
  let session;
  const {getReportOrderStatus,getPaidReportOrder}=load('lib/report-orders.ts',{'server-only':{},'@/lib/stripe':{getStripeServer:()=>({checkout:{sessions:{retrieve:async()=>session}}})}});
  for(const [status,payment_status,intent,state] of [
    ['complete','unpaid','processing','pending'],
    ['complete','unpaid','succeeded','pending'],
    ['complete','paid','succeeded','paid'],
    ['complete','unpaid','requires_payment_method','failed'],
    ['complete','unpaid','canceled','failed'],
    ['open','unpaid','requires_payment_method','incomplete'],
    ['expired','unpaid','requires_payment_method','expired'],
  ]) {
    session={id:'cs_test_status123',status,payment_status,payment_intent:{status:intent},metadata:{source:'report-store',report_ids:'["1"]'}};
    assert.equal((await getReportOrderStatus(session.id)).state,state);
    if(state!=='paid') await assert.rejects(getPaidReportOrder(session.id),/not been confirmed/);
  }
});

test('production checkout and email origins ignore internal Netlify aliases',()=>{
  const {getReportSiteOrigin}=load('lib/report-site.ts',{}, {process:{env:{NODE_ENV:'production',NEXT_PUBLIC_SITE_URL:'https://main--ecofocusresearch.netlify.app'}}});
  assert.equal(getReportSiteOrigin('https://main--ecofocusresearch.netlify.app/api/checkout'),'https://ecofocusresearch.com');
  assert.equal(getReportSiteOrigin(),'https://ecofocusresearch.com');
  const configured=load('lib/report-site.ts',{}, {process:{env:{NODE_ENV:'production',REPORTS_SITE_URL:'https://preview.example.com/path'}}});
  assert.equal(configured.getReportSiteOrigin(),'https://preview.example.com');
  const local=load('lib/report-site.ts');
  assert.equal(local.getReportSiteOrigin('http://localhost:3100/api/checkout'),'http://localhost:3100');
});

test('status endpoint returns payment state without unlocking files or exposing customer data',async()=>{
  const {POST}=load('app/api/reports/order-status/route.ts',{'next/server':{NextResponse:{json:(data,options)=>Response.json(data,options)}},'@/lib/report-orders':{getReportOrderStatus:async()=>({state:'pending',email:'private@example.com'})}});
  const response=await POST(new Request('https://example.com/api/reports/order-status',{method:'POST',body:JSON.stringify({sessionId:'cs_test_abc123'})}));
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{state:'pending'});
  assert.match(response.headers.get('cache-control'),/no-store/);
});

test('status API errors stay errors instead of being presented as pending payments',async()=>{
  const {POST}=load('app/api/reports/order-status/route.ts',{'next/server':{NextResponse:{json:(data,options)=>Response.json(data,options)}},'@/lib/report-orders':{getReportOrderStatus:async()=>{throw Error('Stripe unavailable');}}});
  assert.equal((await POST(new Request('https://example.com/api/reports/order-status',{method:'POST',body:JSON.stringify({sessionId:'cs_test_abc123'})}))).status,503);
});
