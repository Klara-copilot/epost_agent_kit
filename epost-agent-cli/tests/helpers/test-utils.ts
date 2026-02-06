/**
 * Test utilities for CLI testing
 */

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execa } from 'execa';

/** Create temporary directory for testing */
export async function createTempDir(prefix = 'epost-kit-test-'): Promise<string> {
  return mkdtemp(join(tmpdir(), prefix));
}

/** Clean up temporary directory */
export async function cleanupTempDir(dir: string): Promise<void> {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors in tests
  }
}

/** Run CLI command via execa (for integration/E2E tests) */
export async function runCli(
  args: string[],
  options: { cwd?: string; env?: Record<string, string> } = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const cliPath = join(process.cwd(), 'dist', 'cli.js');

  try {
    const result = await execa('node', [cliPath, ...args], {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...options.env },
      reject: false,
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    };
  } catch (error) {
    throw new Error(`CLI execution failed: ${error}`);
  }
}

/** Sleep utility for async tests */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Generate unique test ID */
export function uniqueId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
