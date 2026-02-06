/**
 * Integration tests for init command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFile, cp } from 'node:fs/promises';
import { join } from 'node:path';
import { runInit } from '../../src/commands/init.js';
import { createTestProject, createTestKit } from '../helpers/temp-project.js';
import { fileExists } from '../../src/core/file-system.js';

// Mock template-manager to avoid GitHub API calls
vi.mock('../../src/core/template-manager.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/core/template-manager.js')>('../../src/core/template-manager.js');
  const { cp } = await import('node:fs/promises');
  const { join: pathJoin, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');

  return {
    ...actual,
    downloadKit: async (_kit: string, _version: string, destPath: string) => {
      // Use local test kit instead of downloading from GitHub
      const currentFile = fileURLToPath(import.meta.url);
      const projectRoot = pathJoin(dirname(currentFile), '../..');
      const fixtureDir = pathJoin(projectRoot, 'fixtures', 'sample-kit');
      await cp(fixtureDir, destPath, { recursive: true });
    },
  };
});

describe('Init Command Integration', () => {
  let projectDir: string;
  let kitDir: string;
  let projectCleanup: () => Promise<void>;
  let kitCleanup: () => Promise<void>;

  beforeEach(async () => {
    const project = await createTestProject({ withMetadata: false });
    projectDir = project.dir;
    projectCleanup = project.cleanup;

    const kit = await createTestKit();
    kitDir = kit.dir;
    kitCleanup = kit.cleanup;

    process.chdir(projectDir);
  });

  afterEach(async () => {
    await projectCleanup();
    await kitCleanup();
  });

  it('should initialize project with kit files', async () => {
    await runInit({
      kit: kitDir,
      dryRun: false,
      fresh: false,
      yes: true,
    });

    // Verify metadata was created
    const metadataPath = join(projectDir, '.epost-metadata.json');
    const metadataExists = await fileExists(metadataPath);
    expect(metadataExists).toBe(true);

    // Verify kit files were copied
    const agentExists = await fileExists(join(projectDir, '.claude', 'agents', 'orchestrator.md'));
    expect(agentExists).toBe(true);

    const skillExists = await fileExists(join(projectDir, '.claude', 'skills', 'code-review.md'));
    expect(skillExists).toBe(true);
  });

  it('should handle dry-run mode', async () => {
    await runInit({
      target: 'claude',
      source: kitDir,
      dryRun: true,
      fresh: false,
      interactive: false,
    });

    // Verify nothing was written in dry-run
    const metadataPath = join(projectDir, '.epost-metadata.json');
    const metadataExists = await fileExists(metadataPath);
    expect(metadataExists).toBe(false);
  });

  it('should preserve modified files by default', async () => {
    // First init
    await runInit({
      kit: kitDir,
      dryRun: false,
      fresh: false,
      yes: true,
    });

    // Modify a file
    const agentPath = join(projectDir, '.claude', 'agents', 'orchestrator.md');
    await readFile(agentPath, 'utf-8');
    const modifiedContent = '# Modified Agent\n\nUser modifications';
    const { writeFile } = await import('node:fs/promises');
    await writeFile(agentPath, modifiedContent, 'utf-8');

    // Second init (should skip modified file)
    await runInit({
      kit: kitDir,
      dryRun: false,
      fresh: false,
      yes: true,
    });

    // Verify file was not overwritten
    const content = await readFile(agentPath, 'utf-8');
    expect(content).toBe(modifiedContent);
  });

  it('should overwrite all files with --fresh', async () => {
    // First init
    await runInit({
      kit: kitDir,
      dryRun: false,
      fresh: false,
      yes: true,
    });

    // Modify a file
    const agentPath = join(projectDir, '.claude', 'agents', 'orchestrator.md');
    const modifiedContent = '# Modified Agent\n\nUser modifications';
    const { writeFile } = await import('node:fs/promises');
    await writeFile(agentPath, modifiedContent, 'utf-8');

    // Fresh init
    await runInit({
      target: 'claude',
      source: kitDir,
      dryRun: false,
      fresh: true,
      interactive: false,
    });

    // Verify file was overwritten
    const content = await readFile(agentPath, 'utf-8');
    expect(content).not.toBe(modifiedContent);
    expect(content).toContain('Orchestrator');
  });
});
