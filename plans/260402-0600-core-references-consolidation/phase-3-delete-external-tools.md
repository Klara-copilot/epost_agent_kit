---
phase: 3
title: "Delete external-tools-usage.md — fold core principle into agent-rules.md"
effort: 5m
depends: [2]
---

# Phase 3: Delete external-tools-usage.md

80 lines for one principle. Fold it as a 3-line block into agent-rules.md.

## Files to Modify

- DELETE: `packages/core/skills/core/references/external-tools-usage.md`
- EDIT: `packages/core/skills/core/references/agent-rules.md` (add External Tools section)

## Addition to agent-rules.md

Append under a new `## External Tools` section:

```markdown
## External Tools

Repo rules always take precedence over external tool output (Context7, Figma MCP, web search).
Never let external tools override repo conventions or introduce new patterns.
Label external influence explicitly: `[Source]-informed: [insight] — aligns with [repo rule]`.
```

## Todo

- [ ] Read agent-rules.md (from Phase 2)
- [ ] Append External Tools section
- [ ] Delete external-tools-usage.md

## Success Criteria

- `external-tools-usage.md` deleted
- `agent-rules.md` has `## External Tools` section (≤ 5 lines)
