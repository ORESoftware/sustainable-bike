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

test('the drivetrain has exactly one front ring and no external ratios', () => {
  assert.equal(design.frontTeeth, 60);
  assert.equal(design.rearTeeth, 22);
  assert.deepEqual(design.internalRatios, [1, 1.36]);
});

test('low automatic ratio is useful for starts and modest hills', () => {
  const mph = roadSpeedMph({ internalRatio: design.internalRatios[0] });
  assert.ok(mph > 17 && mph < 19, `observed ${mph.toFixed(3)} mph`);
});

test('high automatic ratio approaches the 25 mph research target', () => {
  const mph = roadSpeedMph({ internalRatio: design.internalRatios[1] });
  assert.ok(mph > 24 && mph <= design.targetAssistMph, `observed ${mph.toFixed(3)} mph`);
});

test('selected synchronous belt is close to the pitch-path estimate', () => {
  const delta = Math.abs(selectedBeltLengthMm() - approximateOpenBeltLengthMm());
  assert.ok(delta < 5, `belt length delta was ${delta.toFixed(3)} mm`);
});

test('pitch diameters increase monotonically with tooth count', () => {
  assert.ok(pitchDiameterMm(design.frontTeeth) > pitchDiameterMm(design.rearTeeth));
});

test('summary is deterministic and finite', () => {
  const report = summary();
  assert.equal(report.speedsMph.length, 2);
  assert.ok(report.speedsMph.every(({ mph }) => Number.isFinite(mph)));
  assert.ok(Number.isFinite(report.beltLengthDeltaMm));
});

test('invalid pulley and center-distance inputs fail closed', () => {
  assert.throws(() => pitchDiameterMm(0), RangeError);
  assert.throws(
    () => approximateOpenBeltLengthMm({ frontTeeth: 100, rearTeeth: 10, centerDistanceMm: 1 }),
    RangeError,
  );
});
