---
phase: 1
title: "CLAUDE.md: weight-based routing + core law-layer"
effort: 2h
depends: []
---

## Context Links

- Plan: [plan.md](./plan.md)
- Source file: `packages/core/CLAUDE.snippet.md`
- Design: `docs/architecture/ARCH-0002-claude-native-mechanics-and-routing-design.md`

## Overview

Replace the prescriptive intent routing table (~70 lines) with a weight-based execution rule (~15 lines). Embed ~30 lines of core law-layer directly. Net reduction: ~40+ lines.

## Requirements

### Functional
1. **Remove** the Intent Map table (11 rows), fuzzy matching block, web-specific examples, routing rules (12 rules)
2. **Add** weight-based execution rule (P1):
   - Simple (< 5 steps, single file, reversible) → execute inline
   - Major (long, parallel, destructive, cross-platform) → spawn agent
3. **Add** capability catalogue: list available agents + what they're good at (declarative, not prescriptive)
4. **Embed** core law-layer (P8): decision authority table + never-do list (~30 lines from core SKILL.md)
5. **Keep** orchestration section, platform detection, project identity

### Non-Functional
- Total CLAUDE.snippet.md under 120 lines (allows headroom for profile-specific sections)
- No routing rules that duplicate Claude's native intent classification

## Files to Change

- `packages/core/CLAUDE.snippet.md` — **Modify**: full rewrite of Routing section

## Implementation Steps

1. Read current `packages/core/CLAUDE.snippet.md` in full
2. Draft new Routing section:
   - Remove: Intent Map table, Prompt Classification, fuzzy matching, web examples, routing rules 1-12
   - Add: weight-based execution rule (inline vs. spawn)
   - Add: agent capability catalogue (name + when useful, 1 line each)
   - Keep: platform detection signals, slash command override
3. Draft law-layer section (extract from core SKILL.md):
   - Decision authority table (auto-execute vs. ask first)
   - Never-do list (5 items max)
   - Safety constraints (3 items max)
4. Integrate into CLAUDE.snippet.md, verify < 120 lines
5. Run `epost-kit init` and verify generated CLAUDE.md

## Todo List

- [x] Remove intent routing table and fuzzy matching
- [x] Add weight-based execution rule
- [x] Add agent capability catalogue
- [x] Embed core law-layer
- [x] Verify CLAUDE.snippet.md < 120 lines (76 lines)
- [ ] Run epost-kit init, verify generation (deferred to finalize phase)

## Success Criteria

- No intent routing table exists in CLAUDE.snippet.md
- Weight-based rule present: simple→inline, major→spawn
- Core law-layer embedded (decision authority + never-do)
- File under 120 lines total

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing routing table causes misrouting | Medium | Capability catalogue still lists agents; Claude classifies naturally |
| Law-layer duplicates core SKILL.md | Low | Core SKILL.md keeps full detail; CLAUDE.md has summary only |
