# Phase 03: Add /plan:validate Reference

## Context Links

- [Plan](./plan.md)
- [`cli-reference.md`](../../docs/cli-reference.md) - Primary target (lines 128-224, plan commands section)
- [`session-init.cjs`](../../.claude/hooks/session-init.cjs) - References `/plan:validate` at line 148
- [`epost-architect.md`](../../.claude/agents/epost-architect.md) - Architecture agent (handles plan commands)

## Overview

- Priority: P1
- Status: Pending
- Effort: 30m
- Description: `/plan:validate` is referenced in `session-init.cjs` (line 148) as a planned command but is not documented in `cli-reference.md`. Add a command entry so users and agents can discover it. The command does not yet have a command file, so document it as "Planned" with its intended behavior.

## Key Insights

- `session-init.cjs` line 148: `// Plan validation config (for /plan:validate, /plan:hard, /plan:parallel)`
- `session-init.cjs` lines 149-151: Already reads validation config (`CK_VALIDATION_MODE`, `CK_VALIDATION_MIN_QUESTIONS`)
- No `.claude/commands/plan/validate.md` exists yet - command file still needs creation
- `cli-reference.md` currently documents `/plan`, `/plan:fast`, `/plan:hard`, `/plan:parallel` (lines 128-224)
- The validation commands section at bottom (lines 793-800) lists `npm run validate:*` scripts but not `/plan:validate`
- The command should validate plan structure, YAML frontmatter, phase file completeness

## Requirements

### Functional
- Add `/plan:validate` entry to `cli-reference.md` in the plan commands section (after `/plan:parallel`)
- Include: description, agent, when to use, examples, expected output
- Mark status as "Planned" since no command file exists yet
- Reference the existing validation config from session-init.cjs

### Non-Functional
- Entry should be ~25-30 lines (matching style of other plan command entries)
- Keep `cli-reference.md` formatting consistent
- Do not create the command file itself (out of scope)

## Architecture

Insert a new command entry in `cli-reference.md` between the `/plan:parallel` section (ending ~line 224) and the `/review` section (starting ~line 227). Follow the exact same format as `/plan:fast`, `/plan:hard`, `/plan:parallel`.

## Related Code Files

### Files to Modify
- `docs/cli-reference.md` - Add `/plan:validate` command documentation (~30 lines)

### Files to Create
- None (command file creation is a separate task)

### Files to Delete
- None

## Implementation Steps

1. **Add /plan:validate entry to cli-reference.md**
   - Location: After `/plan:parallel` section (after the `---` on ~line 225), before `/review` section
   - Format: Match existing plan command format (title, description, agent, examples, output)
   - Mark as "Status: Planned" in description

2. **Document intended behavior**
   - Validates: YAML frontmatter completeness, phase file structure (12 sections), file paths exist
   - Uses: `CK_VALIDATION_MODE` (prompt/strict/off) and `CK_VALIDATION_MIN_QUESTIONS` from config
   - Agent: `epost-architect` (or `epost-reviewer`)
   - Output: Validation report with pass/fail per check

3. **Update command count**
   - `cli-reference.md` line 11: "30 commands organized into 8 categories" - update to 31
   - `cli-reference.md` line 806: "Total Commands: 30" - update to 31

4. **Add to Validation Commands section**
   - `cli-reference.md` lines 793-800: Add `/plan:validate` alongside `npm run validate:*` scripts

## Todo List

- [ ] Add `/plan:validate` command entry after `/plan:parallel` in `cli-reference.md`
- [ ] Update total command count (30 -> 31) in overview and footer
- [ ] Add reference in Validation Commands section (lines 793-800)
- [ ] Verify formatting consistency with adjacent command entries

## Success Criteria

- `/plan:validate` documented in `cli-reference.md` with description, examples, output
- Marked as "Planned" status to indicate no command file exists yet
- Command count updated to 31
- No formatting inconsistencies with surrounding entries

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Documenting unimplemented command causes confusion | Low | Clearly marked "Planned" status |
| Command behavior may change before implementation | Low | Description is minimal; easy to update |
| Session-init config may be removed | Low | Config already exists and is stable |

## Security Considerations

No security implications. This is documentation of a planned validation command.

## Next Steps

- Independent of Phase 01 and Phase 02
- After documenting, create `.claude/commands/plan/validate.md` command file (separate task)
- Consider adding validation logic to epost-reviewer agent (future enhancement)
