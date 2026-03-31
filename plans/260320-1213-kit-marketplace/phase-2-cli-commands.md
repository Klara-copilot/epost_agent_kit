---
phase: 2
title: "Core CLI Commands"
effort: 6h
depends: [1]
---

# Phase 2: Core CLI Commands

Implement `roles`, `add`, `remove`, `list`, `upgrade` commands using cac framework.

## Tasks

### 2.1 `epost-kit roles` command

**File**: `src/commands/roles.ts`

- Load `bundles.yaml` (bundled with CLI or fetched from kit repo)
- Display table: role name, description, skills count, agents count, installed status
- Format with `cli-table3` + `picocolors`
- `--json` flag for machine-readable output

Output example:
```
  Role              Description                    Skills  Agents  Status
  web-frontend      React, Next.js, testing...     8       3       ● installed
  ios-developer     Swift 6, SwiftUI, iOS a11y     6       3       ○ available
  designer          Design tokens, Figma, UI lib   8       2       ○ available
```

### 2.2 `epost-kit add` command

**File**: `src/commands/add.ts`

Two modes:
- `epost-kit add <skill-name>` — install single skill + deps
- `epost-kit add --role <role-name>` — install entire role bundle

Flow:
1. Read `.epost.json` (or create if missing)
2. Resolve dependencies via `src/domains/resolver/`
3. Show what will be installed (skills + agents)
4. Prompt confirmation (skip with `--yes`)
5. Copy skill files from kit source to `.claude/skills/`
6. Copy agent files to `.claude/agents/`
7. Update `.epost.json`
8. Regenerate `CLAUDE.md` (reuse existing `generateClaudeMd`)

**Reuse**: `src/domains/installation/` adapters already handle file copy per target.

### 2.3 `epost-kit remove` command

**File**: `src/commands/remove.ts`

Two modes:
- `epost-kit remove <skill-name>` — remove single skill
- `epost-kit remove --role <role-name>` — remove entire role

Flow:
1. Check reverse deps (warn if removing a skill another depends on)
2. Show what will be removed
3. Prompt confirmation
4. Delete skill/agent files
5. Update `.epost.json`
6. Regenerate `CLAUDE.md`

Guard: cannot remove `core` skill.

### 2.4 `epost-kit list` command

**File**: `src/commands/list.ts`

- Read `.epost.json`
- Display installed skills grouped by role (if role-installed) or ungrouped
- Show version, install date
- `--json` flag

### 2.5 `epost-kit upgrade` command

**File**: `src/commands/upgrade.ts` (extend existing)

- Compare installed skill versions vs latest (from local bundles or remote)
- Show per-skill diff: `web-frontend 1.0.0 → 1.1.0`
- `--check` flag: dry run only
- Prompt per-item: install update? (yes/no/all)
- On accept: copy new files, update `.epost.json`

### 2.6 Wire commands into CLI entry

**File**: `src/cli.ts`

Register new commands with cac:
```typescript
cli.command('roles', 'List available role bundles').action(rolesCmd);
cli.command('add [name]', 'Install a skill or role').option('--role <name>').action(addCmd);
cli.command('remove [name]', 'Remove a skill or role').option('--role <name>').action(removeCmd);
cli.command('list', 'Show installed skills and roles').action(listCmd);
```

### 2.7 Deprecation wrapper for `--profile`

**File**: `src/commands/init.ts` (modify)

When `--profile` flag detected:
1. Log deprecation warning: "Use `epost-kit add --role <name>` instead"
2. Map profile to role(s) via `profile-aliases.ts`
3. Execute add flow transparently

## Files Changed

| File | Repo | Action |
|------|------|--------|
| `src/commands/roles.ts` | cli | create |
| `src/commands/add.ts` | cli | create |
| `src/commands/remove.ts` | cli | create |
| `src/commands/list.ts` | cli | create |
| `src/commands/upgrade.ts` | cli | modify (add version compare) |
| `src/commands/init.ts` | cli | modify (deprecation path) |
| `src/cli.ts` | cli | modify (register commands) |

## Validation

- [x] `epost-kit roles` displays all 7 roles with correct skill counts
- [x] `epost-kit add web-a11y` installs `a11y` + `web-a11y` (dep resolved)
- [x] `epost-kit add --role ios-developer` installs 6 skills + 3 agents
- [x] `epost-kit remove web-a11y` warns about dependents, removes correctly
- [x] `epost-kit list` shows installed with grouping
- [x] `init --profile web` shows deprecation, installs correctly
- [x] `.epost.json` updated after every add/remove

## Tests

- `tests/commands/roles.test.ts`
- `tests/commands/add.test.ts` — mock file ops, verify resolver called
- `tests/commands/remove.test.ts` — reverse dep warning
- `tests/commands/list.test.ts`
