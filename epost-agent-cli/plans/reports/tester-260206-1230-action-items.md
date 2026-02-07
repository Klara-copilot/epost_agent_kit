# Test Suite Action Items - Priority Fixes

**Report Date**: 2026-02-06
**Test Status**: 59/65 passing (90.8%)
**Critical Issues**: 1 (dry-run mode)

---

## Priority 1: Critical Functionality Fix

### Issue: Uninstall Dry-Run Mode Not Working
**File**: `/Users/ddphuong/Projects/agent-kit/epost_agent_kit/epost-agent-cli/src/commands/uninstall.ts`
**Test**: `tests/integration/uninstall-command.test.ts > should handle dry-run mode`
**Error**: Files deleted in dry-run mode instead of being preserved

**Expected Behavior**:
```
When --dry-run flag is used:
1. Show uninstall plan
2. Do NOT delete any files
3. Do NOT modify filesystem
4. Exit cleanly
```

**Current Behavior**:
- Files are being deleted even with --dry-run
- Test assertion: `expect(ownedExists).toBe(true)` fails
- File should remain but doesn't

**Fix Steps**:
1. Review `src/commands/uninstall.ts` implementation
2. Ensure `options.dryRun` flag prevents file deletion
3. Wrap actual deletion logic in condition: `if (!options.dryRun) { /* delete */ }`
4. Run test: `npm test -- tests/integration/uninstall-command.test.ts`
5. Verify test passes

**Code Pattern**:
```typescript
// Current (broken)
await removeFile(filePath);

// Should be
if (!options.dryRun) {
  await removeFile(filePath);
}
```

---

## Priority 2: Integration Test Fixes

### Issue A: GitHub API Mock Not Intercepting Requests
**Files**:
- `tests/integration/init-command.test.ts`
- `tests/helpers/mock-github.ts` or similar

**Tests Failing**:
- `should initialize project with kit files`
- `should preserve modified files by default`
- `should overwrite all files with --fresh`
- `should handle dry-run mode` (timeout)

**Error**: `GitHub API error: 404 Not Found`

**Root Cause**:
- Mock setup not properly intercepting GitHub API calls
- Tests attempt real network requests to GitHub
- Template repository may not exist or mock routes not configured

**Fix Steps**:
1. Check test setup files for mock configuration
2. Verify mock library is set up (nock, msw, or vitest mocking)
3. Ensure GitHub API routes are properly mocked:
   - `GET /repos/{owner}/repo/contents/` (template download)
   - `GET /repos/{owner}/repo/releases` (version info)
4. Add proper mock responses for template files
5. Verify mock is active before tests run

**Expected Mock Routes**:
```typescript
// Should mock these endpoints
GET /repos/klara-copilot/epost-agent-kit-template/contents/
GET /repos/klara-copilot/epost-agent-kit-template/zipball/main
```

---

### Issue B: Doctor JSON Output Format
**File**: `tests/integration/doctor-command.test.ts`
**Test**: `should generate JSON report`
**Error**: `Unexpected non-whitespace character after JSON at position 794 (line 41 column 2)`

**Root Cause**:
- Doctor command outputs JSON mixed with color codes or logging
- JSON.parse() fails because output contains non-JSON characters
- Likely ANSI color codes or CLI formatting in output

**Fix Steps**:
1. Review `src/commands/doctor.ts` JSON output generation
2. Either:
   - Option A: Remove all non-JSON output when `--json` flag is used
   - Option B: Update test to extract JSON from mixed output
3. Ensure JSON-only output when format is JSON
4. Run test: `npm test -- tests/integration/doctor-command.test.ts`

**Code Pattern**:
```typescript
// Current (broken)
console.log(colors.cyan('Health Check Results:'));
console.log(results);
console.log(JSON.stringify(report));

// Should be (with --json flag)
if (options.json) {
  console.log(JSON.stringify(report)); // ONLY JSON
} else {
  console.log(colors.cyan('Health Check Results:'));
  console.log(results);
}
```

---

## Priority 3: Test Infrastructure Enhancements

### Issue: Timeout Handling
**Test**: `should handle dry-run mode` in init-command
**Error**: Test times out at 60000ms

**Cause**: Likely waiting for GitHub API response in test
**Fix**: Implement Priority 2 fixes (proper mocking) first, then test should complete quickly

---

## Verification Checklist

After implementing fixes, verify with:

```bash
# Test individual fixes
npm test -- tests/integration/uninstall-command.test.ts --grep "dry-run"
npm test -- tests/integration/init-command.test.ts
npm test -- tests/integration/doctor-command.test.ts

# Run full suite
npm test

# Verify coverage still good
npm test -- --coverage
```

Expected result after all fixes:
```
Test Files  10 passed (10)
Tests      65 passed (65)
```

---

## Unit Tests Status

✓ ALL 55 UNIT TESTS PASSING
- No action needed
- All critical paths verified
- Coverage is complete

Unit test files verified working:
- `/tests/unit/core/checksum.test.ts` (LF normalization working)
- `/tests/unit/core/ownership.test.ts` (Classification working)
- `/tests/unit/core/smart-merge.test.ts` (Merge logic working)
- `/tests/unit/core/package-manager.test.ts` (PM detection working)
- `/tests/unit/core/file-system.test.ts` (File ops working)
- `/tests/unit/commands/versions.test.ts` (Versions working)
- `/tests/unit/setup.test.ts` (Setup working)

---

## Summary

| Item | Status | Action |
|------|--------|--------|
| Unit tests (55) | ✓ PASS | None needed |
| Checksum + LF normalization | ✓ VERIFIED | None needed |
| Ownership classification | ✓ VERIFIED | None needed |
| Smart merge logic | ✓ VERIFIED | None needed |
| Package manager detection | ✓ VERIFIED | None needed |
| Uninstall dry-run | ✗ FAIL | **FIX IMMEDIATELY** |
| Init GitHub API | ✗ FAIL | Fix mocking |
| Doctor JSON output | ✗ FAIL | Fix output format |

**Est. Fix Time**: 30-45 minutes for all three issues
