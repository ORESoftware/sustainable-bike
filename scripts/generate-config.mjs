import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveMetrics, validateBikeConfig } from '../src/calculations.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const configPath = path.join(root, 'config', 'bike.json');
const outputPath = path.join(root, 'cad', 'generated', 'config.scad');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const validation = validateBikeConfig(config);

if (validation.errors.length > 0) {
  throw new Error(`invalid bike config:\n- ${validation.errors.join('\n- ')}`);
}

const q = (value) => JSON.stringify(value);
const n = (value) => Number(value).toFixed(6).replace(/\.?0+$/, '');
const a = (values) => `[${values.map(n).join(', ')}]`;
const metrics = deriveMetrics(config);

const scad = `// Generated from config/bike.json. Do not edit by hand.\n`
  + `BIKE_NAME = ${q(config.name)};\n`
  + `CONFIG_STATUS = ${q(config.status)};\n`
  + `CONFIG_MODEL_SCALE = ${n(config.render.modelScale)};\n`
  + `CONFIG_FACET_COUNT = ${n(config.render.facetCount)};\n`
  + `DEFAULT_PART = ${q(config.render.defaultPart)};\n`
  + `WHEELBASE = ${n(config.geometry.wheelbaseMm)};\n`
  + `REAR_CENTER_X = ${n(config.geometry.rearCenterXmm)};\n`
  + `CHAINSTAY = ${n(config.geometry.chainstayMm)};\n`
  + `BB_HEIGHT = ${n(config.geometry.bottomBracketHeightMm)};\n`
  + `SEAT_TOP_X = ${n(config.geometry.seatTubeTopXmm)};\n`
  + `SEAT_TOP_Z = ${n(config.geometry.seatTubeTopZmm)};\n`
  + `HEAD_BOTTOM_X = ${n(config.geometry.headBottomXmm)};\n`
  + `HEAD_BOTTOM_Z = ${n(config.geometry.headBottomZmm)};\n`
  + `HEAD_TOP_X = ${n(config.geometry.headTopXmm)};\n`
  + `HEAD_TOP_Z = ${n(config.geometry.headTopZmm)};\n`
  + `SINGLE_SIDE_OFFSET = ${n(config.geometry.singleSideOffsetMm)};\n`
  + `FRAME_OUTER_RADIUS = ${n(config.geometry.frameOuterRadiusMm)};\n`
  + `FRAME_WALL = ${n(config.geometry.frameWallMm)};\n`
  + `WHEEL_BSD = ${n(config.wheel.isoBeadSeatDiameterMm)};\n`
  + `TIRE_WIDTH = ${n(config.wheel.tireWidthMm)};\n`
  + `WHEEL_OUTSIDE_DIAMETER = ${n(config.wheel.outsideDiameterMm)};\n`
  + `RIM_SECTION_RADIUS = ${n(config.wheel.rimSectionRadiusMm)};\n`
  + `SPOKE_COUNT = ${n(config.wheel.spokeCount)};\n`
  + `SPOKE_WIDTH = ${n(config.wheel.spokeWidthMm)};\n`
  + `TIRE_MODE = ${q(config.wheel.tireMode)};\n`
  + `FRONT_HUB_RADIUS = ${n(config.wheel.frontHubRadiusMm)};\n`
  + `REAR_HUB_RADIUS = ${n(config.wheel.rearHubRadiusMm)};\n`
  + `HUB_WIDTH = ${n(config.wheel.hubWidthMm)};\n`
  + `FRONT_TEETH = ${n(config.drivetrain.frontTeeth)};\n`
  + `REAR_TEETH = ${n(config.drivetrain.rearTeeth)};\n`
  + `BELT_PITCH = ${n(config.drivetrain.beltPitchMm)};\n`
  + `BELT_WIDTH = ${n(config.drivetrain.beltWidthMm)};\n`
  + `BELT_TEETH = ${n(config.drivetrain.beltTeeth)};\n`
  + `INTERNAL_GEAR_RATIOS = ${a(config.drivetrain.internalGearRatios)};\n`
  + `NOMINAL_CADENCE_RPM = ${n(config.drivetrain.nominalCadenceRpm)};\n`
  + `MOTOR_RATED_POWER_W = ${n(config.motor.ratedPowerW)};\n`
  + `MOTOR_PEAK_POWER_W = ${n(config.motor.peakPowerW)};\n`
  + `MOTOR_VOLTAGE_V = ${n(config.motor.nominalVoltageV)};\n`
  + `ASSIST_CUTOFF_MPH = ${n(config.motor.assistCutoffMph)};\n`
  + `BATTERY_CAPACITY_WH = ${n(config.battery.capacityWh)};\n`
  + `FRONT_ROTOR_DIAMETER = ${n(config.brakes.frontRotorMm)};\n`
  + `REAR_ROTOR_DIAMETER = ${n(config.brakes.rearRotorMm)};\n`
  + `DERIVED_LOW_SPEED_MPH = ${n(metrics.lowGearSpeedMphAtNominalCadence)};\n`
  + `DERIVED_HIGH_SPEED_MPH = ${n(metrics.highGearSpeedMphAtNominalCadence)};\n`
  + `DERIVED_WHEEL_RPM_AT_CUTOFF = ${n(metrics.wheelRpmAtAssistCutoff)};\n`
  + `DERIVED_BELT_PATH_MM = ${n(metrics.approximateBeltLengthMm)};\n`
  + `DERIVED_BELT_ERROR_MM = ${n(metrics.beltPitchErrorMm)};\n`;

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, scad, 'utf8');
console.log(`generated ${path.relative(root, outputPath)}`);
