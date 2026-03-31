---
phase: 3
title: "Scoring, Priority & Tie-Breaking"
effort: 2h
depends: [2]
---

# Phase 3: Scoring, Priority & Tie-Breaking

Add deterministic skill ranking. Addresses Gaps 2, 8 and Improvements 2, 3.

## Tasks

### 3.1 Add `priority` field to SKILL.md frontmatter (Improvement 2)

Field: `priority: 0.0–1.0` (MCP annotation standard).

**Defaults by tier**:
| Tier | Default Priority |
|------|-----------------|
| core | 0.9 |
| workflow (cook, plan, fix, debug, test) | 0.8 |
| platform-development | 0.7 |
| platform-ui-lib | 0.6 |
| reasoning/knowledge | 0.5 |
| domain | 0.4 |
| infrastructure | 0.3 |

**File**: `packages/core/scripts/generate-skill-index.cjs` — read `priority` from frontmatter, fallback to tier-based default.

Add to ~20 high-traffic skills from Phase 2. Generator emits `priority` in output JSON.

### 3.2 Document confidence scoring formula (Improvement 3)

**File**: `packages/core/skills/skill-discovery/SKILL.md`

Replace current Step 3 ranking list with a point-based formula:

```markdown
## Step 3: Score and Rank Candidates

For each matched skill, compute a confidence score:

| Factor | Points | Example |
|--------|--------|---------|
| Explicit keyword match in user request | +3 | user says "Figma" → figma skill |
| Trigger pattern match | +2 | `.swift` file in diff → ios-development |
| Platform match | +2 | detected platform = ios → all ios-* skills |
| Agent-affinity match | +1 | epost-muji running → design-tokens |
| Priority field bonus | +priority×2 | priority 0.8 → +1.6 |
| Example utterance similarity (future) | +0-3 | reserved for embedding match |

**Selection**: Sort by score descending. Take top 3 (dependencies don't count toward limit).

**Tie-breaking**: If two skills score equal, prefer:
1. Higher `priority` field
2. Fewer `connections.requires` (simpler = better)
3. Alphabetical (deterministic fallback)
```

### 3.3 Enforce discovery protocol via checklist comment (Gap 2)

Full mechanical enforcement is too heavy (YAGNI). Instead:

**File**: `packages/core/skills/skill-discovery/SKILL.md`

Add at top of "When to Activate":
```markdown
**Self-check**: Before producing your first substantive response, verify:
- [ ] Did I check platform signals? (Step 1a)
- [ ] Did I check task-type signals? (Step 1b)
- [ ] Did I query skill-index.json? (Step 2)

If you skipped discovery, STOP and run it now. Loading the wrong skills
(or none) causes downstream errors that cost more tokens to fix.
```

This is soft enforcement but leverages the model's instruction-following. Full hook-based enforcement deferred (see Unresolved Q3).

### 3.4 Update generator to emit scoring metadata

**File**: `packages/core/scripts/generate-skill-index.cjs`

Add to each skill entry:
```js
priority: parseFloat(metadata.priority || metadata.metadata?.priority) || defaultPriorityForTier(skill.tier),
```

Where `defaultPriorityForTier()` implements the table from 3.1.

## Completion Checklist

- [ ] `priority` field in 20+ skills
- [ ] Confidence scoring formula in skill-discovery SKILL.md
- [ ] Tie-breaking rules documented
- [ ] Generator emits `priority` in output
- [ ] Self-check added to discovery protocol
