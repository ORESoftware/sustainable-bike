import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  approximateBeltLengthMm,
  assistEnvelope,
  deriveMetrics,
  flatRoadPowerW,
  pitchDiameterMm,
  roadSpeedMph,
  validateBikeConfig,
  wheelRpmAtMph,
} from '../src/calculations.mjs';

const config = JSON.parse(fs.readFileSync(new URL('../config/bike.json', import.meta.url), 'utf8'));
const clone = () => structuredClone(config);

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

test('wheel rpm at the private-course cutoff is stable', () => {
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

test('flat-road model separates aerodynamic and rolling loads', () => {
  const load = flatRoadPowerW({
    speedMph: 25,
    totalMassKg: 133,
    dragAreaM2: 0.5,
    rollingResistanceCoefficient: 0.012,
  });
  assert.ok(load.aerodynamicPowerW > 420 && load.aerodynamicPowerW < 440);
  assert.ok(load.rollingPowerW > 170 && load.rollingPowerW < 180);
  assert.ok(load.mechanicalPowerW > 595 && load.mechanicalPowerW < 610);
});

test('25 mph target requires rider contribution and has only a narrow ideal-condition margin', () => {
  const envelope = assistEnvelope(config, 25);
  assert.ok(envelope.motorMechanicalContinuousW > 405 && envelope.motorMechanicalContinuousW < 415);
  assert.ok(envelope.combinedMechanicalContinuousW > envelope.mechanicalPowerW);
  assert.ok(envelope.continuousMechanicalMarginW > 0 && envelope.continuousMechanicalMarginW < 15);
  assert.ok(envelope.estimatedRangeMiles > 19 && envelope.estimatedRangeMiles < 23);
});

test('public-road-oriented mode is configured below 20 mph', () => {
  assert.equal(config.motor.publicRoadAssistCutoffMph, 19.5);
  assert.equal(config.motor.privateTestAssistCutoffMph, 25);
  assert.equal(config.motor.privateTestModeDefaultEnabled, false);
  const metrics = deriveMetrics(config);
  assert.ok(metrics.wheelRpmAtPublicRoadCutoff < metrics.wheelRpmAtPrivateTestCutoff);
});

test('reference config enforces the requested architecture', () => {
  const result = validateBikeConfig(config);
  assert.deepEqual(result.errors, []);
  assert.equal(config.drivetrain.frontChainrings, 1);
  assert.equal(config.drivetrain.manualShifter, false);
  assert.equal(config.drivetrain.lubricationRequired, false);
  assert.equal(config.motor.position, 'rear-hub');
  assert.equal(config.antiTheft.quickRelease, false);
  assert.equal(config.antiTheft.ordinaryExternalAxleHardware, false);
  assert.equal(config.validation.riderTestingPermitted, false);
  assert.ok(result.warnings.some((warning) => warning.includes('private-course')));
  assert.ok(result.warnings.some((warning) => warning.includes('margin is narrow')));
});

test('validator rejects an external quick release', () => {
  const candidate = clone();
  candidate.antiTheft.quickRelease = true;
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('quick-release')));
});

test('validator rejects private 25 mph mode enabled by default', () => {
  const candidate = clone();
  candidate.motor.privateTestModeDefaultEnabled = true;
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('disabled by default')));
});

test('validator rejects rider testing before release gates close', () => {
  const candidate = clone();
  candidate.validation.riderTestingPermitted = true;
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('rider testing')));
});

test('validator returns structured errors for a malformed configuration instead of throwing', () => {
  const result = validateBikeConfig({});
  assert.ok(result.errors.length >= 10);
  assert.equal(result.metrics, null);
});

test('derived metrics are finite throughout the nested result', () => {
  const values = flattenNumbers(deriveMetrics(config));
  assert.ok(values.length >= 20);
  for (const value of values) assert.ok(Number.isFinite(value));
});

function flattenNumbers(value) {
  if (typeof value === 'number') return [value];
  if (Array.isArray(value)) return value.flatMap(flattenNumbers);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flattenNumbers);
  return [];
}
