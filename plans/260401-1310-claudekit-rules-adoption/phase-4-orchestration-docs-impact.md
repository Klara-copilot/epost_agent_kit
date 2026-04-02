---
phase: 4
title: "orchestration — Docs Impact Assessment"
effort: 15m
depends: [1]
---

# Phase 4: Docs Impact Assessment

Depends on Phase 1 (cook finalize adds "Docs impact" statement — needs spec here).

## Files to Modify

- `packages/core/skills/core/references/orchestration.md`

## Change

Add new `## Docs Impact Assessment` section after the existing `## Report Output` section:

```markdown
## Docs Impact Assessment

After every implementation completion, the executing agent MUST state docs impact explicitly:

```
Docs impact: none | minor | major
```

| Level | Criteria | Action |
|-------|----------|--------|
| `none` | Internal refactor, logic-only change, no behavior change | No docs update needed |
| `minor` | New config option, renamed param, small API delta | Agent updates inline |
| `major` | New public feature, behavior change, new API surface, removed capability | Trigger `epost-docs-manager` |

**When to trigger docs-manager**: docs impact = `major` only. Minor updates can be made inline by the implementing agent.

**Integration**: The `cook` finalize step (5b) and `/git --ship` pipeline both check docs impact before closing.
```

## Todo

- [ ] Read orchestration.md fully before editing
- [ ] Locate `## Report Output` section
- [ ] Add `## Docs Impact Assessment` immediately after it
- [ ] Verify heading level matches existing sections (##)

## Success Criteria

- orchestration.md has `## Docs Impact Assessment` section
- Table with none/minor/major and actions is present
- Mentions integration with cook finalize and git ship

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Section inserted in wrong location | Low | Locate exact line before editing |

## Security Considerations

None.
