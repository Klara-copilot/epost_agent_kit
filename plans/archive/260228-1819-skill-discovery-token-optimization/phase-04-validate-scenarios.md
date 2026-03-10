# Phase 04: Validate with Scenario Tests

## Context Links
- [Plan](./plan.md)
- [Phase 03](./phase-03-slim-agent-skills.md)

## Overview
**Date**: 2026-02-28
**Priority**: P2
**Description**: Validate that all agent capabilities are preserved after slimming. Test that skill-discovery correctly loads needed skills for common scenarios.
**Implementation Status**: ⏳ Pending

## Validation Matrix

### epost-architect scenarios
| Scenario | Needed Skills | Discovery Finds |
|----------|--------------|-----------------|
| "plan biometric login for iOS" | planning + ios-development | ios-* from platform detection |
| "plan with research phase" | planning + research | research from "research" keyword |
| "plan API with dependencies" | planning + knowledge-retrieval | knowledge-retrieval from "dependencies" signal |
| "write a technical spec" | planning + doc-coauthoring | doc-coauthoring from "spec/doc" signals |

### epost-debugger scenarios
| Scenario | Needed Skills | Discovery Finds |
|----------|--------------|-----------------|
| "debug iOS crash" | debugging + ios-development | ios-* from platform detection |
| "stuck on this bug for hours" | debugging + problem-solving | problem-solving from "stuck" signal |
| "find related issues in knowledge" | debugging + knowledge-base | knowledge-base from "knowledge" signal |
| "look up library docs for fix" | debugging + docs-seeker | docs-seeker from "docs/library" signal |

### epost-implementer scenarios
| Scenario | Needed Skills | Discovery Finds |
|----------|--------------|-----------------|
| "implement web form component" | code-review + web-frontend | web-* from platform detection |
| "handle API timeout gracefully" | code-review + error-recovery | error-recovery from "timeout" signal |
| "check if similar code exists" | code-review + knowledge-retrieval | knowledge-retrieval from "existing/similar" signal |

### epost-reviewer scenarios
| Scenario | Needed Skills | Discovery Finds |
|----------|--------------|-----------------|
| "review iOS PR" | code-review + ios-development | ios-* from platform detection |
| "review with codebase context" | code-review + repomix | repomix from "codebase/overview" signal |

### epost-tester scenarios
| Scenario | Needed Skills | Discovery Finds |
|----------|--------------|-----------------|
| "test Android component" | debugging + android-development | android-* from platform detection |
| "test with retry patterns" | debugging + error-recovery | error-recovery from "retry" signal |

## Implementation Steps
1. **Create validation checklist** from matrix above
2. **Dry-run each scenario**: Trace through skill-discovery logic manually
   - Does skill-index.json have matching keywords/triggers for each signal?
   - Does the discovered skill contain the needed information?
3. **Identify gaps**: Any scenario where discovery fails to find the right skill
4. **Fix gaps**: Add missing keywords/triggers to skill frontmatter or index
5. **Document results** in completion report

## Todo List
- [ ] Validate all architect scenarios
- [ ] Validate all debugger scenarios
- [ ] Validate all implementer scenarios
- [ ] Validate all reviewer scenarios
- [ ] Validate all tester scenarios
- [ ] Fix any keyword/trigger gaps in skill-index.json
- [ ] Write completion report

## Success Criteria
- 100% of scenarios in matrix have a valid discovery path
- No scenario results in a missing critical skill
- All gap fixes documented

## Risk Assessment
**Risks**: Edge cases not covered by matrix
**Mitigation**: Matrix covers the top 2-3 scenarios per agent; remaining edge cases acceptable (agents still function, just without optimal skill context)

## Security Considerations
None.

## Next Steps
- Plan complete. Monitor in production for discovery misses.
