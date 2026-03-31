---
phase: 2
title: "Mermaidjs preview flags"
effort: 1h
depends: []
---

# Phase 2: Mermaidjs Preview Flags

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/mermaidjs/SKILL.md` — existing mermaid skill

## Overview

- Priority: P2
- Status: Pending
- Effort: 1h
- Description: Extend mermaidjs with `--explain`, `--ascii`, `--html` flags for multi-format visual output

## Requirements

### Functional

- `--explain <topic>` — ASCII art + Mermaid diagram + prose explanation (combined visual teaching)
- `--ascii <topic>` — terminal-only ASCII diagram (no Mermaid, no HTML)
- `--html <topic>` — self-contained HTML file with embedded Mermaid + prose, open in browser
- No flags = current behavior (Mermaid code block only)
- All modes: auto-detect best diagram type for the topic

### Non-Functional

- SKILL.md stays under 160 lines total
- Each reference file under 100 lines
- HTML output must be self-contained (inline Mermaid CDN script, no build step)

## Files to Modify

- `packages/core/skills/mermaidjs/SKILL.md` — add flag table, Step 0 override, update description

## Files to Create

- `packages/core/skills/mermaidjs/references/explain.md` — explain mode (ASCII + Mermaid + prose)
- `packages/core/skills/mermaidjs/references/ascii.md` — ASCII-only diagram mode
- `packages/core/skills/mermaidjs/references/html.md` — HTML file generation mode

## Implementation Steps

1. **Update SKILL.md frontmatter**
   - Add `argument-hint: "[--explain | --ascii | --html] <topic>"`
   - Update description to mention multi-format capability

2. **Add flag routing to SKILL.md**
   - Insert Step 0 flag override block before existing content:
     - `--explain` → load `references/explain.md`
     - `--ascii` → load `references/ascii.md`
     - `--html` → load `references/html.md`
     - No flag → existing behavior (Mermaid code block)
   - Add aspect files table

3. **Create references/explain.md**
   - Step 1: Analyze topic, pick best diagram type
   - Step 2: Generate ASCII art representation (box-drawing chars)
   - Step 3: Generate Mermaid diagram
   - Step 4: Write prose explanation connecting the visual to concepts
   - Output: all three in sequence

4. **Create references/ascii.md**
   - Step 1: Analyze topic, pick best layout (tree, flow, grid)
   - Step 2: Generate using box-drawing characters (`+---+`, `|`, `-->`)
   - Rules: max 80 chars wide, max 40 lines tall, use UTF-8 box drawing

5. **Create references/html.md**
   - Step 1: Analyze topic, generate Mermaid + prose
   - Step 2: Wrap in self-contained HTML template with:
     - `<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js">`
     - Styled prose sections
     - Dark/light theme auto-detect via `prefers-color-scheme`
   - Step 3: Write to `{topic-slug}-explanation.html` in CWD
   - Step 4: Suggest `open {file}` to view in browser

## Todo List

- [ ] Update mermaidjs SKILL.md with flag table and Step 0
- [ ] Create references/explain.md
- [ ] Create references/ascii.md
- [ ] Create references/html.md

## Success Criteria

- `--explain` outputs ASCII + Mermaid + prose in terminal
- `--ascii` outputs only box-drawing art, no Mermaid
- `--html` creates a self-contained .html file
- No flags = existing Mermaid-only behavior unchanged

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| HTML Mermaid CDN unavailable offline | Low | Note in html.md: offline fallback = ASCII mode |
| ASCII art quality varies by topic | Low | Provide clear box-drawing patterns in reference |

## Security Considerations

- HTML output includes external CDN script — note this in reference file
