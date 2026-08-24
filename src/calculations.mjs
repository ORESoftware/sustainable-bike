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
  const ratios = [...config.drivetrain.internalGearRatios].sort((left, right) => left - right);
  const speedBase = {
    cadenceRpm: config.drivetrain.nominalCadenceRpm,
    frontTeeth: config.drivetrain.frontTeeth,
    rearTeeth: config.drivetrain.rearTeeth,
    outsideDiameterMm: config.wheel.outsideDiameterMm,
  };
  const gearSpeedsMphAtNominalCadence = ratios.map((internalRatio) => roadSpeedMph({
    ...speedBase,
    internalRatio,
  }));
  const publicMode = assistEnvelope(config, config.motor.publicRoadAssistCutoffMph);
  const privateTestMode = assistEnvelope(config, config.motor.privateTestAssistCutoffMph);

  return {
    designYear: config.designYear,
    designProfile: config.designProfile,
    wheelCircumferenceMm: wheelCircumferenceMm(config.wheel.outsideDiameterMm),
    gearSpeedsMphAtNominalCadence,
    lowGearSpeedMphAtNominalCadence: gearSpeedsMphAtNominalCadence.at(0),
    highGearSpeedMphAtNominalCadence: gearSpeedsMphAtNominalCadence.at(-1),
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

export function compareDesigns(baseline, successor) {
  const baselineMetrics = deriveMetrics(baseline);
  const successorMetrics = deriveMetrics(successor);
  const errors = [];

  if (successor.designYear <= baseline.designYear) errors.push('successor year must be later than baseline year');
  if (successor.drivetrain.internalGearRatios.length <= baseline.drivetrain.internalGearRatios.length) {
    errors.push('successor must add an automatic internal ratio');
  }
  if (successor.battery.capacityWh <= baseline.battery.capacityWh) {
    errors.push('successor battery capacity must increase');
  }
  if (successor.sustainability.disassemblyTargetMinutes >= baseline.sustainability.disassemblyTargetMinutes) {
    errors.push('successor disassembly time must improve');
  }
  if (successor.sustainability.recycledContentTargetPercent <= baseline.sustainability.recycledContentTargetPercent) {
    errors.push('successor recycled-content target must increase');
  }
  if (successorMetrics.privateTestMode.continuousMechanicalMarginW
      <= baselineMetrics.privateTestMode.continuousMechanicalMarginW) {
    errors.push('successor 25 mph ideal-condition power margin must improve');
  }
  if (successorMetrics.privateTestMode.estimatedRangeMiles
      <= baselineMetrics.privateTestMode.estimatedRangeMiles) {
    errors.push('successor idealized 25 mph range must improve');
  }

  return {
    errors,
    baseline: baselineMetrics,
    successor: successorMetrics,
    deltas: {
      gearCount: successor.drivetrain.internalGearRatios.length
        - baseline.drivetrain.internalGearRatios.length,
      batteryWh: successor.battery.capacityWh - baseline.battery.capacityWh,
      disassemblyMinutes: successor.sustainability.disassemblyTargetMinutes
        - baseline.sustainability.disassemblyTargetMinutes,
      recycledContentPercent: successor.sustainability.recycledContentTargetPercent
        - baseline.sustainability.recycledContentTargetPercent,
      privatePowerMarginW: successorMetrics.privateTestMode.continuousMechanicalMarginW
        - baselineMetrics.privateTestMode.continuousMechanicalMarginW,
      privateRangeMiles: successorMetrics.privateTestMode.estimatedRangeMiles
        - baselineMetrics.privateTestMode.estimatedRangeMiles,
    },
  };
}

export function validateBikeConfig(config) {
  const errors = [];
  const warnings = [];

  const requireValue = (condition, message) => {
    if (!condition) errors.push(message);
  };

  requireValue(config?.schemaVersion === 2, 'schemaVersion must be 2');
  requireValue(config?.designYear === 2026 || config?.designYear === 2027,
    'designYear must be 2026 or 2027');
  requireValue(typeof config?.designProfile === 'string' && config.designProfile.length > 0,
    'designProfile is required');
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
  requireValue(config?.drivetrain?.shiftControl?.riderOperatedControl === false,
    'the rider must not operate a gear shifter');
  requireValue(/automatic/i.test(config?.drivetrain?.shiftControl?.mode ?? ''),
    'shift control must be fully automatic');
  requireValue(Array.isArray(config?.drivetrain?.internalGearRatios)
    && config.drivetrain.internalGearRatios.length >= 2,
  'at least two internal automatic ratios are required');
  requireValue(/aramid|kevlar/i.test(config?.drivetrain?.tensileCord ?? ''),
    'the belt tensile cord specification must be aramid/Kevlar-class');
  requireValue(['solid', 'airless_lattice'].includes(config?.wheel?.tireMode),
    'tireMode must be solid or airless_lattice');
  requireValue(config?.sustainability?.replaceableTreadOrTire === true,
    'the tire or tread must be service-replaceable');
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
  requireValue(config?.motor?.activeThermalDerating === true,
    'active motor/controller thermal derating is required');
  requireValue(config?.motor?.redundantWheelSpeedSensor === true,
    'redundant wheel-speed sensing is required');
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
  requireValue(config?.battery?.chargeInterlockRequired === true,
    'a charge interlock is required');
  requireValue(config?.battery?.ingressDetectionRequired === true,
    'battery ingress detection is required');
  requireValue(config?.validation?.riderTestingPermitted === false,
    'rider testing must remain prohibited in the research configuration');
  requireValue(Array.isArray(config?.validation?.requiredBeforeRiderTesting)
    && config.validation.requiredBeforeRiderTesting.length >= 9,
  'at least nine explicit rider-test release gates are required');

  if (config?.designYear === 2027) {
    requireValue(config?.drivetrain?.internalGearRatios?.length >= 3,
      'the 2027 profile requires at least three automatic internal ratios');
    requireValue(config?.wheel?.tireMode === 'airless_lattice',
      'the 2027 profile requires the serviceable airless-lattice tire');
    requireValue(config?.battery?.serviceModuleCount >= 2,
      'the 2027 profile requires at least two independently serviceable battery modules');
    requireValue(config?.sustainability?.disassemblyTargetMinutes <= 45,
      'the 2027 profile requires a 45-minute-or-better disassembly target');
    requireValue(config?.sustainability?.recycledContentTargetPercent >= 45,
      'the 2027 profile requires at least 45 percent recycled-content target');
  }

  if ((config?.render?.modelScale ?? 1) > 0.25) {
    warnings.push('default render scale exceeds 1:4; accidental full-scale fabrication risk is increased');
  }
  if ((config?.motor?.privateTestAssistCutoffMph ?? 0) > 20) {
    warnings.push('25 mph mode is a private-course engineering target, not a universal public-road setting');
  }
  if (config?.wheel?.tireMode === 'solid') {
    warnings.push('solid tires remove punctures but increase unsprung mass, impact loading, and rolling losses; validate comfort and frame fatigue');
  }
  if (config?.wheel?.tireMode === 'airless_lattice') {
    warnings.push('airless lattice geometry requires heat-build-up, debris-ingress, tread-retention, impact, and fatigue qualification');
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
