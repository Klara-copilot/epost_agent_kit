---
name: knowledge-capture
description: Post-task knowledge capture workflow — persist debug findings, implementation patterns, research results, review conventions to .knowledge/ directory.
keywords: [capture, learn, persist, record, post-mortem, retrospective]
platforms: [all]
triggers: ["capture learnings", "save pattern", "record finding", "what did we learn"]
agent-affinity: [epost-debugger, epost-implementer, epost-researcher, epost-reviewer, epost-architect]
user-invocable: true
---

# Knowledge Capture Skill

## Purpose

Post-task workflow for capturing learnings and persisting knowledge to `.knowledge/` directory for team-wide reuse.

## When Active

- After debugging (root cause found)
- After implementation (new pattern used)
- After research (technology decision made)
- After review (convention established)
- After architecture work (ADR needed)

## Capture Workflow

### 1. Identify
**What was learned?**
- Root cause of a bug
- New implementation pattern
- Technology choice rationale
- Coding convention
- Architectural decision

### 2. Categorize
**Which category fits?**

| Learning Type | Category | Directory |
|---------------|----------|-----------|
| Architectural choice | ADR | `adrs/` |
| Implementation pattern | Pattern | `patterns/` |
| Debug root cause | Finding | `findings/` |
| Technology choice | Decision | `decisions/` |
| Coding standard | Convention | `conventions/` |

### 3. Check Existing
**Already documented?**

```bash
# Search knowledge index
jq '.entries[] | select(.tags[] | contains("your-topic"))' .knowledge/index.json

# Grep for similar entries
grep -r "your topic" .knowledge/ --include="*.md"
```

If exists: Update existing entry instead of creating duplicate

### 4. Write Entry
**Use appropriate template**

See "Entry Templates" section below for category-specific formats.

### 5. Update Index
**Modify `.knowledge/index.json`**

1. Increment `counts.<category>`
2. Add entry to `entries` array
3. Sort by `created` desc

### 6. Cross-Reference
**Link related entries**

Add IDs to `related` array:
```yaml
related: [ADR-0001, PATTERN-005, FINDING-012]
```

## Significance Threshold

### Record When

| Criteria | Example |
|----------|---------|
| **Non-obvious root cause** | Took >10 minutes to find |
| **New pattern emerged** | First use of composition pattern in codebase |
| **Questionable decision** | Could be challenged later ("why did we choose X?") |
| **Inconsistent convention** | Team uses mix of approaches, need standard |
| **Key research finding** | Library comparison reveals important trade-offs |

### Don't Record

| Type | Reason |
|------|--------|
| **Trivial fixes** | Typos, missing imports, formatting |
| **Well-known patterns** | Standard React hooks, basic CRUD |
| **Official docs** | Already in library documentation |
| **Obvious bugs** | Simple logic errors, off-by-one |
| **Personal notes** | Use agent memory instead |

## Entry Templates

### ADR (Architecture Decision)

**Full template in**: `knowledge-base/references/adr-patterns.md`

```markdown
---
id: ADR-NNNN
title: [Active voice decision]
status: proposed
created: YYYY-MM-DD
tags: [architecture, domain]
agent: epost-architect
---

# ADR-NNNN: [Title]

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
agent: epost-implementer
---

# PATTERN-NNNN: [Title]

## When to Use
[Scenario where pattern applies]

## Implementation
```code
[Code example]
```

## Caveats
[Limitations, gotchas]
```

### Finding (Debug Root Cause)

```markdown
---
id: FINDING-NNNN
title: [Short symptom description]
status: resolved
created: YYYY-MM-DD
tags: [technology, bug-type]
agent: epost-debugger
---

# FINDING-NNNN: [Title]

**Symptom**: [Observable behavior]

**Root Cause**: [Underlying issue]

**Resolution**: [Fix applied]

**Prevention**: [How to avoid future occurrences]
```

### Decision (Technology Choice)

```markdown
---
id: DECISION-NNNN
title: Use X over Y
status: accepted
created: YYYY-MM-DD
tags: [technology, domain]
agent: epost-architect
---

# DECISION-NNNN: [Title]

**Options**: [Alternatives evaluated]

**Choice**: [Selected option]

**Rationale**: [Why chosen]

**Trade-offs**: [Acknowledged downsides]
```

### Convention (Coding Standard)

```markdown
---
id: CONVENTION-NNNN
title: [Convention rule]
status: active
created: YYYY-MM-DD
tags: [code-style, language]
agent: epost-reviewer
---

# CONVENTION-NNNN: [Title]

**Rule**: [Convention statement]

**Good**:
```code
[Example following rule]
```

**Bad**:
```code
[Example violating rule]
```

**Rationale**: [Why this convention]

**Enforcement**: [Linter rule, review checklist]
```

## Compact Writing Tips

- **Bullets** over paragraphs
- **Tables** for comparisons
- **Code blocks** for examples
- **Bold** for key terms
- **Links** for references
- **Numbers** not words ("3 steps" not "three steps")
- **Active voice** ("use X" not "X should be used")

