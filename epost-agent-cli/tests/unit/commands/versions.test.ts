/**
 * Unit tests for versions command logic
 */

import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

describe('Versions Command', () => {
  it('should parse GitHub releases fixture', async () => {
    const fixturePath = join(process.cwd(), 'tests', 'fixtures', 'github-releases.json');
    const content = await readFile(fixturePath, 'utf-8');
    const releases = JSON.parse(content);

    expect(releases).toBeInstanceOf(Array);
    expect(releases.length).toBeGreaterThan(0);
    expect(releases[0]).toHaveProperty('tag_name');
    expect(releases[0]).toHaveProperty('published_at');
  });

  it('should filter prerelease versions', async () => {
    const fixturePath = join(process.cwd(), 'tests', 'fixtures', 'github-releases.json');
    const content = await readFile(fixturePath, 'utf-8');
    const releases = JSON.parse(content);

    const stableReleases = releases.filter((r: { prerelease?: boolean }) => !r.prerelease);

    expect(stableReleases.length).toBe(releases.length);
  });
});
