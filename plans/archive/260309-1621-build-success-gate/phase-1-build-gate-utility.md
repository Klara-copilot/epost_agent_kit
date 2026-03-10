---
phase: 1
title: "Build-gate utility"
effort: 1.5h
depends: []
---

# Phase 1: Build-Gate Utility

## Context Links

- [Plan](./plan.md)
- `packages/core/hooks/lib/project-detector.cjs` -- reuse detection patterns
- `profiles/profiles.yaml` -- platform definitions

## Overview

- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Create a Node.js utility that detects the project platform and executes the appropriate build command. Returns structured JSON output with pass/fail status.

## Requirements

### Functional

- Detect platform from project markers (same heuristics as `profiles.yaml` auto_detect rules)
- Run the correct build command per platform
- Support explicit platform override via `--platform` flag
- Support `--dry-run` flag (report what would run without executing)
- Exit code 0 = build passed, 1 = build failed, 2 = no build command detected

### Non-Functional

- Reuse `execSafe` from `project-detector.cjs`
- Timeout: 5 minutes for build commands (configurable)
- Output: JSON to stdout for agent consumption + human-readable stderr

## Related Code Files

### Files to Create

- `packages/core/hooks/lib/build-gate.cjs` -- main utility

### Files to Modify

- None (new file only)

## Implementation Steps

1. **Create `packages/core/hooks/lib/build-gate.cjs`**
   - Import `execSafe` from `./project-detector.cjs`
   - Define platform detection map:

     | Marker | Platform | Build Command |
     |--------|----------|---------------|
     | `package.json` + `next` dep | web | `npm run build` |
     | `package.json` (generic) | web | `npm run build` (if `build` script exists) |
     | `build.gradle.kts` or `build.gradle` | android | `./gradlew assembleDebug` |
     | `Package.swift` or `*.xcodeproj` | ios | `xcodebuild build -scheme <scheme> -destination 'generic/platform=iOS'` |
     | `pom.xml` | backend | `mvn package -DskipTests` |

   - Parse CLI args: `--platform <p>`, `--dry-run`, `--timeout <ms>`, `--skip-build`
   - If `--skip-build`: exit 0 immediately (for WIP commits)
   - Auto-detect platform if not specified
   - Run build command via `execSync` with timeout
   - Output JSON: `{ "platform": "web", "command": "npm run build", "success": true, "duration_ms": 1234 }`
   - On failure: include `stderr` excerpt in output
   - If no build command found: `{ "platform": "unknown", "command": null, "success": null, "warning": "No build command detected" }` + exit 2

2. **Handle edge cases**
   - Monorepo: check for root-level `package.json` build script first
   - iOS: detect scheme name from `.xcodeproj` or use first available scheme
   - Multiple platforms: use first match (priority: web > backend > android > ios)

## Todo List

- [ ] Create `build-gate.cjs` with platform detection
- [ ] Add CLI arg parsing (`--platform`, `--dry-run`, `--skip-build`, `--timeout`)
- [ ] Implement build execution with timeout
- [ ] JSON output format
- [ ] Handle missing build commands gracefully

## Success Criteria

- Running `node packages/core/hooks/lib/build-gate.cjs --dry-run` in a Next.js project outputs `{"platform":"web","command":"npm run build",...}`
- Running in a project with no build file exits with code 2 and warning

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| iOS scheme detection fails | Med | Fall back to `xcodebuild build` without -scheme |
| Build takes too long | Low | 5min default timeout, configurable |
| Agent runs in epost_agent_kit CWD (no build) | Med | Utility detects missing build → warns, doesn't block |

## Security Considerations

- Build commands execute arbitrary code in project context; this is expected behavior
- No secrets in output (build stderr could leak env vars; truncate output to 500 chars)

## Next Steps

- Phase 2: wire into git commit/push workflow
