---
phase: 1
title: "Fix Copilot Tool Mapping + Scoped Instructions"
effort: 4h
depends: []
---

## Context

- Plan: [plan.md](plan.md)
- CLI repo: `/Users/than/Projects/epost-agent-kit-cli/`
- Existing adapter: `src/domains/installation/copilot-adapter.ts`
- Existing convert tools: `src/domains/conversion/tool-mappers.ts`

## Overview

**CORRECTION (2026-04-06)**: Screenshots from VS Code confirm the actual Copilot built-in tool names are the short forms: `read`, `edit`, `execute`, `search`, `web`, `agent`, `browser`, `todo`, `vscode`. The existing adapter was CORRECT. The verbose names (`readFile`, `editFiles`, `runInTerminal`) are sub-tools within toolsets shown only in the edit panel — NOT the values to use in `tools:` arrays.

Full built-in tool list (from VS Code "Configure Tools" panel):
- `read` — Read files in your workspace
- `edit` — Edit files in your workspace (toolset: createDirectory, createFile, editFiles, rename...)
- `execute` — Execute code and applications on your machine
- `search` — Search files in your workspace
- `web` — Fetch information from the web
- `agent` — Delegate tasks to other agents
- `browser` — Open and interact with integrated browser pages
- `todo` — Manage and track todo items for task planning
- `vscode` — Use VS Code features

Phase 1 scope (revised): **no tool name fix needed**. Focus on:
1. Confirm existing tool map is correct (audit copilot-adapter.ts)
2. Expose `browser`, `todo`, `vscode` as optional Copilot-only tools in DEFAULT_TOOLS
3. Add scoped `.instructions.md` generation
4. Add auto-handoff generation

## Requirements

### 1a. Audit + verify TOOL_MAP in copilot-adapter.ts

**File**: `src/domains/installation/copilot-adapter.ts`

Confirm the mapping matches actual VS Code tool names:

```typescript
const TOOL_MAP: Record<string, string> = {
  Read: "read",
  Write: "edit",
  Edit: "edit",
  Bash: "execute",
  Grep: "search",
  Glob: "search",       // search covers both text and file patterns
  WebFetch: "web",
  WebSearch: "web",
  Browser: "browser",
  Agent: "agent",       // for handoffs frontmatter inference
  TodoWrite: "todo",
};

const DEFAULT_TOOLS = ["read", "edit", "execute", "search", "web"];
const READONLY_TOOLS = ["read", "search", "web"];

// Copilot-only tools — included when agent has broad scope
const COPILOT_EXTRA_TOOLS = ["agent", "browser", "todo", "vscode"];
```

### 1b. Verify TOOL_ALIASES in conversion/tool-mappers.ts

**File**: `src/domains/conversion/tool-mappers.ts`

Align the standalone `convert` command's mappings to match the adapter (same short names):

```typescript
export const TOOL_ALIASES: Record<string, string> = {
  Bash: "execute",
  shell: "execute",
  terminal: "execute",
  Read: "read",
  NotebookRead: "read",
  Edit: "edit",
  MultiEdit: "edit",
  Write: "edit",
  NotebookEdit: "edit",
  Grep: "search",
  Glob: "search",
  WebSearch: "web",
  WebFetch: "web",
  TodoWrite: "todo",
  Task: "agent",
  "custom-agent": "agent",
};

export const DEFAULT_TOOLS_BY_TYPE: Record<string, string[]> = {
  implementer: ["read", "edit", "execute", "search"],
  reviewer: ["read", "search"],
  planner: ["read", "search", "edit"],
  tester: ["read", "edit", "execute", "search"],
  debugger: ["read", "edit", "execute", "search"],
};
```

### 1c. Add scoped instructions generation

**File**: `src/domains/installation/copilot-adapter.ts`

Add method to TargetAdapter interface and implement in CopilotAdapter:

```typescript
// In target-adapter.ts interface:
generateScopedInstructions?(snippets: PackageSnippet[]): Array<{
  filename: string;
  content: string;
}>;
```

Generate platform-scoped `.instructions.md` files:

| File | applyTo | Content source |
|------|---------|---------------|
| `instructions/web.instructions.md` | `**/*.{ts,tsx,scss,css}` | web COPILOT.snippet.md |
| `instructions/ios.instructions.md` | `**/*.swift` | ios COPILOT.snippet.md |
| `instructions/android.instructions.md` | `**/*.kt` | android COPILOT.snippet.md |
| `instructions/backend.instructions.md` | `**/*.java` | backend COPILOT.snippet.md |

### 1d. Auto-generate handoffs from agent metadata

In `transformAgent()`, generate handoffs based on known workflow patterns:

```typescript
const HANDOFF_MAP: Record<string, Array<{label: string; agent: string; prompt: string}>> = {
  "epost-planner": [
    { label: "Implement Plan", agent: "epost-fullstack-developer", prompt: "Implement the plan outlined above." }
  ],
  "epost-fullstack-developer": [
    { label: "Review Code", agent: "epost-code-reviewer", prompt: "Review the implementation for quality." }
  ],
  "epost-code-reviewer": [
    { label: "Commit Changes", agent: "epost-git-manager", prompt: "Stage and commit the reviewed changes." }
  ],
  "epost-debugger": [
    { label: "Run Tests", agent: "epost-tester", prompt: "Verify the fix with relevant tests." }
  ],
};
```

Apply handoffs only when the agent frontmatter does NOT already contain `handoffs:`.

## Files to Create/Modify

| File (CLI repo) | Action |
|-----------------|--------|
| `src/domains/installation/copilot-adapter.ts` | Modify — fix TOOL_MAP, DEFAULT_TOOLS, READONLY_TOOLS; add handoff generation; add scoped instructions |
| `src/domains/installation/target-adapter.ts` | Modify — add optional `generateScopedInstructions` to interface |
| `src/domains/conversion/tool-mappers.ts` | Modify — fix TOOL_ALIASES and DEFAULT_TOOLS_BY_TYPE |
| `src/commands/init.ts` | Modify — call `generateScopedInstructions()` during vscode install |

## TODO

- [ ] Read copilot-adapter.ts — audit existing TOOL_MAP against confirmed short names
- [ ] Confirm/fix DEFAULT_TOOLS uses `["read", "edit", "execute", "search", "web"]`
- [ ] Confirm/fix READONLY_TOOLS uses `["read", "search", "web"]`
- [ ] Read tool-mappers.ts — align TOOL_ALIASES to short names
- [ ] Align DEFAULT_TOOLS_BY_TYPE in tool-mappers.ts
- [ ] Add `generateScopedInstructions` to TargetAdapter interface
- [ ] Implement scoped instructions in CopilotAdapter
- [ ] Wire scoped instructions generation into init.ts
- [ ] Add auto-handoff generation in transformAgent
- [ ] Test: `epost-kit init --target vscode --yes` → verify tool names in output

## Success Criteria

- Agent `.agent.md` files contain `tools: [read, edit, execute, search, web]` (short form confirmed by VS Code UI)
- `.github/instructions/web.instructions.md` exists with `applyTo: "**/*.{ts,tsx,scss,css}"`
- Agents with known workflow successors have `handoffs:` in frontmatter
- `grep -r 'readFile\|editFiles\|runInTerminal\|textSearch\|listDirectory' .github/agents/` returns 0 (no verbose sub-tool names in tools arrays)
