import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  approximateBeltLengthMm,
  deriveMetrics,
  pitchDiameterMm,
  roadSpeedMph,
  validateBikeConfig,
  wheelRpmAtMph,
} from '../src/calculations.mjs';

const config = JSON.parse(fs.readFileSync(new URL('../config/bike.json', import.meta.url), 'utf8'));

test('reference geometry reaches approximately 25 mph in automatic high ratio', () => {
  const speed = roadSpeedMph({
    cadenceRpm: 85,
    frontTeeth: 60,
    rearTeeth: 22,
    internalRatio: 1.36,
    outsideDiameterMm: 661,
  });
  assert.ok(speed > 24 && speed < 25, `unexpected speed ${speed}`);
});

test('low automatic ratio remains useful for starts and hills', () => {
  const speed = roadSpeedMph({
    cadenceRpm: 85,
    frontTeeth: 60,
    rearTeeth: 22,
    internalRatio: 1,
    outsideDiameterMm: 661,
  });
  assert.ok(speed > 17 && speed < 19, `unexpected speed ${speed}`);
});

test('wheel rpm at the requested assist cutoff is stable', () => {
  const rpm = wheelRpmAtMph({ speedMph: 25, outsideDiameterMm: 661 });
  assert.ok(Math.abs(rpm - 322.91) < 0.1);
});

test('belt geometry is internally coherent', () => {
  assert.ok(Math.abs(pitchDiameterMm(60, 11) - 210.08) < 0.1);
  const length = approximateBeltLengthMm({
    centerDistanceMm: 445,
    frontTeeth: 60,
    rearTeeth: 22,
    pitchMm: 11,
  });
  assert.ok(length > 1340 && length < 1360);
});

test('reference config enforces the requested architecture', () => {
  const result = validateBikeConfig(config);
  assert.deepEqual(result.errors, []);
  assert.equal(config.drivetrain.frontChainrings, 1);
  assert.equal(config.drivetrain.manualShifter, false);
  assert.equal(config.drivetrain.lubricationRequired, false);
  assert.equal(config.motor.position, 'rear-hub');
  assert.equal(config.antiTheft.quickRelease, false);
  assert.ok(result.warnings.some((warning) => warning.includes('25 mph')));
});

test('derived metrics are finite', () => {
  for (const value of Object.values(deriveMetrics(config))) {
    assert.ok(Number.isFinite(value));
  }
});
