const MM_PER_MILE = 1_609_344;
const MPH_TO_MPS = 0.44704;
const STANDARD_GRAVITY_M_S2 = 9.80665;

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

/**
 * Estimate steady-state flat-road power at the tire contact patch.
 *
 * This intentionally excludes acceleration, grades, headwinds, bearing losses,
 * tire hysteresis changes with temperature, and controller derating. It is a
 * design sanity check, not a guaranteed top-speed prediction.
 */
export function flatRoadPowerW({
  speedMph,
  totalMassKg,
  dragAreaM2,
  rollingResistanceCoefficient,
  airDensityKgM3 = 1.225,
}) {
  for (const [name, value] of Object.entries({
    speedMph,
    totalMassKg,
    dragAreaM2,
    airDensityKgM3,
  })) {
    assertPositive(value, name);
  }
  assertNonNegative(rollingResistanceCoefficient, 'rollingResistanceCoefficient');

  const speedMps = speedMph * MPH_TO_MPS;
  const aerodynamicPowerW = 0.5 * airDensityKgM3 * dragAreaM2 * speedMps ** 3;
  const rollingPowerW = totalMassKg
    * STANDARD_GRAVITY_M_S2
    * rollingResistanceCoefficient
    * speedMps;

  return {
    speedMph,
    speedMps,
    aerodynamicPowerW,
    rollingPowerW,
    mechanicalPowerW: aerodynamicPowerW + rollingPowerW,
  };
}

