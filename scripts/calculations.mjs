#!/usr/bin/env node

export const design = Object.freeze({
  wheelDiameterMm: 660,
  cadenceRpm: 85,
  frontTeeth: 60,
  rearTeeth: 22,
  internalRatios: Object.freeze([1.0, 1.36]),
  beltPitchMm: 11,
  beltCenterDistanceMm: 438,
  selectedBeltTeeth: 123,
  motorRatedWatts: 250,
  targetAssistMph: 25,
});

export function pitchDiameterMm(teeth, pitchMm = design.beltPitchMm) {
  if (!Number.isFinite(teeth) || teeth <= 0) throw new RangeError('teeth must be positive');
  return (teeth * pitchMm) / Math.PI;
}

export function approximateOpenBeltLengthMm({
  frontTeeth = design.frontTeeth,
  rearTeeth = design.rearTeeth,
  pitchMm = design.beltPitchMm,
  centerDistanceMm = design.beltCenterDistanceMm,
} = {}) {
  const large = pitchDiameterMm(frontTeeth, pitchMm);
  const small = pitchDiameterMm(rearTeeth, pitchMm);
  const c = centerDistanceMm;
  if (!Number.isFinite(c) || c <= Math.abs(large - small) / 2) {
    throw new RangeError('center distance is too small for the selected pulleys');
  }
  return 2 * c + (Math.PI / 2) * (large + small) + ((large - small) ** 2) / (4 * c);
}

export function roadSpeedMph({
  cadenceRpm = design.cadenceRpm,
  internalRatio = 1,
  frontTeeth = design.frontTeeth,
  rearTeeth = design.rearTeeth,
  wheelDiameterMm = design.wheelDiameterMm,
} = {}) {
  const wheelCircumferenceM = Math.PI * wheelDiameterMm / 1000;
  const wheelRpm = cadenceRpm * (frontTeeth / rearTeeth) * internalRatio;
  return wheelRpm * wheelCircumferenceM * 60 / 1609.344;
}

export function selectedBeltLengthMm() {
  return design.selectedBeltTeeth * design.beltPitchMm;
}

export function summary() {
  const approximate = approximateOpenBeltLengthMm();
  const selected = selectedBeltLengthMm();
  return {
    design,
    speedsMph: design.internalRatios.map((ratio) => ({ ratio, mph: roadSpeedMph({ internalRatio: ratio }) })),
    approximateBeltLengthMm: approximate,
    selectedBeltLengthMm: selected,
    beltLengthDeltaMm: selected - approximate,
  };
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  process.stdout.write(`${JSON.stringify(summary(), null, 2)}\n`);
}
