---
title: "Improve CLAUDE.md for natural prompt routing and orchestration"
status: active
created: 2026-03-09
updated: 2026-03-09
effort: 2h
phases: 3
platforms: [all]
breaking: false
---

# Improve CLAUDE.md for Natural Prompt Routing and Orchestration

## Problem

The current `CLAUDE.snippet.md` (source of truth for generated `CLAUDE.md`) has several weaknesses:

1. **Rigid signal words** -- routing table requires exact keywords like "cook", "fix", "plan". Natural prompts like "make the login page faster" or "help me with this error" fall through or require a clarification question.
2. **No project identity** -- no description of what epost_agent_kit IS, making it hard for Claude to contextualize responses.
3. **Verbose routing tables** -- 17-row intent map + hybrid audit protocol + multi-step workflows + Copilot section = ~100 lines of routing logic that competes for attention.
4. **Orchestration buried in references** -- workflow patterns exist in `core/references/orchestration.md` but CLAUDE.md only has a bullet list. Claude doesn't know WHEN to use multi-agent patterns vs direct execution.
5. **Missing fuzzy matching guidance** -- no instruction for handling ambiguous/natural prompts that don't contain exact signal words.

## Goal

Rewrite `packages/core/CLAUDE.snippet.md` so that:
- Natural prompts ("improve this", "something is wrong", "I want to add...") route correctly without asking the user
- Orchestration is concise: when to delegate vs execute directly
- Project context is present for grounding
- Copilot section is trimmed (it's secondary)
- Total CLAUDE.md stays under 150 lines (currently ~156)

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Rewrite routing for natural language | 1h | pending | [phase-1](./phase-1-natural-routing.md) |
| 2 | Add project context and trim Copilot section | 30m | pending | [phase-2](./phase-2-context-trim.md) |
| 3 | Improve orchestration summary | 30m | pending | [phase-3](./phase-3-orchestration.md) |

## Success Criteria

- [ ] Natural prompts like "something is broken", "make this better", "help me understand X" route without clarification
- [ ] CLAUDE.md total length <= 150 lines
- [ ] Routing table has fuzzy/intent categories, not just exact keywords
- [ ] Orchestration rules are inline (not just "see references/orchestration.md")
- [ ] Project identity is clear in first 10 lines
