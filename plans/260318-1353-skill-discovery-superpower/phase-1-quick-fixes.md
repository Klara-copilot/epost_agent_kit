---
phase: 1
title: "Quick Fixes: Phantom Refs, Wiring, Validator"
effort: 1.5h
depends: []
---

# Phase 1: Quick Fixes

Low-risk, high-value cleanup. Addresses Gaps 4, 5, 6, 9, 10.

## Tasks

### 1.1 Remove phantom `ui-guidance` references (Gap 9)

**Files to edit** (all in `packages/`):
- `packages/core/skills/skill-discovery/SKILL.md` — remove `ui-guidance` from Quick Reference table (line ~163)
- `packages/core/scripts/generate-skill-index.cjs` — remove `'ui-guidance': 'design-system'` from CATEGORY_MAP (line 49)

**Validation**: grep for `ui-guidance` across repo — 0 hits expected (except this plan).

### 1.2 Add `launchpad` to skill-index (Gap 4)

`launchpad` has a SKILL.md at `packages/design-system/skills/launchpad/SKILL.md` but the generator only scans `packages/core/skills/`. The generator already supports comma-separated paths.

**Fix**: Update the `epost-kit init` copy/generate flow (or the script invocation) to include `packages/design-system/skills/` as a second scan directory. Alternatively, ensure init copies `launchpad/` into `packages/core/skills/` before generation.

**Simpler alternative**: The generator scans `.claude/skills/` at runtime (post-init). After `epost-kit init`, all skills land in `.claude/skills/`. So the issue is that generation runs from `packages/core/scripts/` pre-init.

**Action**: Verify launchpad has proper frontmatter (name, description, keywords). If it does, the generator just needs to scan the right dirs. Document the multi-dir invocation pattern.

### 1.3 Wire skill-discovery to 3 missing agents (Gap 5)

Add `skill-discovery` to `skills:` list in:
- `packages/a11y/agents/epost-a11y-specialist.md`
- `packages/design-system/agents/epost-muji.md`
- `packages/kit/agents/epost-kit-designer.md`

**Validation**: grep `skills:` in all 15 agent files, confirm all include `skill-discovery`.

### 1.4 Fix validator agent names (Gap 6)

**File**: `.github/scripts/validate-role-scenarios.cjs`

Replace outdated agents with real ones:
| Outdated | Replacement |
|----------|-------------|
| `epost-ios-developer` | `epost-fullstack-developer` |
| `epost-android-developer` | `epost-fullstack-developer` |
| `epost-architect` | `epost-planner` |

Lines: 363, 371, 387, 404, 412, 420, 428, 436, 510, 527.

**Validation**: `node .github/scripts/validate-role-scenarios.cjs` runs without "unknown agent" warnings.

### 1.5 Add git-state signals to skill-discovery Step 1 (Gap 10)

**File**: `packages/core/skills/skill-discovery/SKILL.md`

Add new section `### 1d. Git-State Signals` after 1c:

```markdown
### 1d. Git-State Signals
Check `git status` and `git diff --name-only` for context:

| Signal | Interpretation | Skills Boost |
|--------|---------------|--------------|
| Staged files present | Review or Git intent | code-review, git |
| Merge conflict markers | Fix intent | fix, error-recovery |
| Untracked SKILL.md / agent .md | Kit authoring | kit-skill-development, kit-agent-development |
| Files in `plans/` changed | Planning context | plan, cook |
| `package.json` / `pom.xml` changed | Dependency work | platform skill for affected package |
```

**Validation**: section exists, no broken markdown.

## Completion Checklist

- [ ] `ui-guidance` removed from all files
- [ ] `launchpad` appears in generated skill-index.json
- [ ] All 15 agents have `skill-discovery` in skills list
- [ ] Validator references only existing agents
- [ ] Git-state signals section added to skill-discovery
