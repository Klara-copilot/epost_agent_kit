---
title: Fix /docs --init index.json field population blockers
status: active
created: 2026-04-07
updated: 2026-04-07
effort: 2-3h
phases: 3
platforms: [kit]
breaking: false
blocks: []
blockedBy: []
---

# Fix `/docs --init` Required Field Blockers

## Scope Rationale

Batch `/docs --init` run across 10 repos produced 4 categories of blocker in generated `index.json`:

1. **Missing `business.domain`** — 8/10 repos
2. **Missing/incomplete `dependencies` object** — 2/10 repos
3. **ID format wrong** — `"auth-token-refresh"` instead of `"0001"` (luz_payment)
4. **Missing `path` fields** in entries — luzcomp_scripts

Root cause: `packages/core/skills/docs/references/init.md` describes the schema correctly but instructions are easy for the model to skip:
- Pre-Write Validation gate exists but is soft ("verify"), not blocking
- `path` field absent from validation checklist
- ID format shown only in examples, no anti-pattern guard
- No schema-first template the model fills in (template comes after long prose)

Fix is **prompt engineering only** — strengthen instructions in `init.md`. No new scripts, no JSON validators.

## Phases

| # | File | Title | Effort | Depends |
|---|------|-------|--------|---------|
| 1 | [phase-01-validation-gate.md](phase-01-validation-gate.md) | Strengthen Pre-Write Validation gate | 45m | — |
| 2 | [phase-02-id-and-path.md](phase-02-id-and-path.md) | Fix ID format + `path` field instructions | 30m | — |
| 3 | [phase-03-verify-test-repo.md](phase-03-verify-test-repo.md) | Verify on test repo + sync to .claude/ | 45m | 1, 2 |

Phases 1 and 2 edit non-overlapping sections of `init.md` and can run in parallel if dispatched separately. Phase 3 verifies the combined effect.

## File Ownership

| Phase | Owns |
|-------|------|
| 1 | `packages/core/skills/docs/references/init.md` (sections: Pre-Write Validation 5.5, Smart Init Pre-Write Validation) |
| 2 | `packages/core/skills/docs/references/init.md` (sections: index.json template in step 5, new "ID Format" subsection) |
| 3 | Test repo run (read-only) + `.claude/` sync verification |

**Conflict note**: Phases 1 and 2 both edit `init.md`. Run **sequentially** (phase 1 then 2) — same file.

## Success Criteria

- [ ] `init.md` Pre-Write Validation gate explicitly lists `path`, `id-format`, `business.domain`, `dependencies.internal.libraries`, `dependencies.internal.apiServices`, `dependencies.external` as blocking checks
- [ ] `init.md` includes an "ID Format" anti-pattern table showing `"0001"` vs `"auth-token-refresh"` is wrong
- [ ] Test run of `/docs --init` on a clean repo produces `index.json` where every entry has a 4-digit `id` and a `path` field
- [ ] Generated `index.json` has non-empty `business.domain` and a complete `dependencies` object with the nested `internal.libraries` / `internal.apiServices` / `external` structure
- [ ] `.claude/skills/docs/references/init.md` mirrors `packages/` source after `epost-kit init`

## Constraints

- **No scripts** — text instruction changes only
- **No schema migration** — schema in `knowledge-base.md` is correct, init.md must conform to it
- **Preserve existing structure** — keep both Smart Init and Generation Mode flows
- Edit `packages/core/skills/docs/references/init.md`, never `.claude/skills/docs/...`

## Risks

| Risk | Mitigation |
|------|-----------|
| Model still skips validation despite stronger wording | Phase 3 verification on real repo catches this; iterate wording |
| New wording bloats init.md beyond useful length | Cap additions at ~30 lines net; remove redundant prose |
| Other repos already broken — fix doesn't backfill | Out of scope; user runs `--init` again per repo or uses `--verify` |

## Unresolved Questions

None — scope is fully bounded by the 4 blockers.
