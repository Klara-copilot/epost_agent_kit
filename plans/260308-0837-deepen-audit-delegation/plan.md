---
title: "Deepen audit flow delegation — especially UI component audits"
status: completed
created: 2026-03-08
updated: 2026-03-08
effort: 5h
phases: 4
platforms: [all]
breaking: false
---

# Deepen Audit Flow Delegation

## Problem

The audit flow currently describes delegation (code-reviewer -> muji for UI, code-reviewer -> a11y-specialist for a11y) but the instructions are scattered, vague on *what context to pass*, and missing explicit "delegate and wait" patterns. Agents end up reviewing UI code inline instead of delegating to the specialist. Key gaps:

1. **audit/SKILL.md** says "delegate to epost-muji" for `--ui` but does not specify what expectations/context to pass
2. **code-review skill** Escalation Gate mentions delegation but lacks a structured handoff template
3. **epost-muji agent** has a full consumer audit workflow but no "receiving delegation" protocol — it does not know it was delegated to vs. invoked directly
4. **epost-a11y-specialist** similarly lacks a delegation-receipt protocol
5. **No wait-for-response pattern** — delegating agents don't know to block and wait for the specialist's report before continuing

## Solution

Add explicit delegation handoff templates to the audit flow. When an agent encounters work belonging to another specialist, it should:
- Formulate concise expectations (what to analyze, what output format, scope boundaries)
- Delegate via Task tool with structured context
- Wait for the specialist response
- Incorporate specialist findings into its own report

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Delegation handoff templates in audit skill | 1.5h | completed | [phase-1](./phase-1-audit-delegation-templates.md) |
| 2 | Code-reviewer escalation protocol | 1h | completed | [phase-2](./phase-2-code-reviewer-escalation.md) |
| 3 | Specialist receiving protocol (muji + a11y) | 1.5h | completed | [phase-3](./phase-3-specialist-receiving-protocol.md) |
| 4 | Muji docs & MCP delegation | 1h | completed | [phase-4](./phase-4-muji-docs-mcp-delegation.md) |

## Success Criteria

- `audit/SKILL.md` has structured delegation templates with expectations context
- `code-review` skill Escalation Gate specifies exact Task tool prompt for each delegation target
- `epost-muji` agent has a "delegated audit" section with intake expectations
- `epost-a11y-specialist` agent has a "delegated audit" section with intake expectations
- `epost-muji` has explicit trigger conditions for delegating to docs-manager and mcp-manager
- Templates D and E cover docs gap detection and MCP/RAG query patterns
- Delegation prompts are concise (expectations, not commands) so specialists can analyze independently
- All edits in `packages/` (source of truth)

## Design Decisions

1. **Expectations not commands** — delegation prompt tells specialist WHAT to evaluate, not HOW (they have their own skills and workflows)
2. **Structured context block** — every delegation includes: component/file list, audit scope, expected output format, calling agent for report-back
3. **Wait-and-incorporate** — delegating agent blocks until specialist report arrives, then merges findings into its own output
4. **No code changes** — specialists analyze and report; they don't fix code unless explicitly asked

## Dependencies

- Phase 2 depends on Phase 1 (code-reviewer references the templates from Phase 1)
- Phase 3 independent of Phase 2 (can parallel)
- Phase 4 depends on Phase 1 (adds Templates D and E to delegation-templates.md created in Phase 1)
