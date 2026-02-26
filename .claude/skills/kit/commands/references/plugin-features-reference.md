# Plugin Command Features Reference

## CLAUDE_PLUGIN_ROOT Variable

Plugin commands have access to `${CLAUDE_PLUGIN_ROOT}`, an environment variable that resolves to the plugin's absolute path.

**Common uses:**

```markdown
# Execute plugin script
!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/script.sh`

# Load plugin configuration
@${CLAUDE_PLUGIN_ROOT}/config/settings.json

# Use plugin template
@${CLAUDE_PLUGIN_ROOT}/templates/report.md

# Access plugin documentation
@${CLAUDE_PLUGIN_ROOT}/docs/reference.md
```

**Why use it:** Works across all installations, portable between systems, no hardcoded paths needed — essential for multi-file plugins.

---

## Plugin Command Organization

Plugin commands are discovered automatically from the `commands/` directory:

```
plugin-name/
├── commands/
│   ├── foo.md              # /foo
│   ├── bar.md              # /bar
│   └── utils/
│       └── helper.md       # /helper
└── package.yaml
```

**Naming conventions:**
- Use descriptive action names
- Avoid generic names (`test`, `run`)
- Use hyphens for multi-word names (`review-pr`, `fix-issue`)

---

## Plugin Command Patterns

### Configuration-Based Pattern

```markdown
---
description: Deploy using plugin configuration
argument-hint: [environment]
allowed-tools: Read, Bash(*)
---

Load configuration: @${CLAUDE_PLUGIN_ROOT}/config/$1-deploy.json

Deploy to $1 using configuration settings.
Monitor deployment and report status.
```

### Template-Based Pattern

```markdown
---
description: Generate docs from template
argument-hint: [component]
---

Template: @${CLAUDE_PLUGIN_ROOT}/templates/docs.md

Generate documentation for $1 following template structure.
```

### Multi-Script Pattern

```markdown
---
description: Complete build workflow
allowed-tools: Bash(*)
---

Build:   !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/build.sh`
Test:    !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/test.sh`
Package: !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/package.sh`

Review outputs and report workflow status.
```

---

## Integration with Plugin Components

### Agent Integration

Launch plugin agents for complex tasks:

```markdown
---
description: Deep code review
argument-hint: [file-path]
---

Initiate comprehensive review of @$1 using the code-reviewer agent.

The agent will analyze:
- Code structure and quality
- Security issues
- Performance
- Best practices

Agent uses plugin resources:
- ${CLAUDE_PLUGIN_ROOT}/config/rules.json
- ${CLAUDE_PLUGIN_ROOT}/checklists/review.md
```

Key points:
- Agent must exist in `plugin/agents/` directory
- Claude uses Task tool to launch the agent
- Document what agent capabilities are used
- Reference plugin resources the agent needs

### Skill Integration

Leverage plugin skills for specialized knowledge:

```markdown
---
description: Document API with standards
argument-hint: [api-file]
---

Document API in @$1 following plugin standards.

Use the api-docs-standards skill to ensure:
- Complete endpoint documentation
- Consistent formatting
- Example quality
- Error documentation

Generate production-ready API docs.
```

Key points:
- Skill must exist in `plugin/skills/` directory
- Mention skill name to trigger invocation
- Document what the skill provides to Claude

### Hook Coordination

Design commands that work with plugin hooks:
- Commands can prepare state for hooks to process
- Hooks execute automatically on tool events
- Commands should document expected hook behavior
- Guide Claude on interpreting hook output

### Multi-Component Workflow

Combine agents, skills, and scripts for complex tasks:

```markdown
---
description: Comprehensive review workflow
argument-hint: [file]
allowed-tools: Bash(node:*), Read
---

Target: @$1

Phase 1 - Static Analysis:
!`node ${CLAUDE_PLUGIN_ROOT}/scripts/lint.js $1`

Phase 2 - Deep Review:
Launch code-reviewer agent for detailed analysis.

Phase 3 - Standards Check:
Use coding-standards skill for validation.

Phase 4 - Report:
Template: @${CLAUDE_PLUGIN_ROOT}/templates/review.md

Compile findings into report following template.
```

---

## Validation Patterns

### Argument Validation

```markdown
---
argument-hint: [environment]
---

Validate environment: !`echo "$1" | grep -E "^(dev|staging|prod)$" || echo "INVALID"`

If $1 is a valid environment (dev, staging, or prod):
  Deploy to $1
Otherwise:
  Explain valid environments and show usage: /deploy [environment]
```

### File Existence Check

```markdown
---
argument-hint: [config-file]
---

Check file exists: !`test -f $1 && echo "EXISTS" || echo "MISSING"`

If file exists:
  Process configuration: @$1
Otherwise:
  Explain where to place the config file, show expected format, provide example.
```

### Plugin Resource Validation

```markdown
---
allowed-tools: Bash(test:*)
---

Validate plugin setup:
- Script: !`test -x ${CLAUDE_PLUGIN_ROOT}/bin/analyze && echo "✓" || echo "✗"`
- Config: !`test -f ${CLAUDE_PLUGIN_ROOT}/config.json && echo "✓" || echo "✗"`

If all checks pass, run analysis.
Otherwise, report missing components.
```

### Error Handling

```markdown
---
allowed-tools: Bash(*)
---

Execute build: !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/build.sh 2>&1 || echo "BUILD_FAILED"`

If build succeeded:
  Report success and output location.
If build failed:
  Analyze error output, suggest likely causes, provide troubleshooting steps.
```

**Best practices:**
- Validate early in the command
- Provide helpful, specific error messages
- Suggest corrective actions with examples
- Handle edge cases gracefully (missing args, missing files)
