# Self-Evolving Skill Loop Phase 1 — Status

> Quick-glance overview of what's done, what's next, and key decisions.
> **This is the first file to update when something changes.**

---

## Progress

| Phase | Description | Status |
|-------|-------------|--------|
| 1. Signal Infrastructure | Extractor script, signals.json schema, docs/proposals/ dir | Done |
| 2. Proposal Generator | Agent-driven proposal creation from signals | Done |
| 3. Review CLI Command | `epost-kit proposals` list/approve/reject | Done |

## Completed
- **Phase 1**: `packages/core/scripts/extract-signals.cjs` — parses journal + reports, outputs `docs/proposals/signals.json`. Idempotent (0 duplicates on re-run). First run found 15 signals (5 journal-flag, 10 audit-failure).
- **Phase 2**: `packages/core/skills/plan/references/evolve-mode.md` — proposal generation guide; journal + cook skills updated with signal emission hints.
- **Phase 3**: `src/commands/proposals.ts` + `src/domains/proposals/` (types, list, apply) in CLI repo. Registered `epost-kit proposals` command.

## Deferred
- Auto-generation on session end (Phase 2 of larger effort)
- Auto-apply with rollback (Phase 3 of larger effort)
- Skill effectiveness metrics (needs instrumentation)

---

## Known Bugs
None.

---

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-24 | Script + Stop hook for signal extraction | Script for manual, hook runs silently on session end |
| 2026-03-24 | Group by skill (1 proposal per skill) | Cleaner to review; multiple signals as supporting evidence |
| 2026-03-24 | Confidence: 3+ audit-failure → high, 2+ journal-flag → medium | User-validated thresholds |
| 2026-03-24 | Agent-driven proposal generation via /plan --evolve | Proposals need reasoning — agents do this better than regex |
| 2026-03-24 | No new skill-evolution skill — hints in journal + cook | Avoids skill bloat |

---

## Architecture Reference

```
docs/journal/**/*.md  ──┐
reports/*.md            ├──► extract-signals.cjs ──► docs/proposals/signals.json
                        │                                    │
                  (Stop hook, auto)              /plan --evolve (manual)
                                                             │
                                              docs/proposals/{skill}-{YYMMDD}.md
                                                             │
                                        epost-kit proposals --approve <id>
                                                             │
                                        packages/.../skills/{skill}/SKILL.md
```

---

*Last updated: 2026-03-24*
