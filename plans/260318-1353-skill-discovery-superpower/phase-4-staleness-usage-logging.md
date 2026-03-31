---
phase: 4
title: "Staleness Guard & Usage Logging"
effort: 2h
depends: [1]
---

# Phase 4: Staleness Guard & Usage Logging

Self-healing index and passive usage data. Addresses Gap 3 and Improvement 4.

## Tasks

### 4.1 Staleness guard hook (Gap 3)

Create a `SessionStart` hook that checks if `skill-index.json` is stale.

**File**: `packages/core/hooks/skill-index-freshness.cjs`

Logic:
1. On `SessionStart`, count SKILL.md files on disk (`find .claude/skills -name SKILL.md | wc -l`)
2. Read `.claude/skills/skill-index.json`, compare `count` field
3. If mismatch → print warning:
   ```
   ⚠ skill-index.json has {indexCount} skills but {diskCount} SKILL.md files found.
   Run: node packages/core/scripts/generate-skill-index.cjs .claude/skills
   ```
4. If `generated` timestamp > 7 days old → print:
   ```
   ⚠ skill-index.json is {N} days old. Consider regenerating.
   ```

**Hook config** in `packages/core/hooks/` manifest:
```json
{
  "event": "SessionStart",
  "file": "hooks/skill-index-freshness.cjs"
}
```

**Validation**: Add a dummy SKILL.md, verify warning fires. Remove it, verify clean.

### 4.2 Usage logging hook (Improvement 4)

Create a passive `PostToolUse` hook that logs which skills get loaded.

**File**: `packages/core/hooks/skill-usage-logger.cjs`

Logic:
1. On `PostToolUse` where tool = `Read` and path matches `**/skills/*/SKILL.md`
2. Extract skill name from path
3. Append to `.epost-data/skill-usage.jsonl`:
   ```json
   {"skill":"web-frontend","agent":"epost-fullstack-developer","ts":"2026-03-18T13:53:00Z"}
   ```

**Properties**:
- Append-only JSONL (no read-modify-write)
- gitignored (`.epost-data/` already in `.gitignore`)
- Max file size: 1MB, rotate by truncating oldest 50% when exceeded

**Analysis command** (future): `node packages/core/scripts/analyze-skill-usage.cjs`
- Top 10 most-loaded skills
- Skills never loaded in last 30 days → prune candidates
- Co-loaded pairs (loaded in same session >5 times) → merge candidates

**Validation**: Load a skill manually, check `.epost-data/skill-usage.jsonl` has entry.

### 4.3 Add auto-regeneration to epost-kit init

**File**: The init script that copies skills to `.claude/skills/`

After copy step, add:
```bash
node packages/core/scripts/generate-skill-index.cjs .claude/skills
```

This ensures `skill-index.json` is always fresh post-init.

**Validation**: Run init, verify skill-index.json `generated` timestamp updated and count matches disk.

## Completion Checklist

- [ ] SessionStart hook detects stale index
- [ ] Usage logger writes to .epost-data/skill-usage.jsonl
- [ ] Init auto-regenerates index
- [ ] .epost-data/ in .gitignore
