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

The CopilotAdapter uses WRONG Copilot tool names. Current: `execute, read, edit, search, web`. Correct (verified Nov 2025 VS Code docs): `runInTerminal, readFile, editFiles, textSearch, fetch`. Also `listDirectory` (Glob) and Copilot-only tools like `githubRepo`, `usages`, `codebase`, `findTestFiles`.

Additionally, scoped `.instructions.md` files (with `applyTo` globs) are not generated yet.

## Requirements

### 1a. Fix TOOL_MAP in copilot-adapter.ts

**File**: `src/domains/installation/copilot-adapter.ts`

Replace the mapping tables:

```typescript
const TOOL_MAP: Record<string, string> = {
  Read: "readFile",
  Write: "editFiles",
  Edit: "editFiles",
  Bash: "runInTerminal",
  Grep: "textSearch",
  Glob: "listDirectory",
  WebFetch: "fetch",
  WebSearch: "fetch",    // no direct equivalent; fetch is closest
  Browser: "fetch",
  Agent: "agent",        // handoffs frontmatter, not a tool — but keep for inference
};

const DEFAULT_TOOLS = [
  "readFile", "editFiles", "runInTerminal", "textSearch",
  "listDirectory", "fetch", "githubRepo", "codebase"
];

const READONLY_TOOLS = [
  "readFile", "textSearch", "listDirectory", "fetch",
  "githubRepo", "codebase"
];
```

### 1b. Fix TOOL_ALIASES in conversion/tool-mappers.ts

**File**: `src/domains/conversion/tool-mappers.ts`

Align the standalone `convert` command's mappings to match the adapter:

```typescript
export const TOOL_ALIASES: Record<string, string> = {
  Bash: "runInTerminal",
  shell: "runInTerminal",
  terminal: "runInTerminal",
  Read: "readFile",
  NotebookRead: "readFile",
  Edit: "editFiles",
  MultiEdit: "editFiles",
  Write: "editFiles",
  NotebookEdit: "editFiles",
  Grep: "textSearch",
  Glob: "listDirectory",
  WebSearch: "fetch",
  WebFetch: "fetch",
  TodoWrite: "todo",
  Task: "agent",
  "custom-agent": "agent",
  github: "githubRepo",
};

export const DEFAULT_TOOLS_BY_TYPE: Record<string, string[]> = {
  implementer: ["readFile", "editFiles", "textSearch", "runInTerminal"],
  reviewer: ["readFile", "textSearch"],
  planner: ["readFile", "textSearch", "editFiles"],
  tester: ["readFile", "editFiles", "textSearch", "runInTerminal"],
  debugger: ["readFile", "editFiles", "textSearch", "runInTerminal"],
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

- [ ] Update TOOL_MAP to correct Copilot tool names
- [ ] Update DEFAULT_TOOLS and READONLY_TOOLS arrays
- [ ] Update TOOL_ALIASES in conversion/tool-mappers.ts
- [ ] Update DEFAULT_TOOLS_BY_TYPE in tool-mappers.ts
- [ ] Add `generateScopedInstructions` to TargetAdapter interface
- [ ] Implement scoped instructions in CopilotAdapter
- [ ] Wire scoped instructions generation into init.ts
- [ ] Add auto-handoff generation in transformAgent
- [ ] Test: `epost-kit init --target vscode --yes` → verify tool names in output

## Success Criteria

- Agent `.agent.md` files contain `tools: [readFile, editFiles, runInTerminal, textSearch, listDirectory, fetch]` (not old names)
- `grep -r 'execute\|"read"\|"edit"\|"search"\|"web"' .github/agents/` returns 0 matches for old tool aliases
- `.github/instructions/web.instructions.md` exists with `applyTo: "**/*.{ts,tsx,scss,css}"`
- Agents with known workflow successors have `handoffs:` in frontmatter
