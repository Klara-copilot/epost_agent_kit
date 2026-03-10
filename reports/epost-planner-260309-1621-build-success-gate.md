# Plan: Build-Success Gate

**Date**: 2026-03-09 16:21
**Agent**: epost-planner
**Plan**: `plans/260309-1621-build-success-gate/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Created a 3-phase plan to add automatic build verification before git commits and after audit workflows. The approach uses a shared utility (`build-gate.cjs`) that auto-detects project platform and runs the appropriate build command, integrated into existing skill workflows via instruction text.

---

## Plan Details

| # | Phase | Effort | Key Files |
|---|-------|--------|-----------|
| 1 | Build-gate utility | 1.5h | `packages/core/hooks/lib/build-gate.cjs` (new) |
| 2 | Git workflow integration | 1h | `packages/core/skills/git/references/commit.md`, `push.md`, `SKILL.md` |
| 3 | Audit workflow integration | 0.5h | `packages/core/skills/audit/SKILL.md` |

**Total effort**: 3h
**Platform detection**: web (npm), android (gradle), ios (xcodebuild), backend (maven)
**Key design decisions**:
- Shared utility over standalone skill (YAGNI)
- Skill instructions over PreToolUse hook (more reliable, agent-controlled)
- Build gate is mandatory for git, advisory for audit

---

## Verdict

**READY** -- codebase analysis sufficient; all integration points identified; no external research needed.

---

*Unresolved questions:*
- iOS scheme detection: should utility parse `.xcodeproj` for scheme name or require explicit `--platform ios --scheme <name>`?
- Monorepo with multiple platforms: should it build all detected platforms or just the one matching changed files?
