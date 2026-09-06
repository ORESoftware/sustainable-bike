import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const security = JSON.parse(await readFile(new URL('../config/captive-wheel-security.json', import.meta.url), 'utf8'));

test('wheel retention forbids casual external release mechanisms', () => {
  const a = security.architecture;
  assert.equal(a.frontSupport, 'single-sided-monoblade');
  assert.equal(a.rearSupport, 'single-sided-swingarm');
  assert.equal(a.quickReleaseAllowed, false);
  assert.equal(a.externallyAccessibleAxleNutAllowed, false);
  assert.equal(a.secondaryRetentionRequired, true);
  assert.equal(a.lockedServiceCoverRequired, true);
});

test('anti-theft design remains serviceable rather than permanently fused', () => {
  const ids = new Set(security.verification.map(({ id }) => id));
  assert.ok(ids.has('bearing-service-without-frame-destruction'));
  assert.ok(ids.has('motor-service-without-wheel-release'));
  assert.ok(security.verification.every(({ required, method }) => required === true && method.length > 0));
});
