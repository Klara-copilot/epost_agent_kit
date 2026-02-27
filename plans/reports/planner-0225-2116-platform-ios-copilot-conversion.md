# Platform iOS GitHub Copilot Conversion - Plan Complete

## Summary

Created comprehensive conversion plan for ALL platform-ios components to GitHub Copilot format.

## Files Created

| File | Purpose |
|------|---------|
| `plans/0225-2116-platform-ios-copilot-conversion/plan.md` | Master plan with overview |
| `plans/0225-2116-platform-ios-copilot-conversion/phase-01-agent-conversion.md` | Agent conversion steps |
| `plans/0225-2116-platform-ios-copilot-conversion/phase-02-commands-conversion.md` | Commands conversion (8 files) |
| `plans/0225-2116-platform-ios-copilot-conversion/phase-03-skills-conversion.md` | Skills conversion (4+17 files) |
| `plans/0225-2116-platform-ios-copilot-conversion/phase-04-snippet-conversion.md` | Snippet conversion |
| `plans/0225-2116-platform-ios-copilot-conversion/phase-05-validation.md` | Validation & testing |

## Conversion Scope

### Source Files: 31 total
- **Agents:** 1 (epost-ios-developer)
- **Commands:** 8 (cook, test, debug, simulator, 4 a11y)
- **Skills:** 4 main + 17 references
- **Snippet:** 1 (CLAUDE.snippet.md)

### Target Files: 14 total
- **Instructions:** 5 files in `.github/instructions/`
- **Prompts:** 8 files in `.github/prompts/`
- **Global:** 1 file (`copilot-instructions.md`)

## Key Conversion Rules

| Claude | Copilot |
|--------|---------|
| `tools: [...]` | Remove (not applicable) |
| `model: sonnet` | Remove |
| `skills: [...]` | Related Instructions section |
| `$ARGUMENTS` | `${input:variable}` |
| `mcp__tool__name` | Natural language |
| `.claude/` paths | `.github/` paths |
| `/ios:command` | Natural triggers |

## applyTo Patterns

| Type | Pattern |
|------|---------|
| iOS dev | `"**/*.swift"` |
| RAG | `"**/*"` |

## Effort Estimate

| Phase | Time |
|-------|------|
| Agent | 30m |
| Commands | 1.5h |
| Skills | 3h |
| Snippet | 15m |
| Validation | 45m |
| **Total** | **6h** |

## Next Steps

1. Review plan.md for overall approach
2. Execute Phase 1 (Agent conversion)
3. Execute Phase 2 (Commands)
4. Execute Phase 3 (Skills - largest)
5. Execute Phase 4 (Snippet)
6. Run Phase 5 (Validation)

## Templates Used

- `packages/github-copilot/instructions/agent-template.md`
- `packages/github-copilot/prompts/command-template.md`
- `packages/github-copilot/skills/skill-template.md`
- `packages/github-copilot/instructions/claude-md-template.md`

## Sample Reference

Already converted: `packages/github-copilot/agents/epost-a11y-specialist.instructions.md`

---

**Plan Location:** `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/plans/0225-2116-platform-ios-copilot-conversion/`
