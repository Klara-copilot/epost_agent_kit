---
updated: 2026-03-09
title: "Init CLI Interactive Workflow UX Improvements"
status: archived
created: 2026-03-03
---

# Plan: Init CLI Interactive Workflow UX Improvements

**Date**: 2026-03-03
**Branch**: master
**File**: `epost-agent-cli/src/commands/init.ts`

## Problems

### 1. Redundant triple-prompt in "Selecting options" (Step 4/7)
Three sequential prompts do essentially the same job:
1. `checkbox` — "Select optional packages to include"
2. `confirm` — "Add packages beyond your profile?"
3. `checkbox` — "Select additional packages"

User must answer "no" to the confirm to skip step 3, even though step 1 already served the intent. This is what's visible in the screenshot as confusing duplication.

### 2. IDE/editor selection is hidden / skipped on updates
- Prompt at line 370 is guarded by `!metadata && !opts.yes` — fires only on fresh installs
- On updates (re-running `epost-kit init`), the editor choice is silently inherited without showing the user
- Only 3 options: `claude`, `cursor`, `github-copilot` — missing Zed, Windsurf

### 3. Duplicate step numbering bug
Lines 429 and 449 both call `logger.step(5, 7, ...)`:
- Line 429: `logger.step(5, 7, "Creating backup")` ← should be skipped (only runs when `isUpdate`)
- Line 449: `logger.step(5, 7, "Installing packages")` ← the real step 5
- Downstream steps 6/7 and 7/7 are actually steps 6 and 7 after the backup, so the total is correct but the label collision shows "Step 5" twice to users who are updating

## Solution

### Fix 1: Consolidate "Selecting options" into one step

**Before** (3 prompts):
```
Optional packages checkbox (only shows optional)
  ↓
"Add packages beyond your profile?" confirm
  ↓
Additional packages checkbox (shows non-profile packages)
```

**After** (1 prompt):
```
Single checkbox: "Select extra packages:"
  - groups optional packages first (pre-selected by default if in profile)
  - then additional packages (unchecked by default)
  - separator between groups
```

Implementation: use `@inquirer/prompts` `checkbox` with `Separator` between groups.

### Fix 2: Make editor selection explicit and always accessible

- Move editor selection to its own dedicated step: **Step 2/7** (after "Selecting profiles", before "Resolving packages")
- Remove the `!metadata` guard — always ask on interactive runs unless `--yes` or `--target` flag is set
- Add editor options: `claude`, `cursor`, `github-copilot`, `zed`, `windsurf`
- Label clearly: **"Which editor/IDE are you using?"**

New step ordering:
```
1/7  Locating packages
2/7  Selecting profiles
3/7  Selecting editor      ← NEW position for IDE selection
4/7  Resolving packages
5/7  Selecting extras      ← consolidated optional + additional
6/7  Installing packages
7/7  Generating config + Finalizing  ← merge last two or keep as 6+7
```

### Fix 3: Fix duplicate step label

- Backup is a sub-operation of "Installing packages", not a named user-visible step
- Remove `logger.step(5, 7, "Creating backup")` call — backup runs silently with a spinner
- Keep `logger.step(5, 7, "Installing packages")` as the only step 5

## Files to Change

| File | Changes |
|------|---------|
| `epost-agent-cli/src/commands/init.ts` | All 3 fixes |

No other files need changes — prompts are inline, no extracted prompt modules.

## Implementation Details

### Fix 1 — Consolidated extras checkbox (lines 280–355)

```typescript
// ── Step 4/7: Select extras ──
logger.step(4, 7, "Selecting extras");

const manifests = await loadAllManifests(packagesDir);
const currentPkgSet = new Set(resolved.packages);

if (!opts.yes) {
  const optionalChoices = resolved.optional.map((name) => ({
    name,
    value: name,
    checked: false,
  }));

  const additionalChoices = [...manifests.keys()]
    .filter((name) => !currentPkgSet.has(name) && !resolved.optional.includes(name))
    .map((name) => {
      const m = manifests.get(name);
      return { name: m ? `${name} — ${m.description}` : name, value: name, checked: false };
    });

  const hasExtras = optionalChoices.length > 0 || additionalChoices.length > 0;
  if (hasExtras) {
    const choices: (CheckboxChoice | Separator)[] = [];
    if (optionalChoices.length > 0) {
      choices.push(new Separator("── Optional (from your profile) ──"), ...optionalChoices);
    }
    if (additionalChoices.length > 0) {
      choices.push(new Separator("── Additional packages ──"), ...additionalChoices);
    }

    const selected = await checkbox({ message: "Select extra packages:", choices });
    if (selected.length > 0) {
      const reResolved = await resolvePackages({
        packagesDir, profilesPath, profile: profileName,
        packages: [...resolved.packages, ...selected],
        exclude: excludeList,
      });
      resolved.packages.length = 0;
      resolved.packages.push(...reResolved.packages);
    }
  }
}
```

### Fix 2 — Editor selection placement

Move from current position (line 357–379, after step 4) to **after profile selection (step 2)**, before resolving packages (step 3). Update step numbers accordingly.

Editor options to add:
```typescript
const editorChoices = [
  { name: "Claude Code", value: "claude" },
  { name: "Cursor",      value: "cursor" },
  { name: "GitHub Copilot", value: "github-copilot" },
  { name: "Zed",         value: "zed" },
  { name: "Windsurf",    value: "windsurf" },
];
```

Guard: skip only when `--yes` or `--target` flag provided.

### Fix 3 — Remove backup step label

```typescript
// Before:
logger.step(5, 7, "Creating backup");
// ... backup code ...

// After (backup is silent):
logger.info("Creating backup…");
// ... backup code ...
```

## Acceptance Criteria

- [ ] `epost-kit init` interactive flow shows editor/IDE selection before package resolution
- [ ] Step 4 shows one combined "Select extra packages" checkbox instead of 3 prompts
- [ ] Optional packages are in a labeled group, additional in a second labeled group
- [ ] `epost-kit init` on an existing project also asks for editor choice (unless `--target` flag)
- [ ] Step 5 label never appears twice in the same run
- [ ] All existing `--yes`, `--profile`, `--packages`, `--target`, `--additional` flags still work non-interactively
- [ ] Zed and Windsurf are valid `--target` values

## Out of Scope

- Refactoring `runKitInit` (legacy flow) — separate concern
- Merging `runWizardFlow` and `runPackageInit` — larger refactor, not blocking UX fix
- Extracting prompt modules — cosmetic, can be done later
