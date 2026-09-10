import assert from 'node:assert/strict';
import test from 'node:test';
import { DisplayrGatewayError, displayrGatewayFailureCode, controlFailureCode } from '../../../lib/portal/displayr-gateway-diagnostics.ts';

test('launch diagnostics distinguish control authentication, authorization, and routing failures', () => {
  assert.equal(controlFailureCode(401), 'CONTROL_UNAUTHORIZED');
  assert.equal(controlFailureCode(403), 'CONTROL_ACCESS_DENIED');
  assert.equal(controlFailureCode(404), 'CONTROL_ROUTE_NOT_FOUND');
  assert.equal(controlFailureCode(503), 'CONTROL_UNAVAILABLE');
});

test('launch diagnostics never expose arbitrary exception content', () => {
  const sensitive = 'https://example.com/?ticket=private-test-ticket';
  for (const error of [new Error(sensitive), sensitive, { code: sensitive }, null]) {
    assert.equal(displayrGatewayFailureCode(error), 'LAUNCH_UNEXPECTED');
  }
  const error = new DisplayrGatewayError('CONTROL_REQUEST_FAILED');
  error.message = sensitive;
  assert.equal(displayrGatewayFailureCode(error), 'CONTROL_REQUEST_FAILED');
  error.code = sensitive;
  assert.equal(displayrGatewayFailureCode(error), 'LAUNCH_UNEXPECTED');
});
