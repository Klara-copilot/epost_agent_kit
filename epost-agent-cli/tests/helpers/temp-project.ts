/**
 * Temporary project scaffolding for integration tests
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createTempDir } from './test-utils.js';
import type { Metadata } from '../../src/types/index.js';

export interface TestProjectOptions {
  withMetadata?: boolean;
  target?: 'claude' | 'cursor' | 'github-copilot';
  withAgents?: boolean;
  withSkills?: boolean;
}

/**
 * Create test project with .claude/ structure
 */
export async function createTestProject(
  options: TestProjectOptions = {}
): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const {
    withMetadata = false,
    target = 'claude',
    withAgents = true,
    withSkills = true,
  } = options;

  const dir = await createTempDir('epost-kit-test-project-');
  const claudeDir = join(dir, '.claude');

  // Create .claude directory structure
  await mkdir(claudeDir, { recursive: true });

  if (withAgents) {
    const agentsDir = join(claudeDir, 'agents');
    await mkdir(agentsDir, { recursive: true });
    await writeFile(
      join(agentsDir, 'test-agent.md'),
      '# Test Agent\n\nTest agent description'
    );
  }

  if (withSkills) {
    const skillsDir = join(claudeDir, 'skills');
    await mkdir(skillsDir, { recursive: true });
    await writeFile(
      join(skillsDir, 'test-skill.md'),
      '# Test Skill\n\nTest skill description'
    );
  }

  // Create package.json
  await writeFile(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'test-project', version: '1.0.0' }, null, 2)
  );

  // Create metadata if requested
  if (withMetadata) {
    const metadata: Metadata = {
      cliVersion: '0.1.0',
      target,
      kitVersion: '1.0.0',
      installedAt: new Date().toISOString(),
      files: {
        '.claude/agents/test-agent.md': {
          checksum: 'test-checksum-1',
          size: 100,
          createdAt: new Date().toISOString(),
        },
        '.claude/skills/test-skill.md': {
          checksum: 'test-checksum-2',
          size: 100,
          createdAt: new Date().toISOString(),
        },
      },
    };

    await writeFile(
      join(dir, '.epost-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }

  const cleanup = async () => {
    const { cleanupTempDir } = await import('./test-utils.js');
    await cleanupTempDir(dir);
  };

  return { dir, cleanup };
}

/**
 * Create minimal kit structure for testing
 */
export async function createTestKit(): Promise<{ dir: string; cleanup: () => Promise<void> }> {
  const dir = await createTempDir('epost-kit-test-kit-');

  // Create .claude structure
  const claudeDir = join(dir, '.claude');
  await mkdir(claudeDir, { recursive: true });

  // Agents
  const agentsDir = join(claudeDir, 'agents');
  await mkdir(agentsDir, { recursive: true });
  await writeFile(
    join(agentsDir, 'orchestrator.md'),
    '# Orchestrator\n\nRoutes commands and manages workflow'
  );

  // Skills
  const skillsDir = join(claudeDir, 'skills');
  await mkdir(skillsDir, { recursive: true });
  await writeFile(
    join(skillsDir, 'code-review.md'),
    '# Code Review Skill\n\nAnalyze code quality'
  );

  // Commands
  const commandsDir = join(claudeDir, 'commands');
  await mkdir(commandsDir, { recursive: true });
  await writeFile(
    join(commandsDir, 'custom-command.md'),
    '# Custom Command\n\nTest command'
  );

  // CLAUDE.md
  await writeFile(
    join(dir, 'CLAUDE.md'),
    '# Project Instructions\n\nTest instructions'
  );

  const cleanup = async () => {
    const { cleanupTempDir } = await import('./test-utils.js');
    await cleanupTempDir(dir);
  };

  return { dir, cleanup };
}
