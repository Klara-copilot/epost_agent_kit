---
name: web-modules-code-review-rules
description: "ePost B2B module structure code review rules — MOD category"
user-invocable: false
disable-model-invocation: true
---

# Web Modules Code Review Rules

**Scope**: Module scaffold order, directory conventions, layering, store scoping in ePost B2B modules.

---

## MOD: B2B Module Structure

**Scope**: ePost B2B module screens — Inbox, Monitoring, Composer, Smart Send, Archive, Contacts, Organization, Smart Letter.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| MOD-001 | Module built in scaffold order: types → service → actions → hooks → store → components → page | medium | PR introduces layers in order; page wired last | Component created before its hook; store added before actions exist |
| MOD-002 | UI models in `_ui-models/`, services in `_services/`, hooks in `_hooks/` — no flat file dumping in module root | medium | `inbox/_services/inbox.service.ts` | `inbox/inboxService.ts` at module root level |
| MOD-003 | Layering strictly enforced: Component → Hook → Action → Service — no cross-layer skips | high | Component calls custom hook; hook dispatches action; action calls service | Component directly imports and calls service function |
| MOD-004 | Feature store scoped under feature layout `Provider` — not registered in global Redux store | high | Store provided in `InboxLayout` or equivalent layout wrapper | Inbox slice added to root `store.ts` alongside global app state |
| MOD-005 | Module integration passes consistency checklist before PR merge | medium | PR description references checklist; all items verified | Module wired but no checklist verification — common integration gaps missed |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| MOD-003–004 | Yes | — |
| MOD-001–002, MOD-005 | — | Yes |

**Lightweight**: Run on all module-directory files. **Escalated**: Activate on new module creation or full module integration PRs.
