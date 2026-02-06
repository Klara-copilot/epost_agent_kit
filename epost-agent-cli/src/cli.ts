#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJsonPath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const program = new Command()
  .name('epost-kit')
  .description('Distribution CLI for epost-agent-kit framework')
  .version(packageJson.version, '-v, --version', 'Display version')
  .helpOption('-h, --help', 'Display help information');

// Placeholder for commands (will be added in Phase 03)
program.parse(process.argv);
