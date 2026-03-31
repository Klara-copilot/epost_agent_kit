# Knowledge Capture Reference

Post-task workflow for persisting learnings to `docs/` for team-wide reuse.

## When to Capture

| Trigger | Document Type |
|---------|--------------|
| Root cause of a bug found | FINDING |
| New implementation pattern used | PATTERN |
| Technology choice made | ADR |
| Coding convention established | CONV |
| Architectural decision made | ADR |
| System structure documented | ARCH |
| Feature deep-dive completed | FEAT |

## Capture Workflow

### 1. Identify
What was learned? (root cause, pattern, decision, convention, architecture, feature)

### 2. Categorize
See `knowledge-base.md` for schema, categories, and significance thresholds.

### 3. Check Existing
```bash
jq '.entries[] | select(.tags[] | contains("your-topic"))' docs/index.json
grep -r "your topic" docs/ --include="*.md"
```
If exists: update rather than duplicate.

### 4. Write Entry
Use the appropriate template below.

### 5. Update Index
Edit `docs/index.json`:
- Add entry to `entries[]`
- Include `agentHint` and `audience: ["agent", "human"]`
- Update `updatedAt`
- Sort by category, then ID

### 6. Cross-Reference
Add IDs to `related` array of related entries.

## Entry Templates

### ADR (Architecture Decision)

```markdown
---
id: ADR-NNNN
title: [Active voice decision]
status: proposed
created: YYYY-MM-DD
tags: [architecture, domain]
---

## Context
[Situation, constraints, driving forces]

## Decision
[What we're doing]

## Consequences
**Positive**: [benefits]
**Negative**: [trade-offs]

## Alternatives Considered
**Option A**: [pros, cons, rejection reason]
```

### Pattern (Implementation)

```markdown
---
id: PATTERN-NNNN
title: [Pattern name]
status: active
created: YYYY-MM-DD
tags: [technology, domain]
---

## When to Use
[Scenario where pattern applies]

## Implementation
[Code example]

## Caveats
[Limitations, gotchas]
```

### Convention (Coding Standard)

```markdown
---
id: CONV-NNNN
title: [Convention rule]
status: active
created: YYYY-MM-DD
tags: [code-style, language]
---

**Rule**: [Convention statement]
**Good**: [Example following rule]
**Bad**: [Example violating rule]
**Rationale**: [Why this convention]
**Enforcement**: [Linter rule, review checklist]
```

### Finding (Debug Root Cause)

```markdown
---
id: FINDING-NNNN
title: [Short symptom description]
status: resolved
created: YYYY-MM-DD
tags: [technology, bug-type]
---

**Symptom**: [Observable behavior]
**Root Cause**: [Underlying issue]
**Resolution**: [Fix applied]
**Prevention**: [How to avoid future occurrences]
```

### Architecture (System Structure)

```markdown
---
id: ARCH-NNNN
title: [System aspect]
status: current
created: YYYY-MM-DD
tags: [architecture, system-design]
---

## Overview
[What this documents]

## Components
[Module/component descriptions and relationships]

## Data Flow
[How data moves through the system]
```

### Feature (Deep-Dive Guide)

```markdown
---
id: FEAT-NNNN
title: [Feature name]
status: current
created: YYYY-MM-DD
tags: [feature, domain]
---

## Overview
[Feature purpose and scope]

## Usage
[How to use/configure]

## Implementation
[Key implementation details]

## Known Limitations
[Gotchas, edge cases]
```

## File Operations

```bash
# Determine next ID
jq -r '[.entries[] | select(.category == "finding") | .id] | sort | last' docs/index.json

# Update existing entry path
ENTRY_PATH=$(jq -r '.entries[] | select(.id == "FINDING-0012") | .path' docs/index.json)
```

## Quality Checklist

- [ ] Category appropriate for learning type
- [ ] ID follows `PREFIX-NNNN` format
- [ ] Frontmatter complete
- [ ] Title descriptive (5-10 words)
- [ ] Tags relevant and specific
- [ ] Content concise (bullets, code blocks)
- [ ] Cross-references added to `related`
- [ ] Index updated (entry + agentHint + audience)
- [ ] File saved to correct category directory

## Writing Tips

- **Bullets** over paragraphs
- **Tables** for comparisons
- **Code blocks** for examples
- **Numbers** not words ("3 steps" not "three steps")
- **Active voice** ("use X" not "X should be used")
