/**
 * Unit tests for ownership classification
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  isProtectedPath,
  readMetadata,
  writeMetadata,
  generateMetadata,
  classifyFile,
  getOwnedFiles,
  getModifiedFiles,
} from '../../../src/core/ownership.js';
import { hashString } from '../../../src/core/checksum.js';
import { createTempDir, cleanupTempDir } from '../../helpers/test-utils.js';
import type { Metadata } from '../../../src/types/index.js';

describe('Ownership System', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await mkdir(join(tempDir, '.claude'), { recursive: true });
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('isProtectedPath', () => {
    it('should identify protected patterns', () => {
      expect(isProtectedPath('.env')).toBe(true);
      expect(isProtectedPath('.env.local')).toBe(true);
      expect(isProtectedPath('.git/config')).toBe(true);
      expect(isProtectedPath('node_modules/package.json')).toBe(true);
    });

    it('should allow non-protected files', () => {
      expect(isProtectedPath('.claude/agents/test.md')).toBe(false);
      expect(isProtectedPath('src/index.ts')).toBe(false);
      expect(isProtectedPath('README.md')).toBe(false);
    });
  });

  describe('Metadata CRUD', () => {
    it('should generate fresh metadata', () => {
      const metadata = generateMetadata('0.1.0', 'claude', '1.0.0', {
        'test.txt': {
          checksum: 'abc123',
          size: 100,
          createdAt: new Date().toISOString(),
        },
      });

      expect(metadata.cliVersion).toBe('0.1.0');
      expect(metadata.target).toBe('claude');
      expect(metadata.kitVersion).toBe('1.0.0');
      expect(metadata.files['test.txt']).toBeDefined();
      expect(metadata.installedAt).toBeDefined();
    });

    it('should write and read metadata', async () => {
      const metadata: Metadata = {
        cliVersion: '0.1.0',
        target: 'claude',
        kitVersion: '1.0.0',
        installedAt: new Date().toISOString(),
        files: {},
      };

      await writeMetadata(tempDir, metadata);
      const read = await readMetadata(tempDir);

      expect(read).not.toBeNull();
      expect(read?.cliVersion).toBe('0.1.0');
      expect(read?.target).toBe('claude');
    });

    it('should return null for missing metadata', async () => {
      const result = await readMetadata(tempDir);
      expect(result).toBeNull();
    });

    it('should return null for invalid metadata', async () => {
      const metadataPath = join(tempDir, '.epost-metadata.json');
      await writeFile(metadataPath, '{ invalid json }', 'utf-8');

      const result = await readMetadata(tempDir);
      expect(result).toBeNull();
    });
  });

  describe('classifyFile', () => {
    it('should classify protected files as user-created', async () => {
      const filePath = join(tempDir, '.env');
      await writeFile(filePath, 'SECRET=value', 'utf-8');

      const tier = await classifyFile(filePath, tempDir, null);
      expect(tier).toBe('user-created');
    });

    it('should classify files without metadata as user-created', async () => {
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, 'content', 'utf-8');

      const tier = await classifyFile(filePath, tempDir, null);
      expect(tier).toBe('user-created');
    });

    it('should classify unmodified files as epost-owned', async () => {
      const content = 'test content';
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, content, 'utf-8');

      const metadata: Metadata = {
        cliVersion: '0.1.0',
        target: 'claude',
        kitVersion: '1.0.0',
        installedAt: new Date().toISOString(),
        files: {
          'test.txt': {
            checksum: hashString(content),
            size: content.length,
            createdAt: new Date().toISOString(),
          },
        },
      };

      const tier = await classifyFile(filePath, tempDir, metadata);
      expect(tier).toBe('epost-owned');
    });

    it('should classify modified files as epost-modified', async () => {
      const originalContent = 'original content';
      const modifiedContent = 'modified content';
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, modifiedContent, 'utf-8');

      const metadata: Metadata = {
        cliVersion: '0.1.0',
        target: 'claude',
        kitVersion: '1.0.0',
        installedAt: new Date().toISOString(),
        files: {
          'test.txt': {
            checksum: hashString(originalContent),
            size: originalContent.length,
            createdAt: new Date().toISOString(),
          },
        },
      };

      const tier = await classifyFile(filePath, tempDir, metadata);
      expect(tier).toBe('epost-modified');
    });
  });

  describe('getFilesByOwnership', () => {
    it('should filter owned files', async () => {
      const ownedContent = 'owned';
      const modifiedContent = 'modified';

      const ownedPath = join(tempDir, 'owned.txt');
      const modifiedPath = join(tempDir, 'modified.txt');

      await writeFile(ownedPath, ownedContent, 'utf-8');
      await writeFile(modifiedPath, 'changed content', 'utf-8');

      const metadata: Metadata = {
        cliVersion: '0.1.0',
        target: 'claude',
        kitVersion: '1.0.0',
        installedAt: new Date().toISOString(),
        files: {
          'owned.txt': {
            checksum: hashString(ownedContent),
            size: ownedContent.length,
            createdAt: new Date().toISOString(),
          },
          'modified.txt': {
            checksum: hashString(modifiedContent),
            size: modifiedContent.length,
            createdAt: new Date().toISOString(),
          },
        },
      };

      const owned = await getOwnedFiles(tempDir, metadata);
      expect(owned).toContain('owned.txt');
      expect(owned).not.toContain('modified.txt');
    });

    it('should filter modified files', async () => {
      const originalContent = 'original';
      const filePath = join(tempDir, 'modified.txt');
      await writeFile(filePath, 'changed content', 'utf-8');

      const metadata: Metadata = {
        cliVersion: '0.1.0',
        target: 'claude',
        kitVersion: '1.0.0',
        installedAt: new Date().toISOString(),
        files: {
          'modified.txt': {
            checksum: hashString(originalContent),
            size: originalContent.length,
            createdAt: new Date().toISOString(),
          },
        },
      };

      const modified = await getModifiedFiles(tempDir, metadata);
      expect(modified).toContain('modified.txt');
    });
  });
});
