import assert from 'node:assert/strict';
import test from 'node:test';

import {
  approximateOpenBeltLengthMm,
  design,
  pitchDiameterMm,
  roadSpeedMph,
  selectedBeltLengthMm,
  summary,
} from '../scripts/calculations.mjs';

test('drivetrain has one front ring and only internal automatic ratios', () => {
  assert.equal(design.frontTeeth, 60);
  assert.equal(design.rearTeeth, 22);
  assert.deepEqual(design.internalRatios, [1, 1.36]);
});

test('low ratio is near 18 mph at reference cadence', () => {
  const mph = roadSpeedMph({ internalRatio: design.internalRatios[0] });
  assert.ok(mph > 17 && mph < 19, `observed ${mph.toFixed(3)} mph`);
});

test('high ratio approaches but does not exceed research target', () => {
  const mph = roadSpeedMph({ internalRatio: design.internalRatios[1] });
  assert.ok(mph > 24 && mph <= design.targetAssistMph, `observed ${mph.toFixed(3)} mph`);
});

test('selected belt is close to pitch-path estimate', () => {
  const delta = Math.abs(selectedBeltLengthMm() - approximateOpenBeltLengthMm());
  assert.ok(delta < 5, `belt length delta was ${delta.toFixed(3)} mm`);
});

test('pitch diameter grows with tooth count', () => {
  assert.ok(pitchDiameterMm(design.frontTeeth) > pitchDiameterMm(design.rearTeeth));
});

test('summary is deterministic and finite', () => {
  const report = summary();
  assert.equal(report.speedsMph.length, 2);
  assert.ok(report.speedsMph.every(({ mph }) => Number.isFinite(mph)));
  assert.ok(Number.isFinite(report.beltLengthDeltaMm));
});

test('invalid geometry fails closed', () => {
  assert.throws(() => pitchDiameterMm(0), RangeError);
  assert.throws(
    () => approximateOpenBeltLengthMm({ frontTeeth: 100, rearTeeth: 10, centerDistanceMm: 1 }),
    RangeError,
  );
});
