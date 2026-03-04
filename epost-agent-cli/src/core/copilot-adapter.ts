/**
 * Copilot Adapter — transforms Claude Code format → GitHub Copilot format
 *
 * Agents:   .md → .agent.md (new frontmatter fields: tools, handoffs, target)
 * Commands: .md → .prompt.md (new fields: mode, tools, name)
 * Skills:   SKILL.md → SKILL.md (user-invocable → user-invokable)
 * Hooks:    settings.json → hooks.json (command→bash, timeout→timeoutSec, version:1)
 */

import type {
  TargetAdapter,
  TransformResult,
} from './target-adapter.js';
import { parseFrontmatter, serializeFrontmatter } from './target-adapter.js';

// ── Mapping Tables ──

const MODEL_MAP: Record<string, string> = {
  'haiku': 'Claude Haiku 4.5',
  'sonnet': 'Claude Sonnet 4.6',
  'opus': 'Claude Opus 4.6',
};

/** Claude Code tool → Copilot tool name */
const TOOL_MAP: Record<string, string> = {
  'Read': 'readFile',
  'Write': 'editFiles',
  'Edit': 'editFiles',
  'Bash': 'runInTerminal',
  'Grep': 'textSearch',
  'Glob': 'listDirectory',
  'WebFetch': 'fetch',
  'WebSearch': 'fetch',  // no direct equivalent, closest is fetch
};

/** Default tools when no restrictions specified */
const DEFAULT_TOOLS = ['readFile', 'editFiles', 'runInTerminal', 'listDirectory', 'textSearch', 'fetch'];

/** Read-only tools (when permissionMode: plan or write tools disallowed) */
const READONLY_TOOLS = ['readFile', 'listDirectory', 'textSearch', 'fetch'];

/** Agent workflow handoffs — generated from known agent relationships */
const AGENT_HANDOFFS: Record<string, Array<{ label: string; agent: string; prompt: string }>> = {
  'epost-architect': [
    { label: 'Implement Plan', agent: 'epost-implementer', prompt: 'Implement the plan outlined above.' },
  ],
  'epost-implementer': [
    { label: 'Review Code', agent: 'epost-reviewer', prompt: 'Review the implementation for edge cases and quality.' },
  ],
  'epost-reviewer': [
    { label: 'Commit Changes', agent: 'epost-git-manager', prompt: 'Stage and commit the reviewed changes.' },
  ],
  'epost-debugger': [
    { label: 'Run Tests', agent: 'epost-tester', prompt: 'Verify the fix with relevant tests.' },
  ],
  'epost-tester': [
    { label: 'Commit', agent: 'epost-git-manager', prompt: 'Commit the passing changes.' },
  ],
};

// ── Adapter ──

export class CopilotAdapter implements TargetAdapter {
  readonly name = 'vscode' as const;
  readonly installDir = '.github';

  transformAgent(content: string, filename: string): TransformResult {
    const { frontmatter: fm, body } = parseFrontmatter(content);
    const newFm: Record<string, unknown> = {};

    // Keep: description, name, argument-hint
    if (fm.description) newFm.description = fm.description;
    if (fm.name) newFm.name = fm.name;
    if (fm['argument-hint']) newFm['argument-hint'] = fm['argument-hint'];

    // Transform model
    const model = String(fm.model || '');
    if (model && MODEL_MAP[model]) {
      newFm.model = MODEL_MAP[model];
    } else if (model) {
      newFm.model = model; // pass through unknown models
    }

    // Build tools array from permission/disallowed info
    newFm.tools = this.buildToolsArray(fm);

    // Add handoffs for known agents
    const agentName = String(fm.name || filename.replace(/\.md$/, ''));
    if (AGENT_HANDOFFS[agentName]) {
      newFm.handoffs = AGENT_HANDOFFS[agentName];
    }

    // Drop: color, memory, skills, permissionMode, disallowedTools
    // (already not copied to newFm)

    // Transform body
    const newBody = this.replacePathRefs(body);

    // Rename file: name.md → name.agent.md
    const newFilename = filename.replace(/\.md$/, '.agent.md');

    return {
      content: serializeFrontmatter(newFm, newBody),
      filename: newFilename,
    };
  }

  transformSkill(content: string): string {
    // user-invocable → user-invokable (Copilot spelling)
    let result = content.replace(/user-invocable/g, 'user-invokable');
    // Path references
    result = this.replacePathRefs(result);
    return result;
  }

  transformHooks(settingsJson: Record<string, unknown>): { content: string; filename: string } | null {
    const hooks = settingsJson.hooks as Record<string, unknown[]> | undefined;
    if (!hooks) return null;

    const copilotHooks: Record<string, unknown[]> = {};

    for (const [eventName, groups] of Object.entries(hooks)) {
      if (!Array.isArray(groups)) continue;

      const entries: unknown[] = [];
      for (const group of groups) {
        const g = group as Record<string, unknown>;
        const hookList = (g.hooks || [g]) as Array<Record<string, unknown>>;

        for (const hook of hookList) {
          // Skip prompt hooks (no Copilot equivalent)
          if (hook.type === 'prompt') continue;

          const entry: Record<string, unknown> = { type: 'command' };

          // command → bash
          if (hook.command) {
            entry.bash = this.replacePathRefs(String(hook.command));
          }

          // timeout (ms) → timeoutSec (seconds)
          if (hook.timeout && typeof hook.timeout === 'number') {
            entry.timeoutSec = Math.ceil(hook.timeout / 1000);
          }

          entries.push(entry);
        }
      }

      if (entries.length > 0) {
        copilotHooks[eventName] = entries;
      }
    }

    if (Object.keys(copilotHooks).length === 0) return null;

    const output = {
      version: 1,
      hooks: copilotHooks,
    };

    return {
      content: JSON.stringify(output, null, 2),
      filename: 'hooks.json',
    };
  }

  usesSettingsJson(): boolean {
    return false; // Copilot doesn't use settings.json
  }

  agentExt(): string {
    return '.agent.md';
  }

  hookScriptDir(): string {
    return 'hooks/scripts';
  }

  rootInstructionsFilename(): string {
    return 'copilot-instructions.md';
  }

  replacePathRefs(content: string): string {
    return content
      .replace(/\.claude\//g, '.github/')
      .replace(/\.cursor\//g, '.github/');
  }

  // ── Private helpers ──

  /** Build Copilot tools array from Claude Code frontmatter */
  private buildToolsArray(fm: Record<string, unknown>): string[] {
    // Read-only mode
    if (fm.permissionMode === 'plan') {
      return READONLY_TOOLS;
    }

    // Start with defaults, remove disallowed
    const disallowed = String(fm.disallowedTools || '');
    if (!disallowed) return DEFAULT_TOOLS;

    const disallowedList = disallowed.split(',').map(t => t.trim());
    const disallowedCopilot = new Set(
      disallowedList.map(t => TOOL_MAP[t]).filter(Boolean),
    );

    return DEFAULT_TOOLS.filter(t => !disallowedCopilot.has(t));
  }

}
