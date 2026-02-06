/**
 * Command: epost-kit init
 * Initialize epost-agent-kit in existing project
 */

import { join, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { select, confirm } from '@inquirer/prompts';
import ora from 'ora';
import { logger } from '../core/logger.js';
import { fileExists, dirExists } from '../core/file-system.js';
import { readMetadata, writeMetadata, generateMetadata } from '../core/ownership.js';
import { downloadKit, getKitFiles } from '../core/template-manager.js';
import { classifyFiles, planMerge, executeMerge, previewMerge } from '../core/smart-merge.js';
import { createBackup } from '../core/backup-manager.js';
import { hashFile } from '../core/checksum.js';
import { tmpdir } from 'node:os';
import { rm, mkdir } from 'node:fs/promises';
import type { InitOptions } from '../types/command-options.js';
import type { FileOwnership } from '../types/index.js';

export async function runInit(opts: InitOptions): Promise<void> {
  const projectDir = resolve(process.cwd());

  // Step 1: Validate project directory
  const hasPackageJson = await fileExists(join(projectDir, 'package.json'));
  const hasGit = await dirExists(join(projectDir, '.git'));

  if (!hasPackageJson && !hasGit) {
    throw new Error('No project detected (missing package.json or .git)');
  }

  // Step 2: Check for existing installation
  let metadata = await readMetadata(projectDir);

  // Step 3: Check for ClaudeKit migration
  const claudekitMetadata = join(projectDir, '.claude', 'metadata.json');
  if (!metadata && (await fileExists(claudekitMetadata))) {
    logger.info('ClaudeKit installation detected');

    // Read ClaudeKit metadata to check version
    try {
      const content = await readFile(claudekitMetadata, 'utf-8');
      const ckMeta = JSON.parse(content);

      if (ckMeta.name === 'claudekit-engineer') {
        logger.info('ClaudeKit Engineer kit detected - migration available');

        // Prompt for IDE target selection (REQUIRED for validation)
        let migrationTarget: 'claude' | 'cursor' | 'github-copilot' = 'claude';
        if (!opts.yes) {
          migrationTarget = await select({
            message: 'Select epost-agent-kit target for migration:',
            choices: [
              { name: 'Claude Code', value: 'claude' as const },
              { name: 'Cursor (not yet supported)', value: 'cursor' as const, disabled: true },
              { name: 'GitHub Copilot (not yet supported)', value: 'github-copilot' as const, disabled: true },
            ],
            default: 'claude' as const,
          });
        }

        logger.info(`Migration target: ${migrationTarget}`);
        logger.info('Note: Currently only Claude Code migration is supported for v1');

        // Treat as fresh install with selected target
        metadata = null;
      }
    } catch (error) {
      logger.debug(`Failed to read ClaudeKit metadata: ${error}`);
    }
  }

  // Step 4: Determine installation mode
  const isUpdate = !!metadata;
  const isFresh = opts.fresh || !metadata;

  if (isUpdate && !isFresh) {
    logger.info('Updating existing installation');
  } else {
    logger.info('Fresh installation');
  }

  // Step 5: Select target for new installation
  let target: 'claude' | 'cursor' | 'github-copilot' = metadata?.target || 'claude';
  if (!metadata && !opts.yes) {
    target = await select({
      message: 'Select IDE target:',
      choices: [
        { name: 'Claude Code', value: 'claude' as const },
        { name: 'Cursor', value: 'cursor' as const },
        { name: 'GitHub Copilot', value: 'github-copilot' as const },
      ],
      default: 'claude' as const,
    });
  }

  // Step 6: Download kit to temp directory
  const spinner = ora('Downloading kit template...').start();
  const tempDir = join(tmpdir(), `epost-kit-${Date.now()}`);

  try {
    await mkdir(tempDir, { recursive: true });
    await downloadKit(opts.kit || 'engineer', 'latest', tempDir);
    spinner.succeed('Kit downloaded');
  } catch (error) {
    spinner.fail('Download failed');
    await rm(tempDir, { recursive: true, force: true });
    throw error;
  }

  try {
    // Step 7: Classify files and plan merge
    spinner.start('Analyzing project files...');
    const kitFiles = await getKitFiles(tempDir);
    const classification = await classifyFiles(projectDir, kitFiles, metadata);
    const plan = planMerge(classification);
    spinner.succeed('Analysis complete');

    // Step 8: Dry-run preview
    if (opts.dryRun) {
      logger.info('\n' + previewMerge(plan));
      logger.info('\nDry-run mode - no changes made');
      await rm(tempDir, { recursive: true, force: true });
      return;
    }

    // Step 9: Show merge plan
    logger.info('\n' + previewMerge(plan));

    // Step 10: Handle conflicts
    const conflictResolutions = new Map<string, 'keep' | 'overwrite'>();
    if (plan.summary.conflict > 0 && !opts.yes) {
      logger.info('\nConflicts detected - requires manual resolution:');

      for (const [file, action] of plan.actions) {
        if (action === 'conflict') {
          const resolution = await select({
            message: `Resolve conflict: ${file}`,
            choices: [
              { name: 'Keep current version (skip update)', value: 'keep' as const },
              { name: 'Use new version (overwrite)', value: 'overwrite' as const },
            ],
          });
          conflictResolutions.set(file, resolution as 'keep' | 'overwrite');
        }
      }
    } else if (plan.summary.conflict > 0 && opts.yes) {
      // Auto-resolve: keep user modifications
      for (const [file, action] of plan.actions) {
        if (action === 'conflict') {
          conflictResolutions.set(file, 'keep');
        }
      }
      logger.info('Auto-resolved conflicts (keeping user modifications)');
    }

    // Step 11: Confirm before applying changes
    if (!opts.yes) {
      const proceed = await confirm({
        message: 'Apply changes?',
        default: true,
      });

      if (!proceed) {
        logger.info('Cancelled');
        await rm(tempDir, { recursive: true, force: true });
        return;
      }
    }

    // Step 12: Create backup
    if (metadata) {
      spinner.start('Creating backup...');
      await createBackup(projectDir, 'pre-update');
      spinner.succeed('Backup created');
    }

    // Step 13: Execute merge
    spinner.start('Applying changes...');
    await executeMerge(plan, tempDir, projectDir, { resolveConflicts: conflictResolutions });
    spinner.succeed('Changes applied');

    // Step 14: Update metadata
    spinner.start('Updating metadata...');
    const files: Record<string, FileOwnership> = {};

    for (const relativePath of kitFiles) {
      const fullPath = join(projectDir, relativePath);
      if (await fileExists(fullPath)) {
        const checksum = await hashFile(fullPath);
        files[relativePath] = {
          path: relativePath,
          checksum,
          installedAt: metadata?.files[relativePath]?.installedAt || new Date().toISOString(),
          version: 'latest',
          modified: false,
        };
      }
    }

    const newMetadata = generateMetadata('0.1.0', target, 'latest', files);
    await writeMetadata(projectDir, newMetadata);
    spinner.succeed('Metadata updated');

    // Step 15: Success message
    logger.info('\n✓ Installation complete!');
    logger.info(`\nSummary:`);
    logger.info(`  Created: ${plan.summary.create} file(s)`);
    logger.info(`  Updated: ${plan.summary.overwrite} file(s)`);
    logger.info(`  Skipped: ${plan.summary.skip} file(s)`);
    if (plan.summary.conflict > 0) {
      logger.info(`  Conflicts: ${plan.summary.conflict} file(s)`);
    }
  } finally {
    // Clean up temp directory
    await rm(tempDir, { recursive: true, force: true });
  }
}
