---
phase: 3
title: "Agent skill list fixes + code-review escalation steps + lightweight scope"
effort: 45m
depends: []
---

# Phase 3: Agent Wiring & Scope Documentation

## Tasks

### 3.1 Remove `a11y` from epost-muji skills list (Gap 3)

**File**: `packages/design-system/agents/epost-muji.md`

**Line 6**: Change:
```
skills: [core, skill-discovery, figma, design-tokens, ui-lib-dev, ui-guidance, audit, knowledge-retrieval, a11y]
```
To:
```
skills: [core, skill-discovery, figma, design-tokens, ui-lib-dev, ui-guidance, audit, knowledge-retrieval]
```

**Rationale**: muji delegates a11y findings to epost-a11y-specialist (line 108-110 of agent file). Loading the a11y skill implies muji should handle remediation. The delegation intake section already says "collect A11Y findings, note for a11y-specialist delegation" -- no skill needed.

### 3.2 Add `knowledge-retrieval` to epost-code-reviewer skills list (Gap 4)

**File**: `packages/core/agents/epost-code-reviewer.md`

**Line 7**: Change:
```
skills: [core, skill-discovery, code-review]
```
To:
```
skills: [core, skill-discovery, code-review, knowledge-retrieval]
```

**Rationale**: code-review SKILL.md line 56 says "Escalate to `/audit --code` -- activate knowledge-retrieval for deeper context". The skill must be in the agent's skills list to guarantee loading on escalation.

### 3.3 Replace vague escalation instruction with explicit steps (Gap 5)

**File**: `packages/core/skills/code-review/SKILL.md`

**Lines 86-87** (Template C block): Replace:
```
- No Task tool needed -- activate knowledge-retrieval inline and re-examine
```
With:
```
- No Task tool needed -- escalate inline:
  1. Load `knowledge-retrieval` skill (already in agent skills list)
  2. Execute search strategy: L1 docs/ (conventions, findings) -> L2 RAG (implementations) -> L4 Grep fallback
  3. Document KB layers used in report Methodology section
  4. Re-examine files with retrieved context; update findings
```

### 3.4 Add lightweight review scope table (Gap 6)

**File**: `packages/core/skills/code-review/SKILL.md`

After the "Escalation Gate" section (after line 65), add:

```markdown
### Lightweight vs. Escalated Review Scope

| Category | Lightweight (default) | Escalated (knowledge-retrieval active) |
|----------|-----------------------|---------------------------------------|
| Structure | File organization, module boundaries | + architectural pattern compliance |
| Logic | Algorithm correctness, edge cases | + cross-module impact analysis |
| State machines | Transition completeness | + concurrent mutation safety |
| Types | Type safety, missing checks | + generic constraint validation |
| Performance | Obvious N+1, unnecessary renders | + bundle impact, memoization audit |
| Security | OWASP Top 10 surface scan | + deep input validation, auth flow trace |
| Tests | Test file exists, covers changed code | + coverage gap analysis, edge case completeness |
| Standards source | code-review/SKILL.md only | + docs/ conventions, RAG patterns |

**Rule**: Lightweight review does NOT load knowledge-retrieval. Only categories in the "Lightweight" column are checked. If a Critical finding is detected, escalate to the full column.
```

## Validation

- [ ] epost-muji.md skills list does NOT contain `a11y`
- [ ] epost-code-reviewer.md skills list contains `knowledge-retrieval`
- [ ] code-review SKILL.md Template C block has 4-step escalation sequence
- [ ] code-review SKILL.md has "Lightweight vs. Escalated Review Scope" table
- [ ] No other files modified in this phase
