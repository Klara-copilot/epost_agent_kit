## Phase Implementation Report
- Phase: merge-review-into-audit | Plan: plans/260331-1039-whitelist-and-compliance | Status: completed

### Files Modified
- `packages/core/skills/audit/SKILL.md` — added review triggers, `--improvements` flag, updated auto-detection, variant table, aspect files, examples
- `packages/core/skills/audit/references/improvements.md` — moved from review (new)
- `packages/core/skills/audit/references/a11y-ios-guidance-mode.md` — moved from review (new)
- `packages/core/skills/audit/references/a11y-android-guidance-mode.md` — moved from review (new)
- `packages/core/package.yaml` — removed `review` from skills list
- `packages/core/scripts/generate-skill-index.cjs` — removed `review` from CATEGORY_MAP, changed `audit enhances review` → `audit enhances code-review`
- `packages/core/skills/skill-index.json` — regenerated (24 skills, 0 errors)
- `CLAUDE.md` — updated Review/Audit intent row with review triggers
- `packages/core/CLAUDE.snippet.md` — same update
- `.claude/skills/audit/` — mirrored from packages
- `.claude/skills/review/` — deleted
- `.claude/scripts/generate-skill-index.cjs` — mirrored
- `.claude/skills/skill-index.json` — mirrored
- `packages/core/skills/review/` — deleted (entire directory)

### Tasks Completed
- Merged review's unique content (`--improvements`, a11y guidance modes) into audit
- Confirmed review's `--code`, `--a11y`, `--ui` modes already covered by audit's existing flags
- Updated description + triggers in audit SKILL.md frontmatter
- Updated CLAUDE.md intent routing tables (both repo-level and snippet)
- Fixed CONNECTION_MAP: `audit enhances review` → `audit enhances code-review`
- Deleted `review` skill from packages and .claude mirror

### Tests Status
- `node packages/core/scripts/generate-skill-index.cjs` — 24 skills, 0 errors/warnings

### Issues Encountered
- None

### Next Steps
- None — merge complete
