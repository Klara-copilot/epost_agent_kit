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
---

# Audit — Unified Audit Command

Auto-detect and execute the appropriate audit workflow.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--ui`: delegate to **epost-muji**, load `references/ui.md`. Pass remaining args (component name + platform flags).
If `$ARGUMENTS` starts with `--a11y`: load `references/a11y.md` and execute. Pass remaining args as platform hint.
If `$ARGUMENTS` starts with `--close`: load `references/close-a11y.md` and execute. Pass remaining args as finding ID.
If `$ARGUMENTS` starts with `--code`: dispatch `code-review` inline.
Otherwise: continue to Auto-Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `references/ui.md` | Audit UI component (Senior Muji Reviewer) |
| `references/a11y.md` | Audit staged changes for WCAG 2.1 AA violations |
| `references/close-a11y.md` | Mark an accessibility finding as resolved |

## Auto-Detection

Analyze `$ARGUMENTS` keywords and context:

| Signal | Dispatch |
|--------|----------|
| Component name (`Epost*`, UI keyword), "component", "ui-lib", "design system", "token", "klara", "muji" | `--ui` → `references/ui.md` via **epost-muji** |
| "a11y", "accessibility", "wcag", "voiceover", "talkback" | `--a11y` → `references/a11y.md` |
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
| `--close` | epost-a11y-specialist | `references/close-a11y.md` | Mark finding as resolved |
| `--code` | epost-code-reviewer | `code-review` | General code quality, security, performance |

## Examples

- `/audit --ui EpostButton` → muji audits EpostButton across all platforms
- `/audit --ui EpostCard --platform web` → muji audits web-only
- `/audit --a11y` → a11y specialist audits staged changes
- `/audit --code` → reviewer audits staged code changes
- `/audit EpostInput` → auto-detected as UI audit → delegates to muji
