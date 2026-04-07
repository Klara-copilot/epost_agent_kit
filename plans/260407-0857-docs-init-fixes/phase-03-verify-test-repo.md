---
phase: 3
title: Verify fixes on test repo + sync to .claude/
effort: 45m
depends: [1, 2]
---

# Phase 3 — Verification

## Context

Phases 1+2 are prompt-engineering changes to `init.md`. The only reliable test is running `/docs --init` on a real repo and inspecting the generated `index.json`.

## Files

- Read-only: any test repo under `/Users/than/Projects/luz_*` or a scratch repo
- Read-only: `.claude/skills/docs/references/init.md` (to verify sync)
- Write: `reports/260407-0857-docs-init-fixes-verify.md` (verification report)

## Steps

### Step 1 — Sync packages/ → .claude/

After Phases 1+2 land, run:

```bash
cd /Users/than/Projects/epost_agent_kit
# whatever the init command is — check CLAUDE.md for the kit init flow
epost-kit init  # or npm script equivalent
```

Then diff:

```bash
diff packages/core/skills/docs/references/init.md .claude/skills/docs/references/init.md
```

Must be identical (or `.claude/` has expected injection headers).

### Step 2 — Choose a test repo

Pick a repo that was in the failing batch and delete its `docs/index.json` (or use a fresh repo). Candidates:

- One of the 8 repos missing `business.domain`
- luz_payment (for id format test)
- luzcomp_scripts (for path test)

Prefer a repo with `pom.xml` (Java) and one with `package.json` (web) to cover both discovery paths. One run is sufficient if time-boxed.

### Step 3 — Run /docs --init

```
/docs --init
```

Dispatched via `epost-docs-manager`.

### Step 4 — Inspect generated index.json

Verify with `jq`:

```bash
jq '.business.domain' docs/index.json                    # non-null, non-empty, not "..."
jq '.dependencies.internal.libraries' docs/index.json    # array (may be empty)
jq '.dependencies.internal.apiServices' docs/index.json  # array
jq '.dependencies.external' docs/index.json              # array
jq '.entries[].id' docs/index.json                       # all match PREFIX-NNNN
jq '.entries[].path' docs/index.json                     # all non-null, start with "docs/"
jq '[.entries[].id] | all(test("^(ADR|ARCH|CONV|FEAT|PATTERN|FINDING|GUIDE|API|INFRA|INTEG)-[0-9]{4}$"))' docs/index.json  # true
```

All checks must pass. Any failure → loop back to Phase 1 or 2 and tighten wording.

### Step 5 — Write verification report

Report to `reports/260407-0857-docs-init-fixes-verify.md`:

- Which repo tested
- jq output for each check
- Pass/fail per blocker (1–4 from plan scope)
- Any remaining gaps

Update `reports/index.json`.

## TODO

- [ ] Sync packages → .claude via kit init
- [ ] Pick test repo
- [ ] Run /docs --init
- [ ] Run all jq checks
- [ ] Write verification report
- [ ] Update reports/index.json
- [ ] If any check fails: document and loop back (max 2 iterations)

## Success Criteria

- [ ] `.claude/skills/docs/references/init.md` matches packages/ source
- [ ] Test repo's generated `index.json` passes all 7 jq checks
- [ ] Verification report written and indexed
- [ ] All 4 original blockers confirmed fixed (or failures documented for follow-up)
