# Cook Parallel Mode

Parallel implementation — split multi-module features across independent subsystems.

<feature>$ARGUMENTS</feature>

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task.

## Process

1. **Analyze** — identify independent modules/subsystems in the feature
2. **Split** — create task groups that can be implemented in parallel
3. **Implement** — execute each group with separate agents simultaneously
4. **Integrate** — connect the independently built modules
5. **Test** — run integration tests across modules

## Step 3.5 — Simplify

After integration, inline simplification pass before testing:
- Duplication: any block shared across modules that could be extracted?
- Over-engineering: simpler interface contract or data flow available?
- File size: any file approaching 200 LOC → split

Skip for documentation-only changes.

## Quality Gates

1. **Type Check**: No compilation errors across all modules
2. **Test Execution**: All unit + integration tests pass

## Finalize (MANDATORY)

Do not skip any sub-step.

### 5a. Plan Sync-Back
If working from a plan, update `{plan_dir}/status.md`:
- Progress table: mark completed phase as `Done`
- Key Decisions: add significant choices made
- Architecture Reference: note any discovered structure

### 5b. Docs Impact Assessment
State explicitly:
```
Docs impact: none | minor | major
```
- `none` — internal logic only, no public API change
- `minor` — config change, new param — update inline
- `major` — new feature, behavior change, new API → trigger `epost-docs-manager`

### 5c. Commit Offer
Ask: "Commit? [Y/n]" → delegate to `epost-git-manager` if yes.

### 5d. Change Summary Output
```
Files changed: N
Tests added: N
Behavior change: [yes/no + 1 line]
Docs impact: [none|minor|major]
Follow-up: [any new issues discovered]
```

## Rules

- Always write tests for new code
- Module interfaces must be clearly defined before parallel work
- Integration tests required after combining modules
