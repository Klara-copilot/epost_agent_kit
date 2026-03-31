---
phase: 1
title: "Signal Infrastructure"
effort: 3h
depends: []
---

# Phase 1: Signal Infrastructure

## Context Links
- [Plan](./plan.md)
- Research: `reports/260323-2353-self-evolving-skill-loop-epost-researcher.md`
- Existing hook: `.claude/hooks/lesson-capture.cjs` (pattern reference)
- Journal: `docs/journal/README.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 3h
- Description: Create `docs/proposals/` directory, signal schema, and extractor script that parses journal entries + audit reports for improvement signals.

## Requirements

### Functional
- Signal extractor script reads `docs/journal/` and `reports/` directories
- Extracts 3 signal types: audit failures, journal "almost went wrong" flags, repeated workarounds
- Outputs structured `docs/proposals/signals.json` with signal entries
- Each signal includes: source file, signal type, target skill, excerpt, confidence, timestamp
- Idempotent: re-running does not duplicate signals (keyed by source+excerpt hash)

### Non-Functional
- Script runs in < 5 seconds on current corpus (~50 journal/report files)
- No external dependencies (Node.js built-ins + fs only)
- Follows existing hook/script patterns (`.cjs` extension, crash-safe)

## Related Code Files

### Files to Create
- `packages/core/scripts/extract-signals.cjs` — Signal extractor script
- `docs/proposals/signals.json` — Output file (initially empty array)
- `docs/proposals/README.md` — Explains proposal workflow for humans

### Files to Modify
- None in Phase 1

### Files to Delete
- None

## Implementation Steps

1. **Create `docs/proposals/` directory + README**
   - Explain the proposal workflow: signal -> proposal -> review -> apply
   - Document signal types and confidence levels
   - Include `signals.json` schema

2. **Define signal schema**
   ```json
   {
     "signals": [
       {
         "id": "sig-{hash8}",
         "type": "audit-failure | journal-flag | workaround",
         "confidence": "high | medium | low",
         "source": "docs/journal/kit-rationalization/260319-phase1-agent-deletion.md",
         "excerpt": "Almost shipped broken code because...",
         "targetSkill": "skill-discovery",
         "suggestedAction": "Add platform conflict detection to discovery flow",
         "detectedAt": "2026-03-24T06:00:00Z",
         "status": "new | proposed | dismissed"
       }
     ]
   }
   ```

3. **Build extractor script** (`packages/core/scripts/extract-signals.cjs`)
   - **Journal parser**: Glob `docs/journal/**/*.md`, find `## What almost went wrong` sections, extract text + infer target skill from keywords
   - **Report parser**: Glob `reports/*.md`, find audit verdict FAIL entries, extract failure reason + target skill
   - **Workaround detector**: Grep journal entries for patterns like "used Y instead of X", "workaround:", "worked around"
   - **Deduplication**: SHA-256 hash of (source + excerpt first 100 chars) as signal ID
   - **Merge**: Read existing `signals.json`, merge new signals, write back

4. **Wire into `.claude/` via init**
   - Script lives in `packages/core/scripts/` (source of truth)
   - Copied to `.claude/scripts/` on init
   - Runnable: `node .claude/scripts/extract-signals.cjs`

## Todo List
- [ ] Create `docs/proposals/` directory with README + empty signals.json
- [ ] Implement journal parser (extract "almost went wrong" sections)
- [ ] Implement report parser (extract audit failure signals)
- [ ] Implement workaround detector (pattern matching)
- [ ] Implement deduplication and merge logic
- [ ] Test on existing journal entries (5 entries in kit-rationalization + kit-marketplace)
- [ ] Verify idempotency (run twice, same output)

## Success Criteria
- `node .claude/scripts/extract-signals.cjs` produces valid `docs/proposals/signals.json`
- Existing journal entry `260319-phase1-agent-deletion.md` produces at least 1 signal (the "almost went wrong" about skill-discovery-superpower plan reference)
- Re-running produces identical output (idempotent)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Journal entries don't follow template | Med | Graceful fallback — look for ## headers with "wrong", "risk", "gotcha" |
| Too many low-quality signals | Med | Confidence scoring + minimum excerpt length filter |
| No journal entries yet for some epics | Low | Script outputs empty array — no crash |

## Security Considerations
- Read-only access to docs/journal/ and reports/ — no writes to packages/
- Script output goes to docs/proposals/ only

## Next Steps
- Phase 2 uses signals.json as input for proposal generation
