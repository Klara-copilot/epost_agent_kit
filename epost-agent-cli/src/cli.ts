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
  .helpOption('-h, --help', 'Display help information')
  .option('--verbose', 'Enable verbose logging')
  .option('--yes', 'Skip interactive prompts (CI mode)');

// Command: new - Create new project
program
  .command('new')
  .description('Create new project with epost-agent-kit')
  .option('--kit <name>', 'Kit template to use', 'engineer')
  .option('--dir <path>', 'Target directory')
  .action(async (opts) => {
    const { runNew } = await import('./commands/new.js');
    await runNew({ ...program.opts(), ...opts });
  });

// Command: init - Initialize in existing project
program
  .command('init')
  .description('Initialize epost-agent-kit in existing project')
  .option('--kit <name>', 'Kit template to use', 'engineer')
  .option('--fresh', 'Fresh install (ignore existing files)', false)
  .option('--dry-run', 'Preview changes without applying', false)
  .action(async (opts) => {
    const { runInit } = await import('./commands/init.js');
    await runInit({ ...program.opts(), ...opts });
  });

// Command: doctor - Verify installation
program
  .command('doctor')
  .description('Verify installation and environment health')
  .option('--fix', 'Automatically fix issues', false)
  .option('--report', 'Generate detailed report', false)
  .action(async (opts) => {
    const { runDoctor } = await import('./commands/doctor.js');
    await runDoctor({ ...program.opts(), ...opts });
  });

// Command: versions - List available versions
program
  .command('versions')
  .description('List available kit versions from GitHub')
  .option('--limit <number>', 'Max versions to display', '10')
  .option('--pre', 'Include pre-release versions', false)
  .action(async (opts) => {
    const { runVersions } = await import('./commands/versions.js');
    await runVersions({ ...program.opts(), ...opts, limit: parseInt(opts.limit || '10') });
  });

// Command: update - Update installed kit
program
  .command('update')
  .description('Update installed kit to latest version')
  .option('--check', 'Only check for updates', false)
  .action(async (opts) => {
    const { runUpdate } = await import('./commands/update.js');
    await runUpdate({ ...program.opts(), ...opts });
  });

// Command: uninstall - Remove kit
program
  .command('uninstall')
  .description('Remove installed kit from project')
  .option('--keep-custom', 'Keep user-modified files', false)
  .option('--force', 'Force removal without confirmation', false)
  .action(async (opts) => {
    const { runUninstall } = await import('./commands/uninstall.js');
    await runUninstall({ ...program.opts(), ...opts });
  });

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
});

program.parse(process.argv);
