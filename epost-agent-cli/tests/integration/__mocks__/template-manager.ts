/**
 * Mock for template-manager.ts to avoid GitHub API calls in tests
 */

import { copyFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export function listAvailableKits() {
  return [
    { id: 'engineer', name: 'Engineer Kit', description: 'Full-stack agent framework' },
  ];
}

export async function downloadKit(kit: string, version: string, destPath: string): Promise<void> {
  // Mock: Use local test fixture instead of GitHub download
  const fixtureDir = join(__dirname, '../../fixtures/sample-kit');

  // Copy all files from fixture to destination
  const files = await readdir(fixtureDir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const srcPath = join(file.path, file.name);
      const relPath = srcPath.replace(fixtureDir + '/', '');
      const destFile = join(destPath, relPath);
      await copyFile(srcPath, destFile);
    }
  }
}

export async function getKitFiles(kitDir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(kitDir, { recursive: true, withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const fullPath = join(entry.path, entry.name);
      const relativePath = fullPath.replace(kitDir + '/', '');
      files.push(relativePath);
    }
  }

  return files;
}
