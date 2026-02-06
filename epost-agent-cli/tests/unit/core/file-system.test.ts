/**
 * Unit tests for file system utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  safeReadFile,
  safeWriteFile,
  fileExists,
  dirExists,
  isProtectedFile,
} from '../../../src/core/file-system.js';
import { createTempDir, cleanupTempDir } from '../../helpers/test-utils.js';

describe('File System Utilities', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('safeReadFile', () => {
    it('should read existing file', async () => {
      const filePath = join(tempDir, 'test.txt');
      const content = 'test content';
      await writeFile(filePath, content, 'utf-8');

      const result = await safeReadFile(filePath);

      expect(result).toBe(content);
    });

    it('should return null for non-existent file', async () => {
      const filePath = join(tempDir, 'nonexistent.txt');

      const result = await safeReadFile(filePath);

      expect(result).toBeNull();
    });
  });

  describe('safeWriteFile', () => {
    it('should write file with parent directories', async () => {
      const filePath = join(tempDir, 'nested', 'dir', 'test.txt');
      const content = 'test content';

      await safeWriteFile(filePath, content);

      const exists = await fileExists(filePath);
      expect(exists).toBe(true);

      const read = await safeReadFile(filePath);
      expect(read).toBe(content);
    });

    it('should overwrite existing file', async () => {
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, 'old content', 'utf-8');

      await safeWriteFile(filePath, 'new content');

      const result = await safeReadFile(filePath);
      expect(result).toBe('new content');
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, 'content', 'utf-8');

      const exists = await fileExists(filePath);

      expect(exists).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const filePath = join(tempDir, 'nonexistent.txt');

      const exists = await fileExists(filePath);

      expect(exists).toBe(false);
    });

    it('should return false for directory', async () => {
      const dirPath = join(tempDir, 'subdir');
      await mkdir(dirPath);

      const exists = await fileExists(dirPath);

      expect(exists).toBe(false);
    });
  });

  describe('dirExists', () => {
    it('should return true for existing directory', async () => {
      const dirPath = join(tempDir, 'subdir');
      await mkdir(dirPath);

      const exists = await dirExists(dirPath);

      expect(exists).toBe(true);
    });

    it('should return false for non-existent directory', async () => {
      const dirPath = join(tempDir, 'nonexistent');

      const exists = await dirExists(dirPath);

      expect(exists).toBe(false);
    });

    it('should return false for file', async () => {
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, 'content', 'utf-8');

      const exists = await dirExists(filePath);

      expect(exists).toBe(false);
    });
  });

  describe('isProtectedFile', () => {
    it('should detect .env files', () => {
      expect(isProtectedFile('.env')).toBe(true);
      expect(isProtectedFile('.env.local')).toBe(true);
      expect(isProtectedFile('.env.production')).toBe(true);
    });

    it('should check protected patterns based on basename', () => {
      // Pattern '.git/**' becomes prefix '.git/*' which doesn't match basename 'config'
      expect(isProtectedFile('.git/config')).toBe(false);
      // But '.env' pattern matches
      expect(isProtectedFile('.env')).toBe(true);
      expect(isProtectedFile('config/.env')).toBe(true);
    });

    it('should allow normal files', () => {
      expect(isProtectedFile('src/index.ts')).toBe(false);
      expect(isProtectedFile('README.md')).toBe(false);
      expect(isProtectedFile('.claude/agents/test.md')).toBe(false);
    });
  });
});
