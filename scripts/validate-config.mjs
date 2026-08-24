import fs from 'node:fs/promises';
import process from 'node:process';
import { compareDesigns, validateBikeConfig } from '../src/calculations.mjs';

const years = [2026, 2027];
const configs = new Map();
let failed = false;

for (const year of years) {
  const url = new URL(`../config/designs/${year}.json`, import.meta.url);
  const config = JSON.parse(await fs.readFile(url, 'utf8'));
  configs.set(year, config);
  const result = validateBikeConfig(config);

  for (const warning of result.warnings) console.warn(`${year} warning: ${warning}`);
  if (result.errors.length > 0) {
    failed = true;
    for (const error of result.errors) console.error(`${year} error: ${error}`);
  } else {
    console.log(JSON.stringify({ year, status: 'valid', metrics: result.metrics }, null, 2));
  }
}

const alias = JSON.parse(await fs.readFile(new URL('../config/bike.json', import.meta.url), 'utf8'));
if (JSON.stringify(alias) !== JSON.stringify(configs.get(2026))) {
  failed = true;
  console.error('config/bike.json must remain an exact compatibility copy of config/designs/2026.json');
}

const comparison = compareDesigns(configs.get(2026), configs.get(2027));
if (comparison.errors.length > 0) {
  failed = true;
  for (const error of comparison.errors) console.error(`comparison error: ${error}`);
} else {
  console.log(JSON.stringify({ status: 'year-over-year-valid', deltas: comparison.deltas }, null, 2));
}

if (failed) process.exitCode = 1;
