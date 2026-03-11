---
phase: 3
title: "Run epost-kit init and verify"
effort: 20m
depends: [2]
---

# Phase 3: Run epost-kit init + Verify

## Step 1: Run epost-kit init

```bash
cd /Users/than/Projects/epost_agent_kit && npx epost-kit init
```

This regenerates `.claude/` from `packages/`. All moved/renamed files must appear in `.claude/skills/audit/references/` with the new structure.

## Step 2: Verify .claude/ mirror matches packages/

```bash
# Verify new structure exists in .claude/
ls .claude/skills/audit/references/ui/     # 5 files
ls .claude/skills/audit/references/a11y/   # 4 files

# Verify old files do NOT exist in .claude/
test ! -f .claude/skills/audit/references/ui.md
test ! -f .claude/skills/audit/references/a11y.md
test ! -f .claude/skills/audit/references/close-ui.md
test ! -f .claude/skills/audit/references/close-a11y.md
test ! -f .claude/skills/audit/references/audit-report-schema.md
test ! -f .claude/skills/audit/references/ios-audit-mode.md
test ! -f .claude/skills/audit/references/android-audit-mode.md
test ! -f .claude/skills/audit/references/checklist-web.md
test ! -f .claude/skills/audit/references/checklist-web-organism.md
test ! -f .claude/skills/audit/references/ui-known-findings-schema.md
```

## Step 3: Grep for broken references across entire repo

```bash
# These must all return zero matches:
grep -rn "references/ui\.md" .claude/skills/audit/ .claude/agents/ packages/
grep -rn "references/a11y\.md" .claude/skills/audit/ .claude/agents/ packages/
grep -rn "close-ui\.md" .claude/ packages/
grep -rn "close-a11y\.md" .claude/ packages/
grep -rn "ios-audit-mode\.md" .claude/ packages/
grep -rn "android-audit-mode\.md" .claude/ packages/
grep -rn "audit-report-schema\.md" .claude/ packages/
grep -rn "ui-known-findings-schema\.md" .claude/ packages/
grep -rn "checklist-web-organism\.md" .claude/ packages/
grep -rn "checklist-web\.md" .claude/skills/audit/ packages/core/skills/audit/
```

Note: `checklist-web.md` grep is scoped to audit only — `web-a11y/references/` has its own unrelated files.

## Step 4: Sanity-test skill loading

Open a new Claude Code session and run `/audit --help` or trigger auto-detection to confirm skill loads without errors.
