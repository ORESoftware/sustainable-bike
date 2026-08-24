import fs from 'node:fs/promises';
import { compareDesigns } from '../src/calculations.mjs';

const read = async (year) => JSON.parse(await fs.readFile(new URL(`../config/designs/${year}.json`, import.meta.url), 'utf8'));
const comparison = compareDesigns(await read(2026), await read(2027));
console.log(JSON.stringify(comparison, null, 2));
if (comparison.errors.length > 0) process.exitCode = 1;
