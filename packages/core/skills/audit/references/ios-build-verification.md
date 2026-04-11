---
name: ios-build-verification
description: "iOS audit build verification — XcodeBuildMCP sequence with shell fallback"
user-invocable: false
disable-model-invocation: true
---

# iOS Build Verification

Run after the audit report is assembled. MCP-first for structured output; shell fallback when MCP unavailable.

## Detection

**Check if `mcp__xcodebuildmcp__build_sim` is in your available tool list.**
- Present → use MCP path (Step 2a)
- Absent → use shell fallback (Step 2b)

## Step 2a — MCP Path (preferred)

```
1. Discover project:
   mcp__xcodebuildmcp__discover_projs({ workspaceRoot: '.' })
   → note: projectPath, available schemes, workspace vs project

2. Build for simulator:
   mcp__xcodebuildmcp__build_sim({
     projectPath: '{discovered}',
     scheme: '{main-app-scheme}',        // not the Tests scheme
     simulatorId: '{iPhone-16-Pro-or-first-available}'
   })

3. Run tests (if test target exists):
   mcp__xcodebuildmcp__test_sim({
     projectPath: '{discovered}',
     scheme: '{test-scheme-or-main}',
     simulatorId: '{same-simulator}'
   })
```

**Discovery hints:**
- Prefer `.xcworkspace` over `.xcodeproj` (SPM/CocoaPods projects have workspace)
- Use the scheme matching the app target — skip UITest schemes for routine audit
- If simulator list is empty, run `mcp__xcodebuildmcp__doctor()` and include output

**Format output in report:**

Build pass:
```
Build verification: ✓ PASS (ios/XcodeBuildMCP, {duration_ms}ms)
```

Build fail:
```
Build verification: ✗ FAIL (ios/XcodeBuildMCP)
Errors:
- {file}:{line}: error: {message}
- {file}:{line}: error: {message}
```

Test results (always append if tests ran):
```
Tests: {N} passed, {M} failed
Failures:
- {TestSuite}/{testName}: {failure message}
```

## Step 2b — Shell Fallback

When `mcp__xcodebuildmcp__build_sim` is NOT available:

```bash
node .claude/hooks/lib/build-gate.cjs
```

Format output:
- Exit 0: `Build verification: ✓ PASS (ios/shell, {duration_ms}ms)`
- Exit 1: `Build verification: ✗ FAIL (ios/shell) — {first 3 lines of stderr}`
- Exit 0, no command: `Build verification: skipped (no build command detected)`

## Advisory

Build verification is advisory — it does NOT block the audit verdict. A build failure is appended to the report as a separate finding, not folded into the code-review verdict.
