import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  approximateBeltLengthMm,
  assistEnvelope,
  compareDesigns,
  deriveMetrics,
  flatRoadPowerW,
  pitchDiameterMm,
  roadSpeedMph,
  validateBikeConfig,
  wheelRpmAtMph,
} from '../src/calculations.mjs';

const read = (year) => JSON.parse(fs.readFileSync(new URL(`../config/designs/${year}.json`, import.meta.url), 'utf8'));
const designs = new Map([[2026, read(2026)], [2027, read(2027)]]);
const clone = (year) => structuredClone(designs.get(year));

test('both yearly designs validate and preserve the requested architecture', () => {
  for (const [year, config] of designs) {
    const result = validateBikeConfig(config);
    assert.deepEqual(result.errors, [], `${year}: ${result.errors.join('; ')}`);
    assert.equal(config.drivetrain.frontChainrings, 1);
    assert.equal(config.drivetrain.manualShifter, false);
    assert.equal(config.drivetrain.shiftControl.riderOperatedControl, false);
    assert.equal(config.drivetrain.lubricationRequired, false);
    assert.equal(config.motor.position, 'rear-hub');
    assert.equal(config.antiTheft.quickRelease, false);
    assert.equal(config.antiTheft.ordinaryExternalAxleHardware, false);
    assert.equal(config.validation.riderTestingPermitted, false);
    assert.ok(result.warnings.some((warning) => warning.includes('private-course')));
  }
});

test('2026 baseline retains useful two-ratio cadence speeds', () => {
  const metrics = deriveMetrics(designs.get(2026));
  assert.equal(metrics.gearSpeedsMphAtNominalCadence.length, 2);
  assert.ok(metrics.lowGearSpeedMphAtNominalCadence > 17 && metrics.lowGearSpeedMphAtNominalCadence < 19);
  assert.ok(metrics.highGearSpeedMphAtNominalCadence > 24 && metrics.highGearSpeedMphAtNominalCadence < 25);
  assert.ok(metrics.privateTestMode.continuousMechanicalMarginW > 0 && metrics.privateTestMode.continuousMechanicalMarginW < 15);
});

test('2027 adds a true hill ratio and reaches approximately 25 mph in automatic high ratio', () => {
  const metrics = deriveMetrics(designs.get(2027));
  assert.equal(metrics.gearSpeedsMphAtNominalCadence.length, 3);
  assert.ok(metrics.gearSpeedsMphAtNominalCadence[0] > 12 && metrics.gearSpeedsMphAtNominalCadence[0] < 13.5);
  assert.ok(metrics.gearSpeedsMphAtNominalCadence[1] > 15 && metrics.gearSpeedsMphAtNominalCadence[1] < 17);
  assert.ok(metrics.highGearSpeedMphAtNominalCadence > 24.7 && metrics.highGearSpeedMphAtNominalCadence < 25.3);
});

test('2027 improves idealized continuous margin and range without increasing rated motor power', () => {
  const baseline = designs.get(2026);
  const successor = designs.get(2027);
  assert.equal(successor.motor.ratedPowerW, baseline.motor.ratedPowerW);
  const comparison = compareDesigns(baseline, successor);
  assert.deepEqual(comparison.errors, []);
  assert.ok(comparison.deltas.privatePowerMarginW > 50);
  assert.ok(comparison.deltas.privateRangeMiles > 7);
  assert.equal(comparison.deltas.gearCount, 1);
  assert.equal(comparison.deltas.batteryWh, 96);
  assert.equal(comparison.deltas.disassemblyMinutes, -15);
});

test('belt geometry is coherent in both years', () => {
  assert.ok(Math.abs(pitchDiameterMm(60, 11) - 210.08) < 0.1);
  for (const config of designs.values()) {
    const length = approximateBeltLengthMm({
      centerDistanceMm: config.geometry.chainstayMm,
      frontTeeth: config.drivetrain.frontTeeth,
      rearTeeth: config.drivetrain.rearTeeth,
      pitchMm: config.drivetrain.beltPitchMm,
    });
    const selected = config.drivetrain.beltTeeth * config.drivetrain.beltPitchMm;
    assert.ok(Math.abs(selected - length) < config.drivetrain.beltPitchMm);
  }
});

test('wheel rpm at the private-course cutoff is stable', () => {
  const rpm = wheelRpmAtMph({ speedMph: 25, outsideDiameterMm: 661 });
  assert.ok(Math.abs(rpm - 322.91) < 0.1);
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

test('public-road-oriented mode stays below 20 mph in both years', () => {
  for (const config of designs.values()) {
    assert.equal(config.motor.publicRoadAssistCutoffMph, 19.5);
    assert.equal(config.motor.privateTestAssistCutoffMph, 25);
    assert.equal(config.motor.privateTestModeDefaultEnabled, false);
    const metrics = deriveMetrics(config);
    assert.ok(metrics.wheelRpmAtPublicRoadCutoff < metrics.wheelRpmAtPrivateTestCutoff);
  }
});

test('validator rejects an external quick release', () => {
  const candidate = clone(2026);
  candidate.antiTheft.quickRelease = true;
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('quick-release')));
});

test('validator rejects rider-operated shifting', () => {
  const candidate = clone(2027);
  candidate.drivetrain.shiftControl.riderOperatedControl = true;
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('rider must not operate')));
});

test('validator rejects a 2027 two-speed regression', () => {
  const candidate = clone(2027);
  candidate.drivetrain.internalGearRatios = [1, 1.62];
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('three automatic internal ratios')));
});

test('validator rejects private 25 mph mode enabled by default', () => {
  const candidate = clone(2026);
  candidate.motor.privateTestModeDefaultEnabled = true;
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('disabled by default')));
});

test('validator rejects rider testing before release gates close', () => {
  const candidate = clone(2027);
  candidate.validation.riderTestingPermitted = true;
  assert.ok(validateBikeConfig(candidate).errors.some((error) => error.includes('rider testing')));
});

test('validator returns structured errors for malformed configuration instead of throwing', () => {
  const result = validateBikeConfig({});
  assert.ok(result.errors.length >= 15);
  assert.equal(result.metrics, null);
});

test('derived metrics are finite throughout both nested results', () => {
  for (const config of designs.values()) {
    const values = flattenNumbers(deriveMetrics(config));
    assert.ok(values.length >= 25);
    for (const value of values) assert.ok(Number.isFinite(value));
  }
});

test('compatibility config is an exact copy of the 2026 profile', () => {
  const alias = JSON.parse(fs.readFileSync(new URL('../config/bike.json', import.meta.url), 'utf8'));
  assert.deepEqual(alias, designs.get(2026));
});

function flattenNumbers(value) {
  if (typeof value === 'number') return [value];
  if (Array.isArray(value)) return value.flatMap(flattenNumbers);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flattenNumbers);
  return [];
}
