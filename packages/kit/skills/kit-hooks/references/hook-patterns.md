# Hook Development Patterns

## Common Patterns

### 1. Path Blocking (PreToolUse)

Block access to sensitive or noisy directories:

```javascript
#!/usr/bin/env node
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const toolInput = input.tool_input || {};
const filePath = toolInput.file_path || toolInput.command || '';

const BLOCKED = ['node_modules', 'dist', '.git', 'DerivedData'];
const blocked = BLOCKED.some(p => filePath.includes(p));

if (blocked) {
  process.stderr.write(JSON.stringify({
    hookSpecificOutput: { permissionDecision: 'deny' },
    systemMessage: `Blocked: path contains restricted directory`
  }));
  process.exit(2);
}
```

### 2. Context Injection (UserPromptSubmit)

Inject project context on every prompt:

```javascript
#!/usr/bin/env node
const fs = require('fs');
const context = [];

// Add session info
context.push(`Project: ${process.env.PROJECT_TYPE || 'unknown'}`);

// Add active plan context
const planDir = '.claude/plans';
if (fs.existsSync(planDir)) {
  const plans = fs.readdirSync(planDir).filter(f => f.endsWith('.md'));
  if (plans.length > 0) context.push(`Active plans: ${plans.join(', ')}`);
}

console.log(JSON.stringify({ systemMessage: context.join('\n') }));
```

### 3. Project Detection (SessionStart)

Detect project type and set environment:

```javascript
#!/usr/bin/env node
const fs = require('fs');
const envFile = process.env.CLAUDE_ENV_FILE;
const cwd = process.cwd();

let projectType = 'unknown';
if (fs.existsSync(`${cwd}/package.json`)) projectType = 'node';
else if (fs.existsSync(`${cwd}/pom.xml`)) projectType = 'maven';
else if (fs.existsSync(`${cwd}/Package.swift`)) projectType = 'swift';

if (envFile) {
  fs.appendFileSync(envFile, `export PROJECT_TYPE=${projectType}\n`);
}

console.log(JSON.stringify({
  systemMessage: `Project detected: ${projectType}`
}));
```

### 4. Completeness Check (Stop)

Verify tasks are complete before stopping:

```json
{
  "type": "prompt",
  "prompt": "Verify all requested tasks are complete. Check: tests run, build succeeded, questions answered. Return 'approve' to stop or 'block' with reason to continue."
}
```

### 5. Privacy Protection (PreToolUse)

Block access to secrets without explicit consent:

```javascript
#!/usr/bin/env node
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const filePath = (input.tool_input?.file_path || '').toLowerCase();

const SENSITIVE = ['.env', 'credentials', 'secrets', '.key', '.pem'];
const isSensitive = SENSITIVE.some(p => filePath.includes(p));

if (isSensitive) {
  process.stderr.write(JSON.stringify({
    hookSpecificOutput: { permissionDecision: 'ask' },
    systemMessage: `File may contain secrets. Ask user for permission.`
  }));
  process.exit(2);
}
```

## Testing Hooks

### Test Locally

Pipe sample JSON to hook script:

```bash
echo '{"tool_name":"Read","tool_input":{"file_path":"node_modules/foo"}}' | \
  node .claude/hooks/scout-block.cjs
echo "Exit code: $?"
```

### Debug Mode

Run Claude Code with debug logging:

```bash
claude --debug
```

Look for hook registration, execution timing, and input/output in logs.

### Validate JSON Output

```bash
output=$(echo '{"tool_name":"Write"}' | node my-hook.cjs)
echo "$output" | jq .
```

## Security Best Practices

1. **Always validate input** — parse JSON safely, check field existence
2. **Quote all variables** in bash hooks — prevent injection
3. **Set timeouts** — default 60s for command, 30s for prompt
4. **Use `set -euo pipefail`** in bash hooks
5. **Never log secrets** — sanitize output
6. **Design for independence** — hooks run in parallel, don't depend on each other's output

## .ck.json Configuration

The `.ck.json` file provides hook configuration:

```json
{
  "project": {
    "name": "epost_agent_kit",
    "type": "single-repo"
  },
  "plans": {
    "naming": "{date}-{slug}",
    "directory": "plans"
  },
  "hooks": {
    "devRulesReminder": {
      "dedup": true,
      "maxTokens": 500
    }
  }
}
```

Hooks read this via `require('./.claude/.ck.json')` or a utility library.

## .ckignore Patterns

Gitignore-spec file for scout-block:

```
# Dependencies
node_modules/
.pnpm-store/

# Build output
dist/
build/
.next/

# Platform artifacts
DerivedData/
Pods/
.gradle/

# VCS
.git/

# Coverage
coverage/
.nyc_output/
```

## Hook Lifecycle

1. Hooks load at session start — changes require restart
2. All matching hooks for an event run in parallel
3. If any hook denies (exit 2), the action is blocked
4. `systemMessage` from hooks is injected into Claude's context
5. `$CLAUDE_ENV_FILE` persists env vars (SessionStart only)
