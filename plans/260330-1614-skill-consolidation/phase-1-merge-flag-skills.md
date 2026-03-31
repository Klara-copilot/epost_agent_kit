---
phase: 1
title: "Merge flag-based skills into parents"
effort: 1.5h
depends: []
---

# Phase 1: Merge Flag-Based Skills Into Parents

Merge 5 standalone skills into their parent skills as `--flag` sections with content moved to `references/`.

## Tasks

### 1.1 security-scan → security --scan

| Step | Action |
|------|--------|
| Read | `packages/core/skills/security-scan/SKILL.md` (136 LOC) |
| Create | `packages/core/skills/security/references/scan.md` — move scan workflow content |
| Edit | `packages/core/skills/security/SKILL.md` — add `--scan` flag row to flag table |
| Delete | `packages/core/skills/security-scan/` directory |

**Flag table addition to security/SKILL.md:**
```markdown
## Flags
| Flag | Reference | When |
|------|-----------|------|
| `--scan` | `references/scan.md` | Pre-commit security scan (secrets, injection, unsafe patterns) |
```

### 1.2 predict → plan --predict

| Step | Action |
|------|--------|
| Read | `packages/core/skills/predict/SKILL.md` (100 LOC) |
| Create | `packages/core/skills/plan/references/predict-mode.md` — move 5-persona debate content |
| Edit | `packages/core/skills/plan/SKILL.md` — add `--predict` flag row to existing Mode Reference table |
| Delete | `packages/core/skills/predict/` directory |

**Add to plan/SKILL.md Mode Reference table:**
```markdown
| `--predict` | `references/predict-mode.md` | 5-persona expert debate before major changes |
```

### 1.3 scenario → test --scenario

| Step | Action |
|------|--------|
| Read | `packages/core/skills/scenario/SKILL.md` (91 LOC) |
| Create | `packages/core/skills/test/references/scenario-mode.md` — move edge case generation content |
| Edit | `packages/core/skills/test/SKILL.md` — add `--scenario` flag row |
| Delete | `packages/core/skills/scenario/` directory |

**Flag table addition to test/SKILL.md:**
```markdown
| `--scenario` | `references/scenario-mode.md` | Generate edge cases (user types, input extremes, timing, scale) |
```

### 1.4 retro → git --retro

| Step | Action |
|------|--------|
| Read | `packages/core/skills/retro/SKILL.md` (125 LOC) |
| Create | `packages/core/skills/git/references/retro.md` — move retrospective workflow content |
| Edit | `packages/core/skills/git/SKILL.md` — add `--retro` flag row |
| Delete | `packages/core/skills/retro/` directory |

**Flag table addition to git/SKILL.md:**
```markdown
| `--retro` | `references/retro.md` | Data-driven retrospective (commit metrics, churn, completion) |
```

### 1.5 llms → docs --llms

| Step | Action |
|------|--------|
| Read | `packages/core/skills/llms/SKILL.md` (112 LOC) |
| Create | `packages/core/skills/docs/references/llms.md` — move llms.txt generation content |
| Edit | `packages/core/skills/docs/SKILL.md` — add `--llms` flag row |
| Delete | `packages/core/skills/llms/` directory |

**Flag table addition to docs/SKILL.md:**
```markdown
| `--llms` | `references/llms.md` | Generate llms.txt / llms-full.txt (llmstxt.org spec) |
```

## Validation

- [ ] Each parent SKILL.md has the new flag row
- [ ] Each `references/*.md` file contains the full workflow from the deleted skill
- [ ] All 5 standalone directories deleted
- [ ] No broken cross-references in other skills (grep for old skill names)
