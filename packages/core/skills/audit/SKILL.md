---
name: audit
description: "(ePost) Audit workflow — auto-detects UI component, a11y, or code audit"
user-invocable: true
context: fork
agent: epost-code-reviewer
metadata:
  argument-hint: "[--ui <ComponentName> [--platform web|ios|android|all] | --a11y [platform] | --code]"
  keywords: [audit, review, component, a11y, accessibility, code, quality, ui-lib, muji, tokens]
  triggers:
    - "audit"
    - "audit component"
    - "audit ui"
    - "audit a11y"
    - "audit code"
    - "code audit"
    - "component audit"
  platforms: [all]
  agent-affinity: [epost-muji, epost-code-reviewer, epost-a11y-specialist]
  connections:
    enhances: [code-review, ui-lib-dev]
    requires: [knowledge-retrieval]
---

# Audit — Unified Audit Command

Auto-detect and execute the appropriate audit workflow.

## Methodology Tracking

Every audit report MUST include a `methodology` field (JSON) or **Methodology** section (Markdown) documenting:
- **Files Scanned** — every file actually read
- **Knowledge Tiers** — which levels (L1–L5) were activated and whether each was available
- **Standards Source** — the skill files, checklists, and external standards used as rule authority
- **Coverage Gaps** — anything unavailable (RAG down, checklist not found, no platform rules loaded)

Track these as you work. Never leave them empty or with placeholder values.

## Knowledge Retrieval (Pre-Audit)

Before executing any audit mode, activate `knowledge-retrieval` to load relevant context:
- L1 `docs/` — existing conventions, past findings, ADRs for the files under review
- L2 RAG — component implementations, token definitions, usage patterns
- L4 Grep/Glob — fallback if RAG unavailable (search `packages/`, `src/` directly)
- L5 Context7 — library API verification for external dependency usage

**RAG unavailable?** Skip L2, go directly to L4 Grep/Glob. Never block the audit waiting for RAG.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--ui`: delegate to **epost-muji**, load `references/ui.md`. Pass remaining args (component name + platform flags).
If `$ARGUMENTS` starts with `--a11y`: load `references/a11y.md` and execute. Pass remaining args as platform hint.
If `$ARGUMENTS` starts with `--close --ui`: load `references/close-ui.md` and execute. Pass remaining args as finding ID.
If `$ARGUMENTS` starts with `--close`: load `references/close-a11y.md` and execute. Pass remaining args as finding ID.
If `$ARGUMENTS` starts with `--code`: dispatch `code-review` inline.
Otherwise: continue to Auto-Detection.

## Delegation Protocol

When dispatching audit work to a specialist agent:

1. Select the matching template from `references/delegation-templates.md`
2. Fill in all `{placeholders}` from current audit context
3. Dispatch via Task tool to the specialist agent
4. **Wait** for specialist report before continuing
5. Incorporate specialist findings into your own report output

**Report consolidation**: After all specialist reports are merged into your report, the final deliverable is YOUR single report file. Sub-agent reports are source material — do not surface them as separate deliverables to the user unless explicitly requested.

| Template | Specialist | When |
|----------|-----------|------|
| A — UI Component Audit | epost-muji | `--ui` flag or UI component signals |
| B — A11y Audit | epost-a11y-specialist | `--a11y` flag or A11y findings from UI audit |
| C — Code Escalation | epost-code-reviewer | Critical findings needing deeper pass |
| D — Docs Gap Detection | epost-docs-manager | Post-audit, new feature, or refactor |
| E — MCP/RAG Query | epost-mcp-manager | Component catalog lookup, pattern search |

## Aspect Files

| File | Purpose |
|------|---------|
| `references/ui.md` | Audit UI component (Senior Muji Reviewer) |
| `references/a11y.md` | Audit staged changes for WCAG 2.1 AA violations |
| `references/close-a11y.md` | Mark an accessibility finding as resolved |
| `references/close-ui.md` | Close/resolve a UI finding in known-findings DB |
| `references/ui-known-findings-schema.md` | Schema for `.epost-data/ui/known-findings.json` |
| `references/delegation-templates.md` | Structured handoff templates for specialist delegation |

## Auto-Detection

Analyze `$ARGUMENTS` keywords and context:

| Signal | Dispatch |
|--------|----------|
| Component name (`Epost*`, UI keyword), "component", "ui-lib", "design system", "token", "klara", "muji" | `--ui` → `references/ui.md` via **epost-muji** |
| "a11y", "accessibility", "wcag", "voiceover", "talkback" | `--a11y` → `references/a11y.md` |
| "close" + "ui" signals | `--close --ui` → `references/close-ui.md` |
| "close", "resolve", "finding" | `--close` → `references/close-a11y.md` |
| "code", "security", "performance", staged changes without component signal | `--code` → `code-review` |
| Ambiguous | Ask: UI component audit, a11y audit, or code audit? |

## Platform Detection (--ui mode)

When delegating to epost-muji, detect target platforms:
- Explicit `--platform web|ios|android|all` in args → pass through
- `.swift` context → `--platform ios`
- `.kt`/`.kts` context → `--platform android`
- `.tsx`/`.jsx`/`.ts` context → `--platform web`
- No context → `--platform all`

## Variant Summary

| Flag | Agent | Reference | Scope |
|------|-------|-----------|-------|
| `--ui` | epost-muji | `references/ui.md` | Design system components (web/iOS/Android) |
| `--a11y` | epost-a11y-specialist | `references/a11y.md` | WCAG 2.1 AA violations |
| `--close` | epost-a11y-specialist | `references/close-a11y.md` | Mark a11y finding as resolved |
| `--close --ui <id>` | epost-muji | `references/close-ui.md` | Mark UI finding resolved |
| `--code` | epost-code-reviewer | `code-review` | General code quality, security, performance |

## Examples

- `/audit --ui EpostButton` → muji audits EpostButton across all platforms
- `/audit --ui EpostCard --platform web` → muji audits web-only
- `/audit --a11y` → a11y specialist audits staged changes
- `/audit --code` → reviewer audits staged code changes
- `/audit --close --ui 3` → mark UI finding ID 3 as resolved
- `/audit EpostInput` → auto-detected as UI audit → delegates to muji
