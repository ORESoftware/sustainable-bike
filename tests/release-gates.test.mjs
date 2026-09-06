import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const gates = JSON.parse(await readFile(new URL('../config/release-gates.json', import.meta.url), 'utf8'));

test('human rider testing is fail-closed by default', () => {
  assert.equal(gates.humanRiderTestingAllowed, false);
});

test('release gate ids are unique and required', () => {
  const ids = gates.requiredGates.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(gates.requiredGates.length >= 8);
  assert.ok(gates.requiredGates.every(({ required }) => required === true));
});

test('critical safety domains have explicit evidence gates', () => {
  const categories = new Set(gates.requiredGates.map(({ category }) => category));
  for (const required of ['structure', 'anti-theft', 'braking', 'drive', 'electrical', 'rolling-stock']) {
    assert.ok(categories.has(required), `missing ${required} release gate`);
  }
  assert.ok(gates.requiredGates.every(({ evidence }) => typeof evidence === 'string' && evidence.length > 0));
});
