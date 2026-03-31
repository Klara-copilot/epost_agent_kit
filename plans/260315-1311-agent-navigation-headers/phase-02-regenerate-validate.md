---
phase: 2
title: "Regenerate .claude/ and Validate"
effort: 0.5h
depends: [1]
---

# Phase 2: Regenerate and Validate

## Context Links
- [Plan](./plan.md)
- [Phase 1](./phase-01-apply-headers.md)

## Overview
- Priority: P1
- Status: Pending
- Effort: 0.5h
- Description: Copy updated agent files from packages/ to .claude/agents/, validate no breakage

## Requirements

### Functional
- All 15 `.claude/agents/*.md` files match their `packages/` source
- Agent loading still works (frontmatter intact)

### Non-Functional
- No manual edits to `.claude/` — only copy from source

## Related Code Files

### Files to Modify
- `.claude/agents/epost-*.md` (15 files) — regenerated from packages/

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Copy agents from packages/ to .claude/agents/**
   ```bash
   cp packages/core/agents/epost-*.md .claude/agents/
   cp packages/a11y/agents/epost-a11y-specialist.md .claude/agents/
   cp packages/design-system/agents/epost-muji.md .claude/agents/
   cp packages/kit/agents/epost-kit-designer.md .claude/agents/
   ```

2. **Validate frontmatter** — check each file starts with `---` and has valid YAML
   ```bash
   for f in .claude/agents/epost-*.md; do
     head -1 "$f" | grep -q "^---$" || echo "BROKEN: $f"
   done
   ```

3. **Spot-check** — read 2-3 agents to verify header block is present and correctly positioned

4. **Diff check** — ensure .claude/ matches packages/ for all agent files

## Todo List

- [ ] Copy all agent files from packages/ to .claude/agents/
- [ ] Validate YAML frontmatter on all 15 files
- [ ] Spot-check 3 agents for correct header positioning
- [ ] Run diff to confirm source/output match

## Success Criteria

- `diff packages/core/agents/epost-planner.md .claude/agents/epost-planner.md` returns empty (identical)
- All agents have valid frontmatter (first line is `---`)
- Navigation headers visible in source but not interfering with agent behavior

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Forgot to copy a file | Low | Use wildcard cp, then count files |
| Init script overwrites | Med | Document that next `epost-kit init` will preserve headers since source has them |

## Security Considerations

None identified.

## Next Steps

- Commit changes via epost-git-manager
