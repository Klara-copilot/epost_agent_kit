/**
 * Unit tests for package manager detection
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  detectPackageManager,
  getInstallCommand,
} from '../../../src/core/package-manager.js';
import { createTempDir, cleanupTempDir } from '../../helpers/test-utils.js';

describe('Package Manager Detection', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('detectPackageManager', () => {
    it('should detect pnpm from pnpm-lock.yaml', async () => {
      await writeFile(join(tempDir, 'pnpm-lock.yaml'), '', 'utf-8');

      const pm = await detectPackageManager(tempDir);

      expect(pm).toBe('pnpm');
    });

    it('should detect yarn from yarn.lock', async () => {
      await writeFile(join(tempDir, 'yarn.lock'), '', 'utf-8');

      const pm = await detectPackageManager(tempDir);

      expect(pm).toBe('yarn');
    });

    it('should detect bun from bun.lockb', async () => {
      await writeFile(join(tempDir, 'bun.lockb'), '', 'utf-8');

      const pm = await detectPackageManager(tempDir);

      expect(pm).toBe('bun');
    });

    it('should detect npm from package-lock.json', async () => {
      await writeFile(join(tempDir, 'package-lock.json'), '{}', 'utf-8');

      const pm = await detectPackageManager(tempDir);

      expect(pm).toBe('npm');
    });

    it('should default to npm when no lock file exists', async () => {
      const pm = await detectPackageManager(tempDir);

      expect(pm).toBe('npm');
    });

    it('should prioritize pnpm over others', async () => {
      await writeFile(join(tempDir, 'pnpm-lock.yaml'), '', 'utf-8');
      await writeFile(join(tempDir, 'yarn.lock'), '', 'utf-8');
      await writeFile(join(tempDir, 'package-lock.json'), '{}', 'utf-8');

      const pm = await detectPackageManager(tempDir);

      expect(pm).toBe('pnpm');
    });
  });

  describe('getInstallCommand', () => {
    it('should return correct install commands', () => {
      expect(getInstallCommand('pnpm')).toBe('pnpm install');
      expect(getInstallCommand('yarn')).toBe('yarn install');
      expect(getInstallCommand('bun')).toBe('bun install');
      expect(getInstallCommand('npm')).toBe('npm install');
    });
  });
});
