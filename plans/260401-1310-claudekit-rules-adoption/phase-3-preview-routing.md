---
phase: 3
title: "preview — Wire into routing table and CLAUDE.snippet.md"
effort: 15m
depends: []
---

# Phase 3: Preview Routing

## Files to Modify

- `packages/core/CLAUDE.snippet.md`

## Changes

### 1. Add row to Intent Map table

After the Research row, insert:
```markdown
| Visualize / Explain | "explain", "visualize", "diagram", "draw", "show flow", "how does X work" | `/preview` skill (inline) |
```

### 2. Add Routing Rule #12

After current rule 11 ("Compound git intent"), add:
```markdown
12. **Explain/Visualize intent** (explain, visualize, diagram, draw, show flow) → invoke `/preview` skill inline. If topic has 3+ interacting components → auto-add `--explain` flag.
```

### 3. Add preview flag note

After the Intent Map table (near "Fuzzy matching"), add:
```markdown
**Preview flags**: `--explain` (ASCII + Mermaid + prose), `--diagram` (Mermaid only), `--ascii` (terminal-safe), `--html` (self-contained page that opens in browser)
```

## Todo

- [ ] Read CLAUDE.snippet.md fully before editing
- [ ] Add Visualize/Explain row to Intent Map
- [ ] Add Routing Rule 12
- [ ] Add preview flags note after Intent Map

## Success Criteria

- CLAUDE.snippet.md Intent Map has "Visualize / Explain" row
- Routing Rules has rule 12 with preview trigger
- Preview flags documented inline

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Intent Map formatting breaks | Low | Match exact table formatting |

## Security Considerations

None.
