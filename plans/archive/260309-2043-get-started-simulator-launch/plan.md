---
title: "Extend get-started Phase 3 to simulator/emulator launch"
status: archived
created: 2026-03-09
updated: 2026-03-09
effort: 1.5h
phases: 2
platforms: [ios, android]
breaking: false
---

# Extend get-started Phase 3 to Simulator/Emulator Launch

## Summary

The `/get-started` skill's Phase 3 (environment setup) stops at dependency install. It should go all the way to launching the app on a simulator/emulator for iOS and Android projects. Also needs graceful handling of sudo-blocked steps.

## Key Dependencies

- `packages/core/skills/get-started/SKILL.md` -- target file (Phase 3 prompt block)
- `packages/platform-ios/skills/simulator/SKILL.md` -- existing simulator skill to reference
- No new packages or skills needed

## Execution Strategy

Phase 1: Rewrite Phase 3 prompt block with platform-specific launch steps + sudo handling.
Phase 2: Validate the generated `.claude/` output matches after `epost-kit init`.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Rewrite Phase 3 prompt | 1h | done | [phase-1](./phase-1-rewrite-phase3-prompt.md) |
| 2 | Validate init output | 0.5h | done | [phase-2](./phase-2-validate-init.md) |

## Success Criteria

- [x] Phase 3 prompt includes iOS build + simulator boot + install + launch steps
- [x] Phase 3 prompt includes Android build + emulator/device install + launch steps
- [x] Sudo-blocked steps attempted without sudo first; if blocked, remaining non-sudo steps still run; blocked step listed as manual
- [x] iOS path references `/simulator` skill for simulator management
- [x] `.claude/skills/get-started/SKILL.md` matches after init
