# Command Structure Reference

## YAML Frontmatter Fields

### description

**Purpose:** Brief description shown in `/help`
**Type:** String
**Default:** First line of command prompt

```yaml
---
description: Review pull request for code quality
---
```

Best practice: Clear, actionable description (under 60 characters).

### allowed-tools

**Purpose:** Specify which tools the command can use
**Type:** String or Array
**Default:** Inherits from conversation

```yaml
---
allowed-tools: Read, Write, Edit, Bash(git:*)
---
```

Patterns:
- `Read, Write, Edit` — specific tools
- `Bash(git:*)` — Bash with git commands only
- `*` — all tools (rarely needed)

### model

**Purpose:** Specify model for command execution
**Type:** String (`sonnet`, `opus`, `haiku`)
**Default:** Inherits from conversation

```yaml
---
model: haiku
---
```

Use cases: `haiku` for fast simple commands, `sonnet` for standard workflows, `opus` for complex analysis.

### argument-hint

**Purpose:** Document expected arguments for autocomplete
**Type:** String
**Default:** None

```yaml
---
argument-hint: [pr-number] [priority] [assignee]
---
```

### agent (optional)

**Purpose:** Route command to a specific agent for execution
**Type:** String (agent name)
**Default:** None (command runs in current context)

```yaml
---
agent: epost-implementer
---
```

**Important:** Most commands do NOT need `agent:` in frontmatter. Only use when direct routing to a specific agent is required. Commands backed by a skill (using `context: fork` + `agent:` in the skill) or intent-routed commands are handled automatically.

### disable-model-invocation

**Purpose:** Prevent SlashCommand tool from programmatically calling command
**Type:** Boolean
**Default:** false

```yaml
---
disable-model-invocation: true
---
```

Use when the command should only be manually invoked.

---

## Dynamic Arguments

### $ARGUMENTS — All Arguments as One String

```markdown
---
argument-hint: [issue-number]
---

Fix issue #$ARGUMENTS following our coding standards.
```

Usage: `/fix-issue 123` → expands to `Fix issue #123 following our coding standards.`

### Positional Arguments — $1, $2, $3

```markdown
---
argument-hint: [pr-number] [priority] [assignee]
---

Review pull request #$1 with priority level $2.
After review, assign to $3 for follow-up.
```

Usage: `/review-pr 123 high alice` → expands all three placeholders.

### Combining Positional and Remaining

```markdown
Deploy $1 to $2 environment with options: $3
```

Usage: `/deploy api staging --force --skip-tests`

---

## File References

### @ Syntax

```markdown
---
argument-hint: [file-path]
---

Review @$1 for code quality, best practices, and potential bugs.
```

Effect: Claude reads the file before processing the command.

### Multiple Files

```markdown
Compare @src/old-version.js with @src/new-version.js

Identify:
- Breaking changes
- New features
- Bug fixes
```

### Static References

```markdown
Review @package.json and @tsconfig.json for consistency
```

---

## Bash Execution in Commands

Commands can execute bash commands inline to dynamically gather context.

**Syntax:** Wrap command in backticks with `!` prefix:

```markdown
Current branch: !`git branch --show-current`
Changed files: !`git diff --name-only HEAD`
```

**Using with allowed-tools:**

```markdown
---
allowed-tools: Bash(git:*)
---

Files changed: !`git diff --name-only`

Review each file for code quality and best practices.
```

**Environment access:**

```markdown
---
allowed-tools: Bash(env:*)
---

Environment: !`echo $NODE_ENV`
Version: !`node --version`
```

**Combining bash context with instructions:**

```markdown
---
allowed-tools: Bash(git:*), Read
---

PR changes: !`gh pr diff $1`
PR info: !`gh pr view $1 --json title,body`

Review these changes for code quality, security, and test coverage.
```

---

## Common Command Patterns

### Review Pattern

```markdown
---
description: Review code changes
allowed-tools: Read, Bash(git:*)
---

Files changed: !`git diff --name-only`

Review each file for:
1. Code quality and style
2. Potential bugs or issues
3. Test coverage
4. Documentation needs

Provide specific feedback for each file.
```

### Testing Pattern

```markdown
---
description: Run tests for specific file
argument-hint: [test-file]
allowed-tools: Bash(npm:*)
---

Run tests: !`npm test $1`

Analyze results and suggest fixes for failures.
```

### Documentation Pattern

```markdown
---
description: Generate documentation for file
argument-hint: [source-file]
---

Generate comprehensive documentation for @$1 including:
- Function/class descriptions
- Parameter documentation
- Return value descriptions
- Usage examples
- Edge cases and errors
```

### Workflow Pattern

```markdown
---
description: Complete PR workflow
argument-hint: [pr-number]
allowed-tools: Bash(gh:*), Read
---

PR #$1 Workflow:

1. Fetch PR: !`gh pr view $1`
2. Review changes
3. Run checks
4. Approve or request changes
```

---

## Troubleshooting

**Command not appearing:**
- Check file is in correct directory
- Verify `.md` extension is present
- Ensure valid Markdown format
- Restart Claude Code

**Arguments not working:**
- Verify `$1`, `$2` syntax is correct
- Check `argument-hint` matches usage
- Ensure no extra spaces around `$1`

**Bash execution failing:**
- Check `allowed-tools` includes Bash
- Verify command syntax with backticks
- Test command in terminal first
- Check for required permissions

**File references not working:**
- Verify `@` syntax is correct
- Check file path is valid
- Ensure Read tool is allowed
- Use absolute or project-relative paths
