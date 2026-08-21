import fs from 'node:fs/promises';
import process from 'node:process';
import { validateBikeConfig } from '../src/calculations.mjs';

const configUrl = new URL('../config/bike.json', import.meta.url);
const config = JSON.parse(await fs.readFile(configUrl, 'utf8'));
const result = validateBikeConfig(config);

for (const warning of result.warnings) {
  console.warn(`warning: ${warning}`);
}

if (result.errors.length > 0) {
  for (const error of result.errors) console.error(`error: ${error}`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: 'valid', metrics: result.metrics }, null, 2));
}
