/**
 * Integration tests for uninstall command
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runUninstall } from '../../src/commands/uninstall.js';
import { createTestProject } from '../helpers/temp-project.js';
import { fileExists } from '../../src/core/file-system.js';
import { hashString } from '../../src/core/checksum.js';
import type { Metadata } from '../../src/types/index.js';

describe('Uninstall Command Integration', () => {
  let projectDir: string;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const project = await createTestProject({ withMetadata: true });
    projectDir = project.dir;
    cleanup = project.cleanup;

    process.chdir(projectDir);
  });

  afterEach(async () => {
    await cleanup();
  });

  it('should remove only epost-owned files', async () => {
    // Create unmodified file
    const ownedPath = join(projectDir, '.claude', 'agents', 'test-agent.md');
    const ownedContent = '# Test Agent\n\nTest agent description';
    await writeFile(ownedPath, ownedContent, 'utf-8');

    // Update metadata with correct checksum
    const metadataPath = join(projectDir, '.epost-metadata.json');
    const metadata: Metadata = {
      cliVersion: '0.1.0',
      target: 'claude',
      kitVersion: '1.0.0',
      installedAt: new Date().toISOString(),
      files: {
        '.claude/agents/test-agent.md': {
          checksum: hashString(ownedContent),
          size: ownedContent.length,
          createdAt: new Date().toISOString(),
        },
      },
    };
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

    await runUninstall({
      force: false,
      dryRun: false,
      yes: true,
    });

    // Owned file should be removed
    const ownedExists = await fileExists(ownedPath);
    expect(ownedExists).toBe(false);

    // Metadata should be removed
    const metadataExists = await fileExists(metadataPath);
    expect(metadataExists).toBe(false);
  });

  it('should preserve modified files by default', async () => {
    // Create modified file
    const modifiedPath = join(projectDir, '.claude', 'agents', 'modified-agent.md');
    const modifiedContent = '# Modified Agent\n\nUser modifications';
    await writeFile(modifiedPath, modifiedContent, 'utf-8');

    // Update metadata with different checksum
    const metadataPath = join(projectDir, '.epost-metadata.json');
    const metadata: Metadata = {
      cliVersion: '0.1.0',
      target: 'claude',
      kitVersion: '1.0.0',
      installedAt: new Date().toISOString(),
      files: {
        '.claude/agents/modified-agent.md': {
          checksum: hashString('original content'),
          size: 100,
          createdAt: new Date().toISOString(),
        },
      },
    };
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

    await runUninstall({
      force: false,
      dryRun: false,
      yes: true,
    });

    // Modified file should be preserved
    const modifiedExists = await fileExists(modifiedPath);
    expect(modifiedExists).toBe(true);
  });

  it('should remove all files with --force', async () => {
    // Create modified file
    const modifiedPath = join(projectDir, '.claude', 'agents', 'modified-agent.md');
    const modifiedContent = '# Modified Agent\n\nUser modifications';
    await writeFile(modifiedPath, modifiedContent, 'utf-8');

    // Update metadata
    const metadataPath = join(projectDir, '.epost-metadata.json');
    const metadata: Metadata = {
      cliVersion: '0.1.0',
      target: 'claude',
      kitVersion: '1.0.0',
      installedAt: new Date().toISOString(),
      files: {
        '.claude/agents/modified-agent.md': {
          checksum: hashString('original content'),
          size: 100,
          createdAt: new Date().toISOString(),
        },
      },
    };
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

    await runUninstall({
      force: true,
      dryRun: false,
      yes: true,
    });

    // File should be removed with --force
    const modifiedExists = await fileExists(modifiedPath);
    expect(modifiedExists).toBe(false);
  });

  it('should handle dry-run mode', async () => {
    const ownedPath = join(projectDir, '.claude', 'agents', 'test-agent.md');
    const ownedContent = '# Test Agent\n\nTest agent description';
    await writeFile(ownedPath, ownedContent, 'utf-8');

    // Update metadata
    const metadataPath = join(projectDir, '.epost-metadata.json');
    const metadata: Metadata = {
      cliVersion: '0.1.0',
      target: 'claude',
      kitVersion: '1.0.0',
      installedAt: new Date().toISOString(),
      files: {
        '.claude/agents/test-agent.md': {
          checksum: hashString(ownedContent),
          size: ownedContent.length,
          createdAt: new Date().toISOString(),
        },
      },
    };
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

    await runUninstall({
      force: false,
      dryRun: true,
      yes: true,
    });

    // Files should still exist in dry-run
    const ownedExists = await fileExists(ownedPath);
    expect(ownedExists).toBe(true);

    const metadataExists = await fileExists(metadataPath);
    expect(metadataExists).toBe(true);
  });
});
