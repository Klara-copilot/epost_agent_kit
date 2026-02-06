/**
 * Unit tests for smart merge system
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  classifyFiles,
  planMerge,
  previewMerge,
} from '../../../src/core/smart-merge.js';
import { hashString } from '../../../src/core/checksum.js';
import { createTempDir, cleanupTempDir } from '../../helpers/test-utils.js';
import type { Metadata } from '../../../src/types/index.js';

describe('Smart Merge System', () => {
  let tempDir: string;
  let kitDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('merge-project-');
    kitDir = await createTempDir('merge-kit-');

    await mkdir(join(tempDir, '.claude'), { recursive: true });
    await mkdir(join(kitDir, '.claude'), { recursive: true });
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
    await cleanupTempDir(kitDir);
  });

  describe('classifyFiles', () => {
    it('should classify new files', async () => {
      const newFiles = ['test.txt', 'another.txt'];

      const classification = await classifyFiles(tempDir, newFiles, null);

      expect(classification.new).toEqual(newFiles);
      expect(classification.owned).toHaveLength(0);
      expect(classification.modified).toHaveLength(0);
      expect(classification.userCreated).toHaveLength(0);
    });

    it('should classify owned files', async () => {
      const content = 'owned content';
      const filePath = join(tempDir, 'owned.txt');
      await writeFile(filePath, content, 'utf-8');

      const metadata: Metadata = {
        cliVersion: '0.1.0',
        target: 'claude',
        kitVersion: '1.0.0',
        installedAt: new Date().toISOString(),
        files: {
          'owned.txt': {
            checksum: hashString(content),
            size: content.length,
            createdAt: new Date().toISOString(),
          },
        },
      };

      const classification = await classifyFiles(tempDir, ['owned.txt'], metadata);

      expect(classification.owned).toContain('owned.txt');
      expect(classification.new).toHaveLength(0);
    });

    it('should classify modified files', async () => {
      const originalContent = 'original';
      const modifiedContent = 'modified';
      const filePath = join(tempDir, 'modified.txt');
      await writeFile(filePath, modifiedContent, 'utf-8');

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

      const classification = await classifyFiles(tempDir, ['modified.txt'], metadata);

      expect(classification.modified).toContain('modified.txt');
    });

    it('should classify user-created files', async () => {
      const filePath = join(tempDir, 'user-file.txt');
      await writeFile(filePath, 'user content', 'utf-8');

      const classification = await classifyFiles(tempDir, ['user-file.txt'], null);

      expect(classification.userCreated).toContain('user-file.txt');
    });
  });

  describe('planMerge', () => {
    it('should plan overwrite for owned files', () => {
      const classification = {
        owned: ['owned.txt'],
        modified: [],
        userCreated: [],
        new: [],
      };

      const plan = planMerge(classification);

      expect(plan.actions.get('owned.txt')).toBe('overwrite');
      expect(plan.summary.overwrite).toBe(1);
    });

    it('should plan create for new files', () => {
      const classification = {
        owned: [],
        modified: [],
        userCreated: [],
        new: ['new.txt'],
      };

      const plan = planMerge(classification);

      expect(plan.actions.get('new.txt')).toBe('create');
      expect(plan.summary.create).toBe(1);
    });

    it('should plan skip for user-created files', () => {
      const classification = {
        owned: [],
        modified: [],
        userCreated: ['user.txt'],
        new: [],
      };

      const plan = planMerge(classification);

      expect(plan.actions.get('user.txt')).toBe('skip');
      expect(plan.summary.skip).toBe(1);
    });

    it('should plan conflict for modified files', () => {
      const classification = {
        owned: [],
        modified: ['modified.txt'],
        userCreated: [],
        new: [],
      };

      const plan = planMerge(classification);

      expect(plan.actions.get('modified.txt')).toBe('conflict');
      expect(plan.summary.conflict).toBe(1);
    });

    it('should handle mixed classifications', () => {
      const classification = {
        owned: ['owned.txt'],
        modified: ['modified.txt'],
        userCreated: ['user.txt'],
        new: ['new.txt'],
      };

      const plan = planMerge(classification);

      expect(plan.summary.overwrite).toBe(1);
      expect(plan.summary.conflict).toBe(1);
      expect(plan.summary.skip).toBe(1);
      expect(plan.summary.create).toBe(1);
    });
  });

  describe('previewMerge', () => {
    it('should generate preview text', () => {
      const plan = {
        actions: new Map([
          ['owned.txt', 'overwrite' as const],
          ['new.txt', 'create' as const],
        ]),
        summary: {
          overwrite: 1,
          skip: 0,
          conflict: 0,
          create: 1,
        },
      };

      const preview = previewMerge(plan);

      expect(preview).toContain('Merge Plan:');
      expect(preview).toContain('Overwrite: 1 file(s)');
      expect(preview).toContain('Create: 1 file(s)');
    });

    it('should list conflicts in preview', () => {
      const plan = {
        actions: new Map([
          ['conflict1.txt', 'conflict' as const],
          ['conflict2.txt', 'conflict' as const],
        ]),
        summary: {
          overwrite: 0,
          skip: 0,
          conflict: 2,
          create: 0,
        },
      };

      const preview = previewMerge(plan);

      expect(preview).toContain('Conflicts require manual resolution');
      expect(preview).toContain('conflict1.txt');
      expect(preview).toContain('conflict2.txt');
    });
  });
});
