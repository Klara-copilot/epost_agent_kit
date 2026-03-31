---
phase: 3
title: "Create unified knowledge skill"
effort: 1h
depends: []
---

# Phase 3: Create Unified Knowledge Skill

Merge knowledge-retrieval + knowledge-capture into a single `knowledge` skill.

## Context

knowledge-retrieval (179 LOC):
- Default behavior (no flag) — internal-first retrieval protocol
- `references/search-strategy.md`
- `references/priority-matrix.md`
- `references/knowledge-base.md`

knowledge-capture (383 LOC):
- `--capture` flag behavior — persist learnings to docs/
- No references/ files

## Tasks

### 3.1 Create knowledge/ directory and SKILL.md

| Step | Action |
|------|--------|
| Create | `packages/core/skills/knowledge/` directory |
| Create | `packages/core/skills/knowledge/SKILL.md` |
| Create | `packages/core/skills/knowledge/references/` directory |

**knowledge/SKILL.md structure:**

```yaml
---
name: knowledge
description: "(ePost) Use when you need prior art, past decisions, or existing patterns — or after tasks to capture learnings"
user-invocable: false
---
```

Body combines:
1. knowledge-retrieval SKILL.md content (default mode, ~179 LOC trimmed)
2. Flag table pointing to capture mode
3. Condensed capture trigger section (when to capture, not full workflow)

```markdown
## Flags
| Flag | Reference | When |
|------|-----------|------|
| `--capture` | `references/capture.md` | After completing a task — persist learnings to docs/ |
```

**Target: SKILL.md under 300 LOC.** Move overflow into references.

### 3.2 Relocate knowledge-retrieval references

| Step | Action |
|------|--------|
| Copy | `knowledge-retrieval/references/search-strategy.md` → `knowledge/references/search-strategy.md` |
| Copy | `knowledge-retrieval/references/priority-matrix.md` → `knowledge/references/priority-matrix.md` |
| Copy | `knowledge-retrieval/references/knowledge-base.md` → `knowledge/references/knowledge-base.md` |

### 3.3 Create capture reference

| Step | Action |
|------|--------|
| Create | `knowledge/references/capture.md` — full capture workflow from knowledge-capture/SKILL.md (383 LOC, trim to ~200) |

Key content to preserve:
- Capture triggers (when to write)
- Document types (ADR, PATTERN, FINDING, CONVENTION)
- File naming and location rules
- Template structure

### 3.4 Delete old directories

| Step | Action |
|------|--------|
| Delete | `packages/core/skills/knowledge-retrieval/` directory |
| Delete | `packages/core/skills/knowledge-capture/` directory |

## Validation

- [ ] `knowledge/SKILL.md` exists and is under 300 LOC
- [ ] `knowledge/references/` has 4 files: search-strategy, priority-matrix, knowledge-base, capture
- [ ] Both old directories deleted
- [ ] Grep for `knowledge-retrieval` and `knowledge-capture` across skills/ and agents/ — update all refs to `knowledge`
- [ ] CONNECTION_MAP refs updated (phase 4 handles, but verify)
