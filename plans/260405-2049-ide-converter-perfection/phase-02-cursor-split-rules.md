---
phase: 2
title: "Cursor Split-Rules + Agent Path Fix"
effort: 4h
depends: []
---

## Context

- Plan: [plan.md](plan.md)
- CLI repo: `/Users/than/Projects/epost-agent-kit-cli/`
- Current: `mdc-generator.ts` produces ONE `epost-kit.mdc` with `alwaysApply: true`
- Research: Cursor supports `.cursor/rules/*.mdc` with `globs` for file-scoped injection

## Overview

Replace the single monolithic `.cursor/rules/epost-kit.mdc` with split rules files scoped by platform glob. This reduces token waste — iOS rules don't load when editing `.tsx` files.

Also: Cursor agents live at `.cursor/agents/` (NOT `.agents/` at project root — that was a research error for an older Cursor version). The current CursorAdapter already uses `.cursor` as installDir, which is correct.

## Requirements

### 2a. Split MDC generation

**File**: `src/domains/installation/mdc-generator.ts`

Add new function alongside existing `generateMdcFile`:

```typescript
export async function generateSplitMdcFiles(
  snippetsByPlatform: Map<string, PackageSnippet[]>,
  rulesDir: string,
): Promise<string[]> {
  const written: string[] = [];
  
  for (const [platform, snippets] of snippetsByPlatform) {
    const config = PLATFORM_MDC_CONFIG[platform];
    await generateMdcFile(snippets, join(rulesDir, config.filename), {
      description: config.description,
      globs: config.globs,
      alwaysApply: config.alwaysApply,
    });
    written.push(config.filename);
  }
  
  return written;
}
```

Platform config:

| Platform | Filename | globs | alwaysApply |
|----------|----------|-------|-------------|
| core | `epost-kit-core.mdc` | — | `true` |
| web | `epost-kit-web.mdc` | `**/*.{ts,tsx,scss,css}` | `false` |
| ios | `epost-kit-ios.mdc` | `**/*.swift` | `false` |
| android | `epost-kit-android.mdc` | `**/*.kt` | `false` |
| backend | `epost-kit-backend.mdc` | `**/*.java` | `false` |
| design-system | `epost-kit-design.mdc` | — | `false` |
| a11y | `epost-kit-a11y.mdc` | — | `false` |

Rules:
- `core` package → always `alwaysApply: true` (routing table, agent overview)
- Platform packages → `globs` based on file extensions
- Cross-cutting packages (a11y, design-system) → `alwaysApply: false`, no globs (manual `@rule` invoke)

### 2b. Map packages to platforms

Use `package.yaml` metadata. Each package already declares its platform:
- `packages/core` → `core`
- `packages/platform-web` → `web`
- `packages/platform-ios` → `ios`
- `packages/platform-android` → `android`
- `packages/platform-backend` → `backend`
- `packages/design-system` → `design-system`
- `packages/a11y` → `a11y`
- `packages/kit` → `core` (merge with core)
- `packages/domains` → `core` (merge with core)
- `packages/connectors` → `core` (merge with core)

### 2c. Wire into init.ts

**File**: `src/commands/init.ts`

Replace the single MDC generation block:

```typescript
// Before (current):
await generateMdcFile(cursorSnippets, join(rulesDir, "epost-kit.mdc"));

// After:
const snippetsByPlatform = groupSnippetsByPlatform(cursorSnippets, manifests);
await generateSplitMdcFiles(snippetsByPlatform, rulesDir);
```

### 2d. Clean up old monolithic file

When generating split rules, delete old `epost-kit.mdc` if it exists (migration from previous installs).

### 2e. Update CursorAdapter.replacePathRefs

Ensure `.claude/` → `.cursor/` replacement also handles skill path references in agent bodies.

## Files to Create/Modify

| File (CLI repo) | Action |
|-----------------|--------|
| `src/domains/installation/mdc-generator.ts` | Modify — add `generateSplitMdcFiles`, `PLATFORM_MDC_CONFIG` |
| `src/commands/init.ts` | Modify — replace single MDC call with split generation |
| `src/domains/installation/cursor-adapter.ts` | Minor — verify path replacement completeness |

## TODO

- [ ] Define `PLATFORM_MDC_CONFIG` with filenames, globs, alwaysApply
- [ ] Implement `generateSplitMdcFiles` function
- [ ] Add `groupSnippetsByPlatform` helper (map package name → platform key)
- [ ] Wire split generation into init.ts for cursor target
- [ ] Delete old `epost-kit.mdc` during migration
- [ ] Test: `epost-kit init --target cursor --yes` → verify split `.mdc` files
- [ ] Verify `.cursor/agents/*.md` has correct frontmatter (name, description, model, readonly)

## Success Criteria

- `.cursor/rules/epost-kit-core.mdc` exists with `alwaysApply: true`
- `.cursor/rules/epost-kit-web.mdc` exists with `globs: "**/*.{ts,tsx,scss,css}"`
- `.cursor/rules/epost-kit-ios.mdc` exists with `globs: "**/*.swift"`
- No `epost-kit.mdc` monolithic file in output
- Each platform rule file contains only that platform's snippet content
