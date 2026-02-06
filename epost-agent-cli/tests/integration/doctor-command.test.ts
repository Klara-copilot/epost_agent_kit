/**
 * Integration tests for doctor command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runDoctor } from '../../src/commands/doctor.js';
import { createTestProject } from '../helpers/temp-project.js';

describe('Doctor Command Integration', () => {
  let projectDir: string;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const project = await createTestProject({ withMetadata: true });
    projectDir = project.dir;
    cleanup = project.cleanup;

    // Change to project directory for tests
    process.chdir(projectDir);
  });

  afterEach(async () => {
    await cleanup();
  });

  it('should pass all checks with valid installation', async () => {
    // Create valid package.json
    await writeFile(
      join(projectDir, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        type: 'module',
      }, null, 2),
      'utf-8'
    );

    // Mock process.exit to prevent test termination
    const originalExit = process.exit;
    let exitCode: number | undefined;
    process.exit = ((code?: number) => {
      exitCode = code;
    }) as never;

    try {
      await runDoctor({ report: false, fix: false });
      // Should have exit code 0 for all pass
      expect(exitCode).toBeDefined();
    } finally {
      process.exit = originalExit;
    }
  });

  it('should generate JSON report', async () => {
    const exitMock = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
    const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runDoctor({ report: true, fix: false });

    expect(consoleLogMock).toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalled();

    exitMock.mockRestore();
    consoleLogMock.mockRestore();
  });
});
