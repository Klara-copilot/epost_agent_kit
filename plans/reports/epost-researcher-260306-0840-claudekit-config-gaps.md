# Config Gap Analysis: claudekit → epost_agent_kit

**Date**: 2026-03-06  
**Source**: `/Users/than/Projects/claudekit/`  
**Target**: `/Users/than/Projects/epost_agent_kit/`  
**Status**: ACTIONABLE

---

## Executive Summary

Comparison of `.ck.json` vs `.epost-kit.json` reveals **5 major gaps**:

1. **Missing hook toggles** — claudekit has 10 hook control flags; epost has 3
2. **privacyBlock config bug** — privacy-checker reads field that doesn't exist in DEFAULT_CONFIG
3. **Missing skills.research.useGemini** — research skill toggle lost (WebSearch only)
4. **Missing statusline mode** — display mode hardcoded instead of configurable
5. **docs.maxLoc inert** — exists in both but never used

---

## Config File Comparison

### claudekit (.ck.json)

DEFAULT_CONFIG has 18 keys:
- plan (7 keys), paths (2), docs (1), locale (2), trust (2), project (3)
- codingLevel, statusline, privacyBlock, gemini, skills, hooks (10), assertions

### epost_agent_kit (.epost-kit.json)

DEFAULT_CONFIG has 5 top-level keys:
- hooks (3 subtypes), plan (7), paths (2), docs (1), locale (2), trust (2), project (3), assertions

---

## Gap Details

### Gap 1: Hook Toggle Configuration (SEVERITY: MEDIUM)

claudekit allows disabling ALL hooks via config:
```javascript
hooks: {
  'session-init': true/false,
  'subagent-init': true/false,
  'dev-rules-reminder': true/false,
  'usage-context-awareness': true/false,
  'context-tracking': true/false,
  'scout-block': true/false,
  'privacy-block': true/false,
  'post-edit-simplify-reminder': true/false,
  'task-completed-handler': true/false,
  'teammate-idle-handler': true/false
}
```

epost only allows 3:
```javascript
hooks: {
  scout: { enabled: true/false },
  privacy: { enabled: true/false },
  packagesGuard: { enabled: true/false }
}
```

7 hooks in epost have NO config toggle at all.

Code: claudekit has `isHookEnabled(name)` function; epost removed it.

### Gap 2: privacyBlock Bug (SEVERITY: MEDIUM)

privacy-checker.cjs code:
```javascript
return config.privacyBlock === false;
```

But epost DEFAULT_CONFIG has NO `privacyBlock` field.

Result: Privacy block cannot be disabled via config (always on).

### Gap 3: Missing skills.research.useGemini (SEVERITY: LOW)

claudekit:
```javascript
skills: { research: { useGemini: true } }
```

epost: NO `skills` section in DEFAULT_CONFIG

Result: Research always uses WebSearch (slower).

### Gap 4: Missing statusline Mode (SEVERITY: LOW)

claudekit:
```javascript
statusline: 'full' | 'compact' | 'minimal' | 'none'
```

epost: Not in DEFAULT_CONFIG

Result: Cannot optimize token usage with minimal display.

### Gap 5: docs.maxLoc Inert (SEVERITY: VERY LOW)

Both have:
```javascript
docs: { maxLoc: 800 }
```

Neither enforces it. Dead code.

---

## Hook Coverage Matrix

| Hook | claudekit Config | epost Config | GAP |
|------|-----------------|-------------|-----|
| session-init | ✓ | ✗ | MISSING |
| subagent-init | ✓ | ✗ | MISSING |
| dev-rules-reminder | ✓ | ✗ | MISSING |
| usage-context-awareness | ✓ | ✗ | MISSING |
| context-tracking | ✓ | ✗ | MISSING |
| scout-block | ✓ | ✓ | COVERED |
| privacy-block | ✓ | ✗ BUG | BUG |
| post-edit-simplify-reminder | ✓ | ✗ | MISSING |
| task-completed-handler | ✓ | ✗ | MISSING |
| teammate-idle-handler | ✓ | ✗ | MISSING |

---

## Fixes Required

### MUST: Fix privacyBlock Bug

File: `packages/core/hooks/lib/epost-config-utils.cjs`

Add to DEFAULT_CONFIG:
```javascript
privacyBlock: true,  // ← ADD THIS
```

### SHOULD: Restore Hook Toggles

Add to DEFAULT_CONFIG.hooks:
```javascript
hooks: {
  scout: { enabled: true, ignoreFile: '.claude/.epost-ignore' },
  privacy: { enabled: true },
  packagesGuard: { enabled: true },
  'session-init': true,          // ← ADD
  'subagent-init': true,         // ← ADD
  'dev-rules-reminder': true,    // ← ADD
  'usage-context-awareness': true,
  'context-tracking': true,
  'post-edit-simplify-reminder': true
}
```

Restore `isHookEnabled(hookName)` function in exports.

### NICE: Restore skills.research.useGemini

Add to DEFAULT_CONFIG:
```javascript
skills: {
  research: { useGemini: true }
}
```

### NICE: Restore statusline Mode

Add to DEFAULT_CONFIG:
```javascript
statusline: 'full'
```

---

## Files to Update

1. `packages/core/hooks/lib/epost-config-utils.cjs` — DEFAULT_CONFIG + isHookEnabled()
2. epost schema (if separate from code) — add privacyBlock, skills, statusline fields

---

## Impact Summary

| Gap | Impact | Effort | Risk |
|-----|--------|--------|------|
| privacyBlock bug | Cannot disable privacy via config | Very low | Very low |
| Hook toggles | No perf optimization | Low | Very low |
| skills.research.useGemini | Research slower | Low | Very low |
| statusline | Token optimization lost | Low | Very low |
| docs.maxLoc | None (unused) | N/A | N/A |

---

## Verdict: ACTIONABLE

All gaps can be fixed with backwards-compatible config additions. No breaking changes.

Priority order: privacyBlock fix → hook toggles → research.useGemini → statusline

