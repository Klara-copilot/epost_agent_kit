# Report: Generalize /get-started for Any Project Type

**Agent**: epost-architect
**Date**: 2026-03-04
**Plan**: `plans/260304-0659-generalize-get-started/`

## Summary

Created plan to remove Java/Maven/epost-backend-specific hardcoded examples from the `/get-started` skill and replace them with generic, detect-from-markers patterns that work for any project type (Node.js, Python, Rust, Swift, Kotlin, Go, Java, etc.).

## Problem

Phase 3 (Environment Setup) and Phase 4 (Final Summary) contain:
- Java-first if/else chains for tool installation (mvn, mvnw, openjdk)
- Maven-specific dependency resolution commands
- epost-specific env var names (JWT_SERVICE_HOST_PORT, LUZ_DOCS_VIEW_CONTROLLER_HOST_PORT)
- Java-specific build/run examples
- GCP Artifact Registry references

These were written from a specific Java project example and should be generalized.

## Solution

Replace all hardcoded tool/command lists with detection tables:
- Step 1: Marker -> tool -> install command (8 ecosystems)
- Step 2: Lockfile/manifest -> dep install command (12 package managers)
- Step 3: Generic env var guidance (no hardcoded var names)
- Step 4: Marker -> build command (7 build systems)
- Step 5: Marker -> start command (6 patterns)
- Phase 4 examples: diverse project types

## Changes Required

| File | Change |
|------|--------|
| `packages/core/skills/get-started/SKILL.md` | Rewrite Phase 3 Steps 1-5, Phase 4 examples |

## Effort: 1h (1 phase)

## Unresolved Questions

None -- straightforward text replacement.
