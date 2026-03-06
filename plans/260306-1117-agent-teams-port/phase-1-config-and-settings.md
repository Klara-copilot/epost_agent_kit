---
phase: 1
title: "Hook config toggles + settings.json events"
effort: 30m
depends: []
---

# Phase 1: Config & Settings

## Task 1.1: Add hook toggles to DEFAULT_CONFIG

**File**: `packages/core/hooks/lib/epost-config-utils.cjs`
**Action**: Modify

Add 3 new entries to `DEFAULT_CONFIG.hooks` (after line 39, before closing `}`):

```js
'task-completed-handler': true,
'teammate-idle-handler': true,
'team-context-inject': true
```

These follow the existing flat boolean pattern (e.g., `'session-init': true`).

## Task 1.2: Add TaskCompleted + TeammateIdle events to settings.json

**File**: `packages/core/settings.json`
**Action**: Modify

Add two new event blocks to the `hooks` object:

```json
"TaskCompleted": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "node .claude/hooks/task-completed-handler.cjs"
      }
    ]
  }
],
"TeammateIdle": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "node .claude/hooks/teammate-idle-handler.cjs"
      }
    ]
  }
]
```

## Task 1.3: Add team-context-inject to SubagentStart

**File**: `packages/core/settings.json`
**Action**: Modify

Add team-context-inject as second hook in existing SubagentStart entry (after subagent-init.cjs):

```json
"SubagentStart": [
  {
    "matcher": "*",
    "hooks": [
      {
        "type": "command",
        "command": "node .claude/hooks/subagent-init.cjs"
      },
      {
        "type": "command",
        "command": "node .claude/hooks/team-context-inject.cjs"
      }
    ]
  }
]
```

## Validation

- `node -e "const c = require('./packages/core/hooks/lib/epost-config-utils.cjs'); console.log(c.DEFAULT_CONFIG.hooks['task-completed-handler'])"` prints `true`
- `cat packages/core/settings.json | node -e "JSON.parse(require('fs').readFileSync(0,'utf8'))"` exits 0 (valid JSON)
- settings.json has entries for TaskCompleted, TeammateIdle, and team-context-inject in SubagentStart
