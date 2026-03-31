---
phase: 2
title: "Frontmatter-Driven Connections & Categories"
effort: 2.5h
depends: [1]
---

# Phase 2: Frontmatter-Driven Connections & Categories

Move `category`, `connections`, and `examples` from hardcoded maps into SKILL.md frontmatter. Addresses Gaps 1, 7 and Improvement 1.

## Tasks

### 2.1 Extend SKILL.md frontmatter schema

Add three new optional frontmatter fields:

```yaml
metadata:
  category: frontend-web          # was in CATEGORY_MAP
  connections:                     # was in CONNECTION_MAP
    extends: [a11y]
    requires: [figma]
    enhances: [web-frontend]
    conflicts: []
  examples:                        # NEW — Improvement 1
    - "add a button to the header"
    - "fix the login form styling"
    - "update the API endpoint"
```

**File**: `packages/core/skills/kit-skill-development/SKILL.md` — document new fields in the "Frontmatter Reference" section.

### 2.2 Update generator to prefer frontmatter over hardcoded maps

**File**: `packages/core/scripts/generate-skill-index.cjs`

Current logic (line 281-285):
```js
const connections = CONNECTION_MAP[name] || {};
category: CATEGORY_MAP[name] || 'uncategorized',
```

New logic:
```js
// Prefer frontmatter metadata, fall back to hardcoded maps
const fmConnections = metadata.connections || metadata.metadata?.connections || {};
const connections = {
  extends:   fmConnections.extends   || CONNECTION_MAP[name]?.extends   || [],
  requires:  fmConnections.requires  || CONNECTION_MAP[name]?.requires  || [],
  enhances:  fmConnections.enhances  || CONNECTION_MAP[name]?.enhances  || [],
  conflicts: fmConnections.conflicts || CONNECTION_MAP[name]?.conflicts || [],
};
const category = metadata.category || metadata.metadata?.category || CATEGORY_MAP[name] || 'uncategorized';
```

Keep hardcoded maps as fallback — allows gradual migration.

Add `examples` to output:
```js
const skill = {
  ...existing,
  examples: metadata.examples || metadata.metadata?.examples || [],
};
```

### 2.3 Add frontmatter to ~20 high-traffic skills

Prioritize skills that already have CONNECTION_MAP entries. Add `category`, `connections`, and 3-5 `examples` to each.

Target skills (grouped by priority):
1. **Platform A11y** (3): ios-a11y, android-a11y, web-a11y — already have extends
2. **Platform Dev** (6): web-nextjs, web-api-routes, ios-ui-lib, android-ui-lib, backend-databases, web-modules
3. **Design** (2): ui-lib-dev, design-tokens — have requires
4. **Reasoning** (5): problem-solving, sequential-thinking, error-recovery, docs-seeker, knowledge-retrieval
5. **Workflow** (4): cook, debug, test, audit

**Validation**: Run `node generate-skill-index.cjs`, compare output. Connections should match previous (from hardcoded) + new examples field populated.

### 2.4 Consolidate to single skill-index.json (Gap 7)

Currently: `packages/core/skills/skill-index.json` (46 skills, stale) vs `.claude/skills/skill-index.json` (65 skills).

**Fix**:
1. Delete `packages/core/skills/skill-index.json` — it's generated output, not source
2. Generator writes only to `.claude/skills/skill-index.json` (already the case)
3. Add comment in `packages/core/scripts/generate-skill-index.cjs` header: "Output goes to .claude/skills/ — do not create a second copy in packages/"

**Validation**: Only one `skill-index.json` exists (in `.claude/skills/`).

## Completion Checklist

- [ ] Generator reads category/connections/examples from frontmatter
- [ ] Hardcoded maps kept as fallback (no breaking change)
- [ ] 20 skills have frontmatter-driven metadata
- [ ] Single skill-index.json (in `.claude/skills/` only)
- [ ] kit-skill-development docs updated with new fields