export function assistEnvelope(config, speedMph) {
  const model = config.performanceModel;
  const load = flatRoadPowerW({
    speedMph,
    totalMassKg: model.totalMassKg,
    dragAreaM2: model.dragAreaM2,
    rollingResistanceCoefficient: model.rollingResistanceCoefficient,
    airDensityKgM3: model.airDensityKgM3,
  });

  const motorMechanicalContinuousW = config.motor.ratedPowerW * model.motorSystemEfficiency;
  const combinedMechanicalContinuousW = motorMechanicalContinuousW
    + model.riderContinuousContributionW;
  const motorMechanicalDemandW = Math.max(
    0,
    load.mechanicalPowerW - model.riderContinuousContributionW,
  );
  const motorElectricalDemandW = motorMechanicalDemandW / model.motorSystemEfficiency;
  const usableBatteryWh = config.battery.capacityWh * config.battery.usableFraction;
  const estimatedRangeMiles = motorElectricalDemandW === 0
    ? Number.POSITIVE_INFINITY
    : usableBatteryWh / motorElectricalDemandW * speedMph;

  return {
    ...load,
    motorMechanicalContinuousW,
    combinedMechanicalContinuousW,
    continuousMechanicalMarginW: combinedMechanicalContinuousW - load.mechanicalPowerW,
    motorElectricalDemandW,
    estimatedRangeMiles,
  };
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
  const publicMode = assistEnvelope(config, config.motor.publicRoadAssistCutoffMph);
  const privateTestMode = assistEnvelope(config, config.motor.privateTestAssistCutoffMph);

  return {
    wheelCircumferenceMm: wheelCircumferenceMm(config.wheel.outsideDiameterMm),
    lowGearSpeedMphAtNominalCadence: roadSpeedMph({ ...speedBase, internalRatio: lowRatio }),
    highGearSpeedMphAtNominalCadence: roadSpeedMph({ ...speedBase, internalRatio: highRatio }),
    wheelRpmAtPublicRoadCutoff: wheelRpmAtMph({
      speedMph: config.motor.publicRoadAssistCutoffMph,
      outsideDiameterMm: config.wheel.outsideDiameterMm,
    }),
    wheelRpmAtPrivateTestCutoff: wheelRpmAtMph({
      speedMph: config.motor.privateTestAssistCutoffMph,
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
    publicMode: compactEnvelope(publicMode),
    privateTestMode: compactEnvelope(privateTestMode),
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
  requireValue(config?.motor?.privateTestModeDefaultEnabled === false,
    'the private 25 mph test mode must remain disabled by default');
  requireValue(Number.isFinite(config?.motor?.publicRoadAssistCutoffMph)
    && config.motor.publicRoadAssistCutoffMph > 0
    && config.motor.publicRoadAssistCutoffMph < 20,
  'the public-road-oriented motor cutoff must be greater than 0 and below 20 mph');
  requireValue(Number.isFinite(config?.motor?.privateTestAssistCutoffMph)
    && config.motor.privateTestAssistCutoffMph >= config.motor.publicRoadAssistCutoffMph
    && config.motor.privateTestAssistCutoffMph <= 25,
  'the private-course test cutoff must be between the public cutoff and 25 mph');
  requireValue(Number.isFinite(config?.motor?.ratedPowerW)
    && config.motor.ratedPowerW > 0
    && config.motor.ratedPowerW < 750,
  'rated motor power must be positive and below 750 W in this reference configuration');
  requireValue(Number.isFinite(config?.motor?.peakPowerW)
    && config.motor.peakPowerW >= config.motor.ratedPowerW
    && config.motor.peakPowerW < 750,
  'peak motor power must be at least rated power and below 750 W');
  requireValue(config?.motor?.dualBrakeCutoff === true,
    'both brake controls must independently cut motor torque');
  requireValue(config?.motor?.motorTemperatureSensor === true,
    'the rear hub motor requires temperature sensing');
  requireValue(config?.motor?.controllerTemperatureSensor === true,
    'the motor controller requires temperature sensing');
  requireValue(config?.antiTheft?.quickRelease === false,
    'quick-release wheel retention is prohibited');
  requireValue(config?.antiTheft?.ordinaryExternalAxleHardware === false,
    'ordinary externally accessible axle hardware is prohibited');
  requireValue(/single-sided/i.test(config?.antiTheft?.frontArchitecture ?? ''),
    'front wheel support must be single-sided');
  requireValue(/single-sided/i.test(config?.antiTheft?.rearArchitecture ?? ''),
    'rear wheel support must be single-sided');
  requireValue(config?.brakes?.independentHandControls >= 2,
    'two independent hand-operated brake controls are required');
  requireValue(config?.battery?.bmsRequired === true,
    'a battery-management system is required');
  requireValue(config?.battery?.cellLevelFusingRequired === true,
    'cell-level fusing is required');
  requireValue(config?.validation?.riderTestingPermitted === false,
    'rider testing must remain prohibited in the research configuration');
  requireValue(Array.isArray(config?.validation?.requiredBeforeRiderTesting)
    && config.validation.requiredBeforeRiderTesting.length >= 8,
  'at least eight explicit rider-test release gates are required');

  if ((config?.render?.modelScale ?? 1) > 0.25) {
    warnings.push('default render scale exceeds 1:4; accidental full-scale fabrication risk is increased');
  }
  if ((config?.motor?.privateTestAssistCutoffMph ?? 0) > 20) {
    warnings.push('25 mph mode is a private-course engineering target, not a universal public-road setting');
  }
  if (config?.wheel?.tireMode === 'solid') {
    warnings.push('solid tires remove punctures but increase unsprung mass, impact loading, and rolling losses; validate comfort and frame fatigue');
  }
  try {
    if (Math.abs(beltPitchErrorMm(config)) > config.drivetrain.beltPitchMm) {
      warnings.push('selected belt length differs from the approximate two-pulley path by more than one pitch; revise center-distance adjustment');
    }
  } catch (error) {
    errors.push(`belt geometry is invalid: ${error.message}`);
  }

  let metrics = null;
  try {
    metrics = deriveMetrics(config);
    if (metrics.privateTestMode.continuousMechanicalMarginW < 0) {
      warnings.push('the modeled 25 mph flat-road load exceeds rated motor-plus-rider continuous mechanical power');
    }
    if (metrics.privateTestMode.continuousMechanicalMarginW < 25) {
      warnings.push('the modeled 25 mph continuous-power margin is narrow; wind, grade, tire heat, or derating will reduce speed');
    }
  } catch (error) {
    errors.push(`performance model is invalid: ${error.message}`);
  }

  return { errors, warnings, metrics };
}

function compactEnvelope(envelope) {
  return {
    speedMph: envelope.speedMph,
    aerodynamicPowerW: envelope.aerodynamicPowerW,
    rollingPowerW: envelope.rollingPowerW,
    mechanicalPowerW: envelope.mechanicalPowerW,
    motorMechanicalContinuousW: envelope.motorMechanicalContinuousW,
    combinedMechanicalContinuousW: envelope.combinedMechanicalContinuousW,
    continuousMechanicalMarginW: envelope.continuousMechanicalMarginW,
    motorElectricalDemandW: envelope.motorElectricalDemandW,
    estimatedRangeMiles: envelope.estimatedRangeMiles,
  };
}

function assertPositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive finite number`);
  }
}

function assertNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative finite number`);
  }
}
