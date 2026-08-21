const MM_PER_MILE = 1_609_344;

export function wheelCircumferenceMm(outsideDiameterMm) {
  assertPositive(outsideDiameterMm, 'outsideDiameterMm');
  return Math.PI * outsideDiameterMm;
}

export function roadSpeedMph({
  cadenceRpm,
  frontTeeth,
  rearTeeth,
  internalRatio,
  outsideDiameterMm,
}) {
  for (const [name, value] of Object.entries({
    cadenceRpm,
    frontTeeth,
    rearTeeth,
    internalRatio,
    outsideDiameterMm,
  })) {
    assertPositive(value, name);
  }

  const wheelRpm = cadenceRpm * (frontTeeth / rearTeeth) * internalRatio;
  return wheelRpm * wheelCircumferenceMm(outsideDiameterMm) * 60 / MM_PER_MILE;
}

export function wheelRpmAtMph({ speedMph, outsideDiameterMm }) {
  assertPositive(speedMph, 'speedMph');
  return speedMph * MM_PER_MILE / (wheelCircumferenceMm(outsideDiameterMm) * 60);
}

export function pitchDiameterMm(teeth, pitchMm) {
  assertPositive(teeth, 'teeth');
  assertPositive(pitchMm, 'pitchMm');
  return teeth * pitchMm / Math.PI;
}

export function approximateBeltLengthMm({
  centerDistanceMm,
  frontTeeth,
  rearTeeth,
  pitchMm,
}) {
  assertPositive(centerDistanceMm, 'centerDistanceMm');
  const largeDiameter = pitchDiameterMm(Math.max(frontTeeth, rearTeeth), pitchMm);
  const smallDiameter = pitchDiameterMm(Math.min(frontTeeth, rearTeeth), pitchMm);
  return 2 * centerDistanceMm
    + (Math.PI / 2) * (largeDiameter + smallDiameter)
    + ((largeDiameter - smallDiameter) ** 2) / (4 * centerDistanceMm);
}

export function beltPitchErrorMm(config) {
  const approximate = approximateBeltLengthMm({
    centerDistanceMm: config.geometry.chainstayMm,
    frontTeeth: config.drivetrain.frontTeeth,
    rearTeeth: config.drivetrain.rearTeeth,
    pitchMm: config.drivetrain.beltPitchMm,
  });
  const selected = config.drivetrain.beltTeeth * config.drivetrain.beltPitchMm;
  return selected - approximate;
}

export function deriveMetrics(config) {
  const lowRatio = Math.min(...config.drivetrain.internalGearRatios);
  const highRatio = Math.max(...config.drivetrain.internalGearRatios);
  const speedBase = {
    cadenceRpm: config.drivetrain.nominalCadenceRpm,
    frontTeeth: config.drivetrain.frontTeeth,
    rearTeeth: config.drivetrain.rearTeeth,
    outsideDiameterMm: config.wheel.outsideDiameterMm,
  };

  return {
    wheelCircumferenceMm: wheelCircumferenceMm(config.wheel.outsideDiameterMm),
    lowGearSpeedMphAtNominalCadence: roadSpeedMph({ ...speedBase, internalRatio: lowRatio }),
    highGearSpeedMphAtNominalCadence: roadSpeedMph({ ...speedBase, internalRatio: highRatio }),
    wheelRpmAtAssistCutoff: wheelRpmAtMph({
      speedMph: config.motor.assistCutoffMph,
      outsideDiameterMm: config.wheel.outsideDiameterMm,
    }),
    approximateBeltLengthMm: approximateBeltLengthMm({
      centerDistanceMm: config.geometry.chainstayMm,
      frontTeeth: config.drivetrain.frontTeeth,
      rearTeeth: config.drivetrain.rearTeeth,
      pitchMm: config.drivetrain.beltPitchMm,
    }),
    selectedBeltLengthMm: config.drivetrain.beltTeeth * config.drivetrain.beltPitchMm,
    beltPitchErrorMm: beltPitchErrorMm(config),
  };
}

export function validateBikeConfig(config) {
  const errors = [];
  const warnings = [];

  const requireValue = (condition, message) => {
    if (!condition) errors.push(message);
  };

  requireValue(config?.schemaVersion === 1, 'schemaVersion must be 1');
  requireValue(config?.status === 'research-scale-model-only',
    'status must remain research-scale-model-only until a qualified safety program approves otherwise');
  requireValue(config?.drivetrain?.frontChainrings === 1,
    'exactly one front chainring is required');
  requireValue(config?.drivetrain?.transmission === 'synchronous-belt',
    'the drivetrain must use a synchronous belt, not a roller chain');
  requireValue(config?.drivetrain?.lubricationRequired === false,
    'the external drivetrain must not require lubrication');
  requireValue(config?.drivetrain?.manualShifter === false,
    'manual shifting must remain disabled');
  requireValue(config?.drivetrain?.automaticInternalGears === true,
    'rear gearing must be internal and automatic');
  requireValue(Array.isArray(config?.drivetrain?.internalGearRatios)
    && config.drivetrain.internalGearRatios.length >= 2,
  'at least two internal automatic ratios are required');
  requireValue(/aramid|kevlar/i.test(config?.drivetrain?.tensileCord ?? ''),
    'the belt tensile cord specification must be aramid/Kevlar-class');
  requireValue(config?.motor?.position === 'rear-hub',
    'the assist motor must be located in the rear hub');
  requireValue(config?.motor?.throttle === false,
    'the reference configuration is pedal-assist only');
  requireValue(config?.antiTheft?.quickRelease === false,
    'quick-release wheel retention is prohibited');
  requireValue(/single-sided/i.test(config?.antiTheft?.frontArchitecture ?? ''),
    'front wheel support must be single-sided');
  requireValue(/single-sided/i.test(config?.antiTheft?.rearArchitecture ?? ''),
    'rear wheel support must be single-sided');
  requireValue(config?.brakes?.independentHandControls >= 2,
    'two independent hand-operated brake controls are required');

  if ((config?.render?.modelScale ?? 1) > 0.25) {
    warnings.push('default render scale exceeds 1:4; accidental full-scale fabrication risk is increased');
  }
  if ((config?.motor?.assistCutoffMph ?? 0) > 20) {
    warnings.push('25 mph assist target needs jurisdiction-specific classification and control review');
  }
  if (config?.wheel?.tireMode === 'solid') {
    warnings.push('solid tires remove punctures but increase unsprung mass, impact loading, and rolling losses; validate comfort and frame fatigue');
  }
  if (Math.abs(beltPitchErrorMm(config)) > config.drivetrain.beltPitchMm) {
    warnings.push('selected belt length differs from the approximate two-pulley path by more than one pitch; revise center-distance adjustment');
  }

  return { errors, warnings, metrics: deriveMetrics(config) };
}

function assertPositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive finite number`);
  }
}
