---
phase: 2
title: "session.json schema + index protocol update"
effort: 45m
depends: [1]
status: pending
---

# Phase 2: session.json Schema + Index Protocol

## Files to Create

- `packages/core/skills/audit/references/session-json-schema.md` — session.json schema

## Files to Modify

1. `packages/core/skills/core/references/index-protocol.md`
   - Fix plans schema: document actual `plans/index.json` format (`"version"`, `"updated"`, `"plans"` key, `"counts"`)
   - Update reports schema: `path` (folder) + `files.report` + `files.session` (replaces `files.agent`/`files.human`)
2. `packages/core/skills/audit/references/ui.md` — Step 5: add session.json write after report.md
3. `packages/core/skills/code-review/SKILL.md` — hybrid step 7 + inline: add session.json write
4. `packages/core/skills/audit/SKILL.md` — add `session-json-schema.md` to Aspect Files table
