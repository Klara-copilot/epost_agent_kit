# Phase 02: Remove Embedded CLI and Verify

## Context Links
- [Plan](./plan.md)
- [Phase 01](./phase-01-update-refs-relink.md)

## Overview
- Priority: P1
- Status: Pending
- Effort: 30m
- Description: Delete `epost-agent-cli/` directory from monorepo, verify no broken references remain, commit.

## Requirements
### Functional
- `epost-agent-cli/` completely removed from repo
- No broken references anywhere in codebase
- Global `epost-kit` still works

### Non-Functional
- Clean git history (single commit for removal)

## Related Code Files
### Files to Delete
- `epost-agent-cli/` -- entire directory (including `.claude/`, `src/`, `dist/`, `tests/`, `docs/`, `plans/`, `node_modules/`)

### Files to Verify
- All files in `packages/` -- no remaining `epost-agent-cli` references
- All files in `.claude/` -- no remaining `epost-agent-cli` references
- `plans/INDEX.md` -- exists and has migrated content
- `plans/index.json` -- exists and has migrated content

## Implementation Steps

1. **Pre-flight check**
   - `epost-kit --version` works (linked to standalone)
   - `plans/INDEX.md` exists with migrated content
   - Grep confirms no `epost-agent-cli` in `packages/`

2. **Remove directory**
   - `git rm -r epost-agent-cli/`

3. **Update .gitignore if needed**
   - Remove any `epost-agent-cli` specific entries

4. **Final verification**
   - `grep -r "epost-agent-cli" --include="*.md" --include="*.ts" --include="*.js" --include="*.json" .` returns nothing (except plans/reports which are historical)
   - `epost-kit --version` still works
   - `epost-kit init` still works (in a test project or current)

5. **Commit**
   - Stage and commit removal

## Todo List
- [ ] Pre-flight verification
- [ ] `git rm -r epost-agent-cli/`
- [ ] Grep for remaining references
- [ ] Fix any remaining references
- [ ] Final smoke test of `epost-kit`
- [ ] Commit

## Success Criteria
- `epost-agent-cli/` gone from working tree and git index
- No broken references (grep clean)
- `epost-kit` functional from standalone repo

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Historical plan reports reference old paths | Low | Accept -- these are historical docs |
| npm link breaks on reboot | Low | Document in README |

## Security Considerations
- None identified

## Next Steps
- Update standalone CLI repo README if needed
- Consider publishing to npm registry for non-link installs
