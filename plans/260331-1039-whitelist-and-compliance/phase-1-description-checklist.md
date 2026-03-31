---
phase: 1
title: "Description Validation Checklist"
effort: 15m
depends: []
---

# Phase 1: Description Validation Checklist

## Context Links
- [Plan](./plan.md)
- `packages/kit/skills/kit/references/skill-development.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 15m
- Description: Add a formal description validation checklist to skill-development.md so Phase 2 audit (and future skill creation) has a concrete pass/fail standard.

## Requirements

### Functional
- Checklist must cover CSO compliance (trigger-only, no workflow summary)
- Must include character limit (1024 chars for agentskills.io)
- Must require trigger phrase examples in quotes
- Must be a numbered or bulleted checklist format

### Non-Functional
- Integrate into existing doc structure, not a separate file

## Related Code Files

### Files to Modify
- `packages/kit/skills/kit/references/skill-development.md` — append checklist section after existing "CSO: Cognitive Skill Optimization" section (~line 97)

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Add "Description Validation Checklist" section** to `skill-development.md`
   - Place after the CSO section (before agentskills.io section)
   - Include these checks:
     - [ ] Starts with "Use when..." trigger phrasing (third-person)
     - [ ] Contains at least 2 concrete trigger examples (quoted phrases or situations)
     - [ ] Does NOT summarize workflow steps (description trap)
     - [ ] Under 1024 characters total
     - [ ] Includes explicit user-facing phrases in quotes (e.g., "plan", "debug this")
     - [ ] Third-person voice throughout ("Use when user says..." not "I will...")
     - [ ] Mentions the outcome/what it dispatches, not the how

## Todo List
- [ ] Read current skill-development.md
- [ ] Add checklist section
- [ ] Verify no duplication with existing CSO section

## Success Criteria
- Checklist exists in skill-development.md
- 7 checkable items covering CSO, character limit, trigger phrases, voice

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicates CSO section content | Low | Reference CSO section, don't repeat principles |

## Security Considerations
- None identified

## Next Steps
- Phase 2 uses this checklist to audit all 25 skill descriptions
