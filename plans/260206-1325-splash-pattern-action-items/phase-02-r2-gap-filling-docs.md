# Phase 02: Document R2 Gap-Filling Strategy

## Context Links

- [Plan](./plan.md)
- [`plan/hard.md`](../../.claude/commands/plan/hard.md) - Primary target (R2 orchestration, lines 66-98)
- [`plan/parallel.md`](../../.claude/commands/plan/parallel.md) - Uses "Same as /plan:hard" for steps 1-4
- [`epost-architect.md`](../../.claude/agents/epost-architect.md) - Architecture agent definition

## Overview

- Priority: P1
- Status: Pending
- Effort: 30m
- Description: Document R2 (Researcher 2: Codebase Analysis) gap-filling strategy. Currently, `hard.md` describes R2's role and orchestration but doesn't explicitly document what happens when R2 finds gaps (missing patterns, undocumented conventions) and how it should supplement R1's findings.

## Key Insights

- `hard.md` lines 92-98 define R2 aggregation: "R2 matched to R1 best practices", "R1 approaches fit R2 modules"
- `hard.md` lines 272-290 define orchestration rules: "R2 can supplement R1, overlap allowed" (line 275)
- `hard.md` line 281: "R2 fails: Warn, proceed with R1 only, mark plan partial research"
- Missing: explicit guidance on what R2 should do when codebase lacks patterns for R1's recommendations
- The gap-filling concept is: when R1 recommends Pattern X but R2 finds no existing implementation of Pattern X, R2 should document this gap and propose an adaptation strategy

## Requirements

### Functional
- Document R2 gap-filling behavior in `hard.md` section 4 (Researcher 2 prompt) or section 5 (Aggregate)
- Explain how R2 supplements R1 when codebase lacks matching patterns
- Provide concrete gap-filling scenarios

### Non-Functional
- Addition should be < 20 lines
- Must not break existing command file structure
- Keep `hard.md` under 300 lines total (currently 291)

## Architecture

Add a focused subsection within `hard.md` that clarifies R2's gap-filling role. Two placement options:

**Option A (Recommended)**: Add to Researcher 2 prompt (section 4, around line 76-88) as a new instruction in the researcher prompt template. This ensures R2 agents receive the guidance directly.

**Option B**: Add to Aggregate Research section (section 5, lines 92-98). Less direct but groups strategy info together.

## Related Code Files

### Files to Modify
- `.claude/commands/plan/hard.md` - Add R2 gap-filling guidance (~15 lines)

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Add gap-filling instructions to R2 prompt in `hard.md`**
   - Location: Inside the Researcher 2 prompt template, after section "7. Code Standards Compliance" (around line 87)
   - Add new section "8. Gap Analysis" to R2's output template
   - Content: When R1 recommends patterns/libraries not found in codebase, document the gap and propose adaptation strategy

2. **Update Aggregate Research section**
   - Location: `hard.md` lines 92-98
   - Add `gap_analysis` to the synthesis list: gaps identified by R2, adaptation strategies
   - This tells the architect to include gap info in the plan

3. **Verify parallel.md inherits correctly**
   - `parallel.md` line 20-26 says "Same as /plan:hard steps 1-4"
   - Confirm the R2 gap-filling guidance is inherited (no changes needed to parallel.md)

## Todo List

- [ ] Add "8. Gap Analysis" section to R2 prompt template in `hard.md` (after line 87)
- [ ] Add `gap_analysis` item to Aggregate Research list in `hard.md` (after line 98)
- [ ] Verify `parallel.md` inherits changes via "Same as /plan:hard" reference
- [ ] Confirm `hard.md` stays under 300 lines after additions

## Success Criteria

- R2 researcher prompt includes explicit gap-filling instructions
- Aggregate section includes gap analysis in synthesis list
- `hard.md` total line count remains under 300
- `parallel.md` inherits changes without modification

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| R2 prompt becomes too long for haiku model | Low | Adding only ~8 lines to prompt; well within limits |
| Gap analysis produces noise in simple projects | Low | Framed as "if applicable" to keep optional |
| parallel.md drift from hard.md | Low | parallel.md explicitly references hard.md steps |

## Security Considerations

No security implications. This is documentation of research agent behavior.

## Next Steps

- Independent of Phase 01 and Phase 03
- Consider adding gap-filling examples to epost-architect.md in a future iteration (not required now)
