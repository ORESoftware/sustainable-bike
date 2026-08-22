#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const targets = [
  'assembly',
  'frame',
  'front_wheel',
  'rear_wheel',
  'belt_drive',
  'rear_hub_cutaway',
  'frame_coupon',
  'tire_coupon',
  'captive_hub_coupon',
];

function commandExists(command) {
  return spawnSync(command, ['--version'], { encoding: 'utf8' }).status === 0;
}

if (!commandExists('openscad')) {
  throw new Error('OpenSCAD is required. Install openscad or run this validation in CI.');
}

const source = resolve('cad/sustainable_bike.scad');
const work = mkdtempSync(join(tmpdir(), 'sustainable-bike-cad-'));
const hashes = new Map();

try {
  for (const target of targets) {
    const output = join(work, `${target}.csg`);
    const result = spawnSync(
      'openscad',
      ['-o', output, '-D', `TARGET="${target}"`, source],
      { encoding: 'utf8', timeout: 120_000 },
    );

    if (result.status !== 0) {
      throw new Error(
        `OpenSCAD target ${target} failed\n${result.stdout ?? ''}\n${result.stderr ?? ''}`,
      );
    }

    const size = statSync(output).size;
    if (size < 100) throw new Error(`${target} produced an implausibly small ${size}-byte model`);

    const digest = createHash('sha256').update(readFileSync(output)).digest('hex');
    if (hashes.has(digest)) {
      throw new Error(`${target} duplicates ${hashes.get(digest)}; TARGET routing is broken`);
    }
    hashes.set(digest, target);
    process.stdout.write(`${target}\t${size}\t${digest}\n`);
  }

  if (hashes.size !== targets.length) {
    throw new Error(`expected ${targets.length} distinct targets, observed ${hashes.size}`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
