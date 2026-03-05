---
name: docs-update
description: "(ePost) Update existing documentation or scan for staleness"
user-invocable: false
disable-model-invocation: true
metadata:
  argument-hint: "[topic | --scan | --verify]"
  keywords:
    - docs-update
    - documentation
    - stale-docs
    - refresh-docs
    - verify-docs
  agent-affinity:
    - epost-docs-manager
  platforms:
    - all
  connections:
    requires: [knowledge-base]
    enhances: [knowledge-retrieval]
---

# Docs Update

Update existing KB documentation, scan for staleness, or verify content accuracy.

## Usage

```
/docs-update --scan          # Scan freshness, suggest updates
/docs-update --verify        # Deep verification of all doc references
/docs-update {topic}         # Update docs matching topic (e.g., "auth", "routing")
/docs-update                 # Detect what changed, update relevant docs
```

## Mode Detection

- `$ARGUMENTS` contains `--scan` or `scan` or `status` → **Scan Mode**
- `$ARGUMENTS` contains `--verify` → **Verify Mode**
- `$ARGUMENTS` has a topic word → **Topic Mode**
- Otherwise → **Update Mode** (detect from git changes)

## Prerequisite Check

1. Check for `docs/index.json` — if missing:
   - Check for flat docs (`docs/*.md`) → suggest `/docs-init --migrate`
   - No docs at all → suggest `/docs-init`
   - Stop here — don't proceed without KB structure

## Scan Mode

Audit KB health using content verification (not git dates):

1. **Read `docs/index.json`** — parse all entries
2. **For each entry**, verify:
   - Doc file exists at `path`
   - Code references in doc still exist (Grep/Glob for mentioned files, functions, routes)
   - `agentHint` is still relevant
3. **Check for gaps** — scan codebase for undocumented areas:
   - New deps in package.json/pom.xml not covered by ADRs
   - New route files not covered by FEATs
   - New config patterns not covered by CONVs
4. **Report**:

```markdown
## KB Health Report

| ID | Title | Status | Issues |
|----|-------|--------|--------|
| ADR-0001 | Next.js App Router | OK | — |
| ARCH-0002 | API Layer | STALE | References removed endpoint /api/legacy |
| FEAT-0003 | Auth Flow | BROKEN | File auth-handler.ts no longer exists |

### Gaps
- **New dep**: `@tanstack/query` added but no ADR exists
- **New route group**: `app/(dashboard)/` has no FEAT doc

### Summary
- Total entries: N
- OK: N | STALE: N | BROKEN: N
- Gaps found: N
```

5. **Ask user** which issues to fix

## Verify Mode (`--verify`)

Deep content verification — reads every doc and validates all references:

1. **For each doc file**, read full content and check:
   - Every file path mentioned → verify file exists
   - Every function/class/component name → verify via Grep
   - Every code example → verify syntax matches current code
   - Every route/endpoint → verify route file exists
2. **Flag issues**:
   - `STALE` — doc references code that changed significantly (function signature different, moved file)
   - `BROKEN` — doc references code/files that no longer exist
   - `GAP` — significant code area with no doc coverage
   - `OUTDATED` — entry's code area had major changes since doc was written
3. **Report** using same format as Scan Mode but with deeper detail per issue

## Topic Mode

Update docs related to a specific topic:

1. **Search index.json** for entries matching topic:
   - Match against `tags`, `title`, `agentHint`
   - Example: `/docs-update auth` → finds ADR-0001 (OAuth), FEAT-0001 (auth-registry), PATTERN-0003 (auth-layout)
2. **For each matching entry**:
   - Read the doc file
   - Read the current code it references
   - Update doc content to match current code
   - Update `## Tags` if needed
3. **Update index.json**:
   - Set `updatedAt` to today's date on the root object
4. **Report** what was updated

## Update Mode

Detect changes and update relevant docs:

1. **Identify code changes** from `git diff` or `git log --since="7 days ago"`
2. **Match changed files to docs** — search index.json entries whose referenced code was modified
3. **Read changed code + corresponding docs** — understand the gap
4. **Update docs** to match current code
5. **Check for new gaps** — did the changes introduce undocumented areas?
6. **Update index.json** `updatedAt`
7. **Report** what was updated

## Rules

- Only update `docs/` files — never modify source code
- Preserve KB structure — don't flatten or reorganize without user consent
- Always update `docs/index.json` after any doc changes
- Keep files under 800 LOC (docs.maxLoc)
- **Evidence-based** — verify code references exist before writing them
- If KB structure doesn't exist, redirect to `/docs-init`
