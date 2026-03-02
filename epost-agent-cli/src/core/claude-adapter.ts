/**
 * Claude/Cursor Adapter — pass-through implementation
 *
 * No transformation needed: source format IS the target format.
 */

import type { TargetAdapter, TargetName, TransformResult } from './target-adapter.js';

export class ClaudeAdapter implements TargetAdapter {
  readonly name: TargetName;
  readonly installDir: string;

  constructor(target: TargetName = 'claude') {
    this.name = target;
    this.installDir = target === 'cursor' ? '.cursor' : '.claude';
  }

  transformAgent(content: string, filename: string): TransformResult {
    return { content, filename };
  }

  transformSkill(content: string): string {
    return content;
  }

  transformHooks(): null {
    return null; // settings.json used as-is
  }

  usesSettingsJson(): boolean {
    return true;
  }

  agentExt(): string {
    return '.md';
  }

  hookScriptDir(): string {
    return 'hooks';
  }

  rootInstructionsFilename(): string {
    return 'CLAUDE.md';
  }

  replacePathRefs(content: string): string {
    return content; // no replacement needed
  }
}
