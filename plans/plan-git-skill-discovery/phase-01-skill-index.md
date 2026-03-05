# Phase 01: Update git-* Skill Index Entries

## Context Links
- Parent plan: [plan.md](./plan.md)
- Source index: `packages/core/skills/skill-index.json`
- Deployed index: `.claude/skills/skill-index.json`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Populate empty keywords and agent-affinity for git-commit, git-pr, git-push in both skill-index files
**Implementation Status**: Pending

## Key Insights
- All 3 git skills currently have `"keywords": []` and `"agent-affinity": []`
- This means skill-discovery's Step 2 (keyword intersection) never matches them
- The hub-context skill correctly routes git intents -- but discovery protocol cannot load them

## Requirements
### Functional
- Each git skill gets relevant keywords matching hub-context signal words
- Each git skill gets `epost-git-manager` in agent-affinity
- git-commit gets additional trigger words: "commit", "stage", "done"
- git-push gets: "push", "ship", "deploy"
- git-pr gets: "pr", "pull request", "review", "merge"
- Shared keywords across all 3: "git", "branch"

### Non-Functional
- skill-index `count` field must remain accurate (no count change, just data enrichment)

## Architecture
No architectural change. Data enrichment of existing index entries.

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/skill-index.json` — source of truth index [OWNED]
- `.claude/skills/skill-index.json` — deployed index (mirror changes) [OWNED]

### Read-Only
- `packages/core/skills/git-commit/SKILL.md` — verify frontmatter matches
- `packages/core/skills/git-pr/SKILL.md`
- `packages/core/skills/git-push/SKILL.md`

## Implementation Steps

1. In `packages/core/skills/skill-index.json`, find `"name": "git-commit"` entry and update:
   ```json
   "keywords": ["commit", "stage", "done", "git", "branch", "conventional-commit"],
   "agent-affinity": ["epost-git-manager"],
   ```

2. Find `"name": "git-pr"` and update:
   ```json
   "keywords": ["pr", "pull-request", "merge", "review", "github", "git", "branch"],
   "agent-affinity": ["epost-git-manager"],
   ```

3. Find `"name": "git-push"` and update:
   ```json
   "keywords": ["push", "ship", "deploy", "remote", "git", "branch"],
   "agent-affinity": ["epost-git-manager"],
   ```

4. Mirror all 3 changes to `.claude/skills/skill-index.json`

5. Verify `count` field unchanged in both files

## Todo List
- [ ] Update git-commit keywords + agent-affinity in packages/ index
- [ ] Update git-pr keywords + agent-affinity in packages/ index
- [ ] Update git-push keywords + agent-affinity in packages/ index
- [ ] Mirror to .claude/ index
- [ ] Verify count unchanged

## Success Criteria
- `grep -c '"keywords": \[\]' packages/core/skills/skill-index.json` returns 0 for git entries
- All 3 git skills discoverable by keyword intersection

## Risk Assessment
**Risks**: Typo in JSON could break index parsing
**Mitigation**: Validate JSON after edit with `jq .`

## Security Considerations
None. Index metadata only.

## Next Steps
After completion: proceed to Phase 02 (skill-discovery update)