## Example Capture Session

**Scenario**: Debugged infinite render loop in Dashboard

**1. Identify**
> Learned: Object literal in useEffect deps causes infinite loop

**2. Categorize**
> Category: Finding (debug root cause)

**3. Check Existing**
```bash
grep -r "useEffect.*loop" .knowledge/findings/
# No matches, create new entry
```

**4. Write Entry**
> File: `.knowledge/findings/0012-object-literal-useeffect-loop.md`

```markdown
---
id: FINDING-0012
title: Object literal in useEffect dependency causes infinite loop
status: resolved
created: 2026-02-08
updated: 2026-02-08
tags: [react, hooks, performance, debugging]
related: [PATTERN-005]
agent: epost-debugger
---

# FINDING-0012: Object literal in useEffect dependency causes infinite loop

**Symptom**: Dashboard component re-renders continuously, browser freezes

**Root Cause**: useEffect dependency array contains object literal `{ id: userId }`, creating new reference each render

**Resolution**:
1. Extract to useMemo: `const deps = useMemo(() => ({ id: userId }), [userId])`
2. Or use primitive: `useEffect(() => {...}, [userId])`

**Prevention**:
- Enable ESLint `react-hooks/exhaustive-deps`
- Prefer primitive dependencies
- Use React DevTools Profiler to catch render loops
```

**5. Update Index**
```bash
# Get next ID
jq '.counts.findings' .knowledge/index.json
# Returns: 12, so next is 13

# Update index (simplified - actual update via tool)
jq '.counts.findings = 13' .knowledge/index.json
jq '.entries += [new_entry]' .knowledge/index.json
```

**6. Cross-Reference**
> Link to `PATTERN-005` (React hooks best practices)

## Memory vs Knowledge Base

| Use Agent Memory For | Use Knowledge Base For |
|----------------------|------------------------|
| Current task context | Permanent team knowledge |
| Working notes | Validated learnings |
| Session continuity | Cross-session insights |
| Personal reminders | Shared patterns |
| Auto-managed | Explicitly curated |

**Agent Memory**: "Currently debugging auth, checked AuthProvider, LoginForm, useAuth hook"

**Knowledge Base**: "Auth uses OAuth 2.0 PKCE flow, see ADR-0003 for rationale and PATTERN-008 for implementation"

## Integration with Other Skills

### Post-Debugging
```
debugging → find root cause → knowledge-capture → create FINDING
```

### Post-Implementation
```
implementer → discover pattern → knowledge-capture → create PATTERN
```

### Post-Research
```
research → make decision → knowledge-capture → create DECISION
```

### Post-Review
```
code-review → identify convention → knowledge-capture → create CONVENTION
```

### Post-Architecture
```
architect → make decision → knowledge-capture → create ADR
```

## File Operations

### Create Knowledge Entry

```bash
# 1. Determine next ID
NEXT_ID=$(jq -r '.entries[] | select(.category == "finding") | .id' .knowledge/index.json | sort | tail -1 | awk -F'-' '{print $2+1}')

# 2. Create file
cat > .knowledge/findings/${NEXT_ID}-title.md <<EOF
---
id: FINDING-${NEXT_ID}
title: Title here
status: resolved
created: $(date +%Y-%m-%d)
updated: $(date +%Y-%m-%d)
tags: [tag1, tag2]
related: []
agent: epost-debugger
---

# FINDING-${NEXT_ID}: Title

Content here
EOF

# 3. Update index (using tool, not direct edit)
```

### Update Existing Entry

```bash
# 1. Find entry
ENTRY_PATH=$(jq -r '.entries[] | select(.id == "FINDING-0012") | .path' .knowledge/index.json)

# 2. Edit file
# Use Edit tool to modify .knowledge/$ENTRY_PATH

# 3. Update index timestamp
jq '(.entries[] | select(.id == "FINDING-0012") | .updated) = "'$(date +%Y-%m-%d)'"' .knowledge/index.json
```

## Quality Checklist

Before finalizing entry:

- [ ] Category appropriate for learning type
- [ ] ID follows `CATEGORY-NNNN` format
- [ ] Frontmatter complete (no missing fields)
- [ ] Title descriptive (5-10 words)
- [ ] Tags relevant and specific
- [ ] Content concise (use bullets, code blocks)
- [ ] Cross-references added to `related`
- [ ] Index updated (counts + entry added)
- [ ] File saved to correct category directory

## Related Skills

- `knowledge-base` — Knowledge system structure and conventions
- `knowledge-retrieval` — Search and retrieve existing knowledge
- `debugging` — Debugging methodology (source of findings)
- `code-review` — Review process (source of conventions)
- `research` — Research methodology (source of decisions)

## References

- `knowledge-base/SKILL.md` — Knowledge system overview
- `knowledge-base/references/adr-patterns.md` — ADR template and lifecycle
- `knowledge-base/references/knowledge-capture-guide.md` — Detailed capture guidelines
- `knowledge-base/references/sidecar-format-spec.md` — Data format specifications
