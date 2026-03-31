---
phase: 3
title: "Marketplace TUI"
effort: 5h
depends: [1, 2]
---

# Phase 3: Marketplace TUI

Interactive terminal browse experience: `epost-kit browse`

## Tasks

### 3.1 Browse command entry point

**File**: `src/commands/browse.ts`

Main loop:
1. Load bundles + installed state
2. Render tab bar (All Roles / Installed / Updates Available)
3. Render role cards filtered by active tab
4. Handle: select card → action menu (Install / Remove / Details)
5. Loop until user exits

### 3.2 Card renderer

**File**: `src/domains/ui/marketplace-cards.ts`

Uses `cli-table3` for card grid layout. Each card:

```
┌─────────────────────────────────────┐
│  web-frontend                  v1.0 │
│  ● installed                        │
│                                     │
│  React, Next.js, testing, i18n...   │
│  8 skills · 3 agents               │
└─────────────────────────────────────┘
```

Status badges via picocolors:
- `● installed` (green)
- `↑ update available` (yellow)
- `○ available` (dim)

Card rendering function:
```typescript
function renderRoleCard(role: RoleBundle, state: InstallState): string
function renderCardGrid(roles: RoleBundle[], state: InstallState, cols?: number): string
```

Auto-detect terminal width → 1 or 2 column layout.

### 3.3 Tab navigation

**File**: `src/domains/ui/marketplace-tabs.ts`

Uses `@inquirer/prompts` `select()` for tab + card selection:

```typescript
const TAB_CHOICES = [
  { name: 'All Roles', value: 'all' },
  { name: 'Installed', value: 'installed' },
  { name: 'Updates Available', value: 'updates' },
  new Separator(),
  { name: '🔍 Search', value: 'search' },
  new Separator(),
  { name: 'Exit', value: 'exit' },
];
```

After tab selection → show filtered cards → select card → action menu.

### 3.4 Search/filter

**File**: `src/domains/ui/marketplace-search.ts`

Uses `@inquirer/prompts` `input()` for keyword search:
- Filter roles by: name, description, skill names, keywords
- Case-insensitive substring match
- Show filtered card grid
- Empty = back to tab menu

### 3.5 Action menu per role

After selecting a role card:

```
  web-frontend — React, Next.js, testing, i18n, auth, a11y

  Skills (8): core, web-frontend, web-nextjs, web-i18n, web-auth,
              web-testing, web-a11y, error-recovery
  Agents (3): epost-fullstack-developer, epost-code-reviewer, epost-tester

  Actions:
  › Install this role
    View skill details
    Back
```

"Install" triggers the same flow as `epost-kit add --role <name>` (reuse Phase 2).

### 3.6 Wire into CLI

**File**: `src/cli.ts` (modify)

```typescript
cli.command('browse', 'Interactive marketplace — browse and install roles').action(browseCmd);
```

Also alias: `epost-kit marketplace` → `browse`

## State Machine

```
[TAB_SELECT] ──(tab chosen)──▸ [CARD_LIST]
    │                              │
    │                         (card chosen)
    │                              ▼
    │                        [ACTION_MENU]
    │                         │       │
    │                    (install)  (back)
    │                         │       │
    │                         ▼       │
    │                   [INSTALL_FLOW]│
    │                         │       │
    │                     (done)      │
    │                         │       │
    └─────────────────────────┘◄──────┘
    │
    (exit / Ctrl+C)
    ▼
   ◉ [EXIT]
```

## Files Changed

| File | Repo | Action |
|------|------|--------|
| `src/commands/browse.ts` | cli | create |
| `src/domains/ui/marketplace-cards.ts` | cli | create |
| `src/domains/ui/marketplace-tabs.ts` | cli | create |
| `src/domains/ui/marketplace-search.ts` | cli | create |
| `src/cli.ts` | cli | modify (register browse) |

## Validation

- [ ] `epost-kit browse` opens interactive mode without crash
- [ ] Card grid renders correctly at 80-col and 120-col widths
- [ ] Tab switching filters cards correctly
- [ ] Search finds roles by keyword (e.g., "figma" → designer)
- [ ] Install from browse triggers full add flow
- [ ] Ctrl+C exits cleanly without hanging
- [ ] `--no-color` / `TERM=dumb` renders ASCII fallback

## Tests

- `tests/domains/ui/marketplace-cards.test.ts` — card rendering, grid layout
- `tests/commands/browse.test.ts` — flow integration (mock prompts)
