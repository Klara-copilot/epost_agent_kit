---
name: android-build-verification
description: "Android audit build verification — replicant-mcp sequence with Gradle fallback"
user-invocable: false
disable-model-invocation: true
---

# Android Build Verification

Run after the audit report is assembled. MCP-first for structured output; Gradle fallback when MCP unavailable.

## Detection

**Check if `mcp__replicant__build` (or any `mcp__replicant__*` tool) is in your available tool list.**
- Present → use MCP path (Step 2a)
- Absent → use Gradle fallback (Step 2b)

## Step 2a — MCP Path (preferred)

```
1. Run diagnostics to confirm emulator/device readiness:
   mcp__replicant__doctor()

2. Build debug APK:
   mcp__replicant__build({
     variant: 'debug',
     module: 'app'         // or detected app module
   })

3. Run unit tests:
   mcp__replicant__test({
     type: 'unit',
     module: 'app'
   })
```

**Note**: replicant-mcp tool names may vary by version. If `mcp__replicant__build` is unavailable, check available tools via the tool list and adapt. Run `mcp__replicant__doctor` first to confirm setup.

**Format output in report:**

Build pass:
```
Build verification: ✓ PASS (android/replicant-mcp, {duration_ms}ms)
```

Build fail:
```
Build verification: ✗ FAIL (android/replicant-mcp)
Errors:
- {file}:{line}: error: {message}
```

Test results (always append if tests ran):
```
Tests: {N} passed, {M} failed
Failures:
- {TestClass}/{testMethod}: {failure message}
```

## Step 2b — Gradle Fallback

When replicant-mcp is NOT available:

```bash
node .claude/hooks/lib/build-gate.cjs
```

The build-gate detects Gradle automatically and runs `./gradlew assembleDebug`.

Format output:
- Exit 0: `Build verification: ✓ PASS (android/gradle, {duration_ms}ms)`
- Exit 1: `Build verification: ✗ FAIL (android/gradle) — {first 3 lines of stderr}`
- Exit 0, no command: `Build verification: skipped (no build command detected)`

## Advisory

Build verification is advisory — does NOT block the audit verdict. A build failure is appended to the report as a separate finding.
