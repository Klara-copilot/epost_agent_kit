/**
 * Command: epost-kit uninstall
 * Remove installed kit with ownership awareness
 */

import { resolve, join } from 'node:path';
import { unlink, readdir, rmdir } from 'node:fs/promises';
import { confirm } from '@inquirer/prompts';
import ora from 'ora';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { readMetadata, classifyFile } from '../core/ownership.js';
import { fileExists, dirExists } from '../core/file-system.js';
import { METADATA_FILE } from '../constants.js';
import type { UninstallOptions } from '../types/command-options.js';
import type { OwnershipTier } from '../core/ownership.js';

interface UninstallPlan {
  toRemove: string[];
  toPreserve: string[];
  modifiedFiles: string[];
}

export async function runUninstall(opts: UninstallOptions): Promise<void> {
  const projectDir = resolve(process.cwd());

  // Step 1: Read metadata
  const metadata = await readMetadata(projectDir);
  if (!metadata) {
    throw new Error('No epost-kit installation found (missing metadata)');
  }

  logger.info(`Found installation: ${pc.cyan(metadata.target)} kit`);
  logger.info(`Installed version: ${pc.cyan(metadata.kitVersion)}`);
  logger.info('');

  // Step 2: Classify all tracked files
  const spinner = ora('Analyzing files...').start();
  const plan = await createUninstallPlan(projectDir, metadata, opts);
  spinner.stop();

  // Step 3: Show uninstall plan
  logger.info(pc.bold('Uninstall Plan:'));
  logger.info(`  Will remove:  ${pc.red(plan.toRemove.length.toString())} files (epost-owned)`);
  logger.info(`  Will preserve: ${pc.yellow(plan.toPreserve.length.toString())} files (user-created)`);
  if (plan.modifiedFiles.length > 0) {
    logger.info(`  Modified:     ${pc.yellow(plan.modifiedFiles.length.toString())} files (contains user changes)`);
  }
  logger.info('');

  // Show modified files warning
  if (plan.modifiedFiles.length > 0 && !opts.force) {
    logger.warn('Modified files will be preserved (use --force to remove):');
    for (const file of plan.modifiedFiles.slice(0, 5)) {
      logger.info(`  ${pc.dim(file)}`);
    }
    if (plan.modifiedFiles.length > 5) {
      logger.info(`  ${pc.dim(`...and ${plan.modifiedFiles.length - 5} more`)}`);
    }
    logger.info('');
  }

  // Step 4: Confirm unless --yes flag
  if (!opts.yes) {
    const message = opts.force
      ? 'FORCE UNINSTALL: Remove all managed files including modified ones?'
      : 'Remove epost-kit files from project?';

    const shouldUninstall = await confirm({
      message,
      default: false,
    });

    if (!shouldUninstall) {
      logger.info('Uninstall cancelled');
      return;
    }
  }

  // Step 5: Execute removal (skip if dry-run)
  let removed = 0;
  if (!opts.dryRun) {
    const removeSpinner = ora('Removing files...').start();
    removed = await executeUninstall(projectDir, plan);
    removeSpinner.stop();

    // Step 6: Clean up empty directories
    await cleanEmptyDirs(projectDir, metadata.target);

    // Step 7: Remove metadata file last
    const metadataPath = join(projectDir, METADATA_FILE);
    if (await fileExists(metadataPath)) {
      await unlink(metadataPath);
    }
  } else {
    logger.info('\nDry-run mode - no files removed');
  }

  // Step 8: Report results
  if (!opts.dryRun) {
    logger.success('Uninstall complete');
    logger.info(`Removed: ${pc.green(removed.toString())} files`);
  } else {
    logger.info(`\nWould remove: ${pc.yellow(plan.toRemove.length.toString())} files`);
  }
  if (plan.toPreserve.length > 0) {
    logger.info(`Preserved: ${pc.yellow(plan.toPreserve.length.toString())} user files`);
  }
}

/** Create uninstall plan by classifying all tracked files */
async function createUninstallPlan(
  projectDir: string,
  metadata: { files: Record<string, unknown> },
  opts: UninstallOptions
): Promise<UninstallPlan> {
  const toRemove: string[] = [];
  const toPreserve: string[] = [];
  const modifiedFiles: string[] = [];

  for (const relativePath of Object.keys(metadata.files)) {
    const fullPath = join(projectDir, relativePath);

    // Check if file still exists
    if (!(await fileExists(fullPath))) {
      continue;
    }

    // Classify file ownership
    const tier: OwnershipTier = await classifyFile(fullPath, projectDir, metadata as Parameters<typeof classifyFile>[2]);

    if (tier === 'epost-owned') {
      toRemove.push(relativePath);
    } else if (tier === 'epost-modified') {
      modifiedFiles.push(relativePath);
      if (opts.force) {
        toRemove.push(relativePath);
      } else {
        toPreserve.push(relativePath);
      }
    } else {
      toPreserve.push(relativePath);
    }
  }

  return { toRemove, toPreserve, modifiedFiles };
}

/** Execute file removal */
async function executeUninstall(projectDir: string, plan: UninstallPlan): Promise<number> {
  let removed = 0;

  for (const relativePath of plan.toRemove) {
    const fullPath = join(projectDir, relativePath);
    try {
      await unlink(fullPath);
      removed++;
    } catch (error) {
      logger.debug(`Failed to remove ${relativePath}: ${error}`);
    }
  }

  return removed;
}

/** Clean up empty directories after file removal */
async function cleanEmptyDirs(projectDir: string, target: string): Promise<void> {
  const targetDir = join(projectDir, `.${target}`);
  if (!(await dirExists(targetDir))) {
    return;
  }

  await cleanEmptyDirsRecursive(targetDir);

  // Remove target dir if empty
  try {
    const entries = await readdir(targetDir);
    if (entries.length === 0) {
      await rmdir(targetDir);
    }
  } catch {
    // Directory not empty or doesn't exist
  }
}

/** Recursively remove empty directories */
async function cleanEmptyDirsRecursive(dir: string): Promise<void> {
  if (!(await dirExists(dir))) {
    return;
  }

  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subdir = join(dir, entry.name);
      await cleanEmptyDirsRecursive(subdir);

      // Try to remove if empty
      try {
        await rmdir(subdir);
      } catch {
        // Not empty or error
      }
    }
  }
}
