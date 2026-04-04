# Hook Implementation Examples

## Command Hook Script Template

```javascript
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));

// Extract relevant fields based on event type
const toolName = input.tool_name || '';
const toolInput = input.tool_input || {};

// Hook logic here
const shouldBlock = false; // Replace with actual logic

if (shouldBlock) {
  process.stderr.write(JSON.stringify({
    hookSpecificOutput: { permissionDecision: 'deny' },
    systemMessage: 'Blocked: reason here'
  }));
  process.exit(2);
}

// Success — optionally inject context
console.log(JSON.stringify({
  systemMessage: 'Hook passed'
}));
```

## Hook Configuration in settings.json

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Glob|Grep|Read|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/my-hook.cjs",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## Prompt Hook (LLM-Driven)

```json
{
  "type": "prompt",
  "prompt": "Validate this tool use is appropriate: $TOOL_INPUT",
  "timeout": 30
}
```

Supported events for prompt hooks: Stop, SubagentStop, UserPromptSubmit, PreToolUse.

## Input/Output Contract

### Input (JSON via stdin)

```json
{
  "session_id": "abc123",
  "cwd": "/project/dir",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": { "file_path": "/path" }
}
```

### PreToolUse Output (JSON via stdout)

```json
{
  "hookSpecificOutput": {
    "permissionDecision": "allow|deny|ask"
  },
  "systemMessage": "Explanation for Claude"
}
```

**Exit codes:** 0 = success, 2 = blocking error (stderr → Claude)

## Matcher Patterns

- Exact: `"matcher": "Write"`
- Multiple: `"matcher": "Read|Write|Edit"`
- Wildcard: `"matcher": "*"`
- Regex: `"matcher": "mcp__.*__delete.*"`

## epost_agent_kit Hook Architecture

```
packages/core/hooks/
├── session-init.cjs            # SessionStart: project detection, env vars, plan resolution
├── subagent-init.cjs           # SubagentStart: compact context injection to Task agents
├── context-reminder.cjs        # UserPromptSubmit: session context + rules (deduplicated)
├── scout-block.cjs             # PreToolUse: block node_modules/dist/.git per .epost-ignore
├── privacy-block.cjs           # PreToolUse: block .env/secrets unless APPROVED: prefix
├── subagent-stop-reminder.cjs  # SubagentStop: post-agent reminders (planner → /cook)
├── session-metrics.cjs         # Stop: record session duration/git stats → .epost-data/
├── lesson-capture.cjs          # Stop: evaluate significance, prompt knowledge capture
└── notifications/
    └── notify.cjs              # Stop: Discord/Telegram notification

packages/kit/hooks/
├── kit-session-check.cjs       # SessionStart: check skill-index.json staleness
├── kit-write-guard.cjs         # PreToolUse: block writes to .claude/ in kit-repo context
└── kit-post-edit-reminder.cjs  # PostToolUse: skill index + re-init + stale ref scan
```

Config files:
- `.epost-kit.json` — hook config (plan naming, project type, hook toggles, validation rules)
- `.epost-ignore` — scout-block patterns (gitignore-spec format)
