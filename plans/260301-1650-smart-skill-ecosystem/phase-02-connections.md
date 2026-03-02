# Phase 02: Skill Connection Graph

## Context Links
- Parent: [plan.md](./plan.md)
- Phase 01: [phase-01-categories.md](./phase-01-categories.md)

## Overview
**Date**: 2026-03-01
**Priority**: P1
**Description**: Define formal inter-skill relationships — extends, requires, enhances, conflicts. Add `connections` field to `skill-index.json`.
**Implementation Status**: Pending

## Key Insights

Currently skills reference each other only in prose ("Related Skills" sections). No machine-readable graph. This means `skill-discovery` cannot chain-load dependencies.

### Connection Types

| Type | Meaning | Example | Loading Behavior |
|------|---------|---------|-----------------|
| **extends** | Specialization of base skill | `ios-a11y` extends `a11y` | Load base first, then specialization |
| **requires** | Must be loaded together | `web-ui-lib-dev` requires `web-ui-lib` | Auto-load required skill |
| **enhances** | Optional boost if loaded | `sequential-thinking` enhances `debugging` | Suggest but don't auto-load |
| **conflicts** | Should not load together | `cook-fast` conflicts `cook-parallel` | Warn if both detected |

### Proposed Connection Graph

#### Platform-A11y Chains (extends)
```
a11y <-- ios-a11y
a11y <-- android-a11y
a11y <-- web-a11y
```

#### Platform Development Chains (enhances)
```
web-frontend <-- web-nextjs (enhances)
web-frontend <-- web-api-routes (enhances)
web-frontend <-- web-modules (enhances)
ios-development <-- ios-ui-lib (enhances)
android-development <-- android-ui-lib (enhances)
backend-javaee <-- backend-databases (enhances)
```

#### Design System Chains (requires)
```
web-ui-lib-dev --> web-ui-lib (requires)
web-ui-lib-dev --> web-figma (requires)
web-figma-variables --> web-figma (requires)
docs-component --> web-ui-lib (requires)
docs-component --> web-figma (requires)
```

#### Knowledge Chains (enhances)
```
debugging <-- problem-solving (enhances)
debugging <-- sequential-thinking (enhances)
debugging <-- error-recovery (enhances)
research <-- docs-seeker (enhances)
research <-- knowledge-retrieval (enhances)
planning <-- knowledge-retrieval (enhances)
knowledge-capture <-- knowledge-base (requires)
```

#### Kit Chains (requires)
```
kit-add-agent --> kit-agent-development (requires)
kit-add-skill --> kit-skill-development (requires)
kit-add-command --> kit-commands (requires)
kit-add-hook --> kit-hooks (requires)
kit-optimize-skill --> kit-skill-development (requires)
```

#### Workflow Variant Chains (conflicts)
```
cook-fast <-> cook-parallel (conflicts)
plan-fast <-> plan-deep (conflicts)
plan-fast <-> plan-parallel (conflicts)
plan-deep <-> plan-parallel (conflicts)
bootstrap-fast <-> bootstrap-parallel (conflicts)
fix <-> fix-deep (conflicts — fix is quick, fix-deep is thorough)
```

#### RAG Chains (enhances)
```
web-rag --> web-frontend (enhances)
ios-rag --> ios-development (enhances)
```

#### Cross-Cutting (enhances)
```
verification-before-completion -- enhances --> all dev-workflow skills
receiving-code-review -- enhances --> code-review
subagent-driven-development -- enhances --> planning
hub-context -- enhances --> skill-discovery
```

## Requirements
### Functional
- Add `connections` object to each skill entry in `skill-index.json`
- Connection types: extends, requires, enhances, conflicts
- Each connection references a skill name (string)
### Non-Functional
- Max 3-hop chain depth to prevent context bloat
- Connections are directional (except conflicts which are bidirectional)

## Architecture

```json
{
  "name": "ios-a11y",
  "category": "accessibility",
  "connections": {
    "extends": ["a11y"],
    "requires": [],
    "enhances": [],
    "conflicts": []
  },
  ...
}
```

Validation rule: No circular `requires` chains. `extends` implies `requires` for loading.

## Related Code Files
### Modify (EXCLUSIVE)
- `.claude/skills/skill-index.json` — Add connections field [OWNED]
- `.claude/scripts/generate-skill-index.cjs` — Parse "Related Skills" from SKILL.md files [OWNED]
### Create (EXCLUSIVE)
- `.claude/scripts/validate-skill-connections.cjs` — Cycle detection, orphan check [OWNED]
### Read-Only
- `.claude/skills/*/SKILL.md` — "Related Skills" sections as input

## Implementation Steps
1. Define connection rules in generator (naming convention + manual overrides)
2. Parse "Related Skills" / "Related Documents" from each SKILL.md
3. Map prose references to formal connection types
4. Add `connections` object to each index entry
5. Write validation script: no circular requires, max 3-hop extends
6. Run validation, fix any cycles

## Todo List
- [ ] Define connection mapping rules
- [ ] Update generator to parse related skills
- [ ] Add connections to index entries
- [ ] Write cycle-detection validator
- [ ] Validate graph integrity

## Success Criteria
- All skills have `connections` object (empty arrays OK)
- No circular `requires` or `extends` chains
- At least 30 skills have non-empty connections
- Validation script passes clean

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Circular requires | Loader infinite loop | Cycle detection in validator |
| Over-connecting | Token bloat from chain loading | Max 3-hop limit |
| Missing connections | Skills not chained | Audit all "Related Skills" sections |

## Security Considerations
None.

## Next Steps
Phase 03 uses connection graph for smart loading decisions.
