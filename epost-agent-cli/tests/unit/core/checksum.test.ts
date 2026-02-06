/**
 * Unit tests for checksum utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { hashString, hashFile, verifyChecksum } from '../../../src/core/checksum.js';
import { createTempDir, cleanupTempDir } from '../../helpers/test-utils.js';

describe('Checksum Utilities', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('hashString', () => {
    it('should hash known strings consistently', () => {
      const content = 'Hello, World!';
      const hash1 = hashString(content);
      const hash2 = hashString(content);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hex digest
    });

    it('should normalize CRLF to LF before hashing', () => {
      const lfContent = 'Line 1\nLine 2\nLine 3';
      const crlfContent = 'Line 1\r\nLine 2\r\nLine 3';

      const lfHash = hashString(lfContent);
      const crlfHash = hashString(crlfContent);

      expect(lfHash).toBe(crlfHash);
    });

    it('should produce different hashes for different content', () => {
      const hash1 = hashString('content A');
      const hash2 = hashString('content B');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('hashFile', () => {
    it('should hash file contents', async () => {
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, 'test content', 'utf-8');

      const hash = await hashFile(filePath);

      expect(hash).toHaveLength(64);
      expect(typeof hash).toBe('string');
    });

    it('should normalize line endings in files', async () => {
      const lfPath = join(tempDir, 'lf.txt');
      const crlfPath = join(tempDir, 'crlf.txt');

      await writeFile(lfPath, 'Line 1\nLine 2', 'utf-8');
      await writeFile(crlfPath, 'Line 1\r\nLine 2', 'utf-8');

      const lfHash = await hashFile(lfPath);
      const crlfHash = await hashFile(crlfPath);

      expect(lfHash).toBe(crlfHash);
    });

    it('should throw error for non-existent file', async () => {
      const filePath = join(tempDir, 'nonexistent.txt');

      await expect(hashFile(filePath)).rejects.toThrow();
    });
  });

  describe('verifyChecksum', () => {
    it('should return true for matching checksum', async () => {
      const filePath = join(tempDir, 'test.txt');
      const content = 'test content';
      await writeFile(filePath, content, 'utf-8');

      const expectedHash = hashString(content);
      const result = await verifyChecksum(filePath, expectedHash);

      expect(result).toBe(true);
    });

    it('should return false for mismatched checksum', async () => {
      const filePath = join(tempDir, 'test.txt');
      await writeFile(filePath, 'actual content', 'utf-8');

      const wrongHash = hashString('different content');
      const result = await verifyChecksum(filePath, wrongHash);

      expect(result).toBe(false);
    });

    it('should throw FileOwnershipError for non-existent file', async () => {
      const filePath = join(tempDir, 'nonexistent.txt');

      await expect(verifyChecksum(filePath, 'fake-hash')).rejects.toThrow(
        /Failed to verify checksum/
      );
    });
  });
});
