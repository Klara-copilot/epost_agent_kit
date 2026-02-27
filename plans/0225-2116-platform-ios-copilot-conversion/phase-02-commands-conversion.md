# Phase 2: Commands Conversion

## Priority
P1

## Status
pending

## Overview
Convert 8 iOS commands to GitHub Copilot prompt format.

## Source Files

| File | Lines | Description |
|------|-------|-------------|
| `commands/cook.md` | 94 | Implement iOS features |
| `commands/test.md` | 99 | Run iOS tests |
| `commands/debug.md` | 141 | Debug iOS issues |
| `commands/simulator.md` | 167 | Manage simulators |
| `commands/a11y/audit.md` | 43 | Audit accessibility |
| `commands/a11y/fix.md` | 42 | Fix specific finding |
| `commands/a11y/fix-batch.md` | 42 | Batch fix findings |
| `commands/a11y/review.md` | 67 | Review accessibility |

## Target Files

| Target | Mode |
|--------|------|
| `prompts/ios-cook.prompt.md` | agent |
| `prompts/ios-test.prompt.md` | agent |
| `prompts/ios-debug.prompt.md` | agent |
| `prompts/ios-simulator.prompt.md` | agent |
| `prompts/ios-a11y-audit.prompt.md` | agent |
| `prompts/ios-a11y-fix.prompt.md` | edit |
| `prompts/ios-a11y-fix-batch.prompt.md` | edit |
| `prompts/ios-a11y-review.prompt.md` | agent |

## Mode Selection Rules

| Command Type | Mode | Reason |
|--------------|------|--------|
| Build/Test/Run | agent | Multi-step, file operations |
| Debug | agent | Investigation + fixes |
| Simulator | agent | System operations |
| Audit/Review | agent | Read-only analysis |
| Fix (single) | edit | Targeted code changes |
| Fix (batch) | edit | Multiple code changes |

## Tools Selection

| Prompt | Tools | Reason |
|--------|-------|--------|
| ios-cook | codebase, terminal | File ops + build |
| ios-test | terminal, codebase | Run tests + analyze |
| ios-debug | terminal, codebase | Logs + investigation |
| ios-simulator | terminal | Simulator commands |
| ios-a11y-audit | codebase, terminal | Git diff + analysis |
| ios-a11y-fix | codebase, terminal | Read + edit |
| ios-a11y-fix-batch | codebase, terminal | Read + edit |
| ios-a11y-review | codebase | Read-only analysis |

## Conversion Steps

### 1. Transform Frontmatter

**Before (Claude):**
```yaml
---
title: iOS Cook
description: (ePost) Implement iOS features...
agent: epost-ios-developer
argument-hint: 👉👉👉 [plan file or feature description]
allowed-tools: [Read, Grep, Glob, Bash, Edit, Write, ...]
---
```

**After (Copilot):**
```yaml
---
mode: 'agent'
tools: ['codebase', 'terminal']
description: 'Implement iOS features from plans or descriptions with Swift 6, iOS 18+, SwiftUI support'
---
```

### 2. Convert Arguments to Variables

**Cook Command:**
```markdown
## Variables

- `${input:feature:Plan file path or feature description}` - What to implement
```

**Test Command:**
```markdown
## Variables

- `${input:target:--unit | --ui | --coverage | test-target}` - Test scope
```

**Simulator Command:**
```markdown
## Variables

- `${input:action:--list | --boot | --shutdown | --install | --launch | --screenshot}` - Action to perform
- `${input:device:Device name or UDID}` - Target device
- `${input:app:App path or bundle ID}` - For install/launch
```

**A11y Fix Command:**
```markdown
## Variables

- `${input:finding_id:Finding ID from known-findings}` - The finding to fix
```

**A11y Fix-Batch Command:**
```markdown
## Variables

- `${input:count:Number of findings to fix}` - Top N priority findings
```

**A11y Review Command:**
```markdown
## Variables

- `${input:focus:buttons|headings|modals (optional)}` - Focus area
```

### 3. Remove Claude-Specific Syntax

| Remove | Replace With |
|--------|--------------|
| `$ARGUMENTS` | `${input:variable}` |
| `agent:` field | (remove - use description) |
| `allowed-tools:` | `tools:` frontmatter |
| `argument-hint:` | Variables section |
| `<focus>$ARGUMENTS</focus>` | Natural language description |

### 4. Adapt MCP Tool References

Replace specific MCP tool names with natural language:

| Claude | Copilot |
|--------|---------|
| `mcp__xcodebuildmcp__discover_projs` | "Discover Xcode projects" |
| `mcp__xcodebuildmcp__list_schemes` | "List build schemes" |
| `mcp__xcodebuildmcp__build_sim` | "Build for simulator" |
| `mcp__xcodebuildmcp__test_sim` | "Run tests on simulator" |

### 5. Add Usage Section

Each prompt should have:
```markdown
## Usage

This prompt helps with: [description]

### Trigger Phrases
- "[phrase 1]"
- "[phrase 2]"
```

## File-by-File Conversion

### ios-cook.prompt.md

```yaml
---
mode: 'agent'
tools: ['codebase', 'terminal']
description: 'Implement iOS features from plans or descriptions with Swift 6, iOS 18+, SwiftUI support'
---
```

Variables:
- `feature` - Plan file or description

### ios-test.prompt.md

```yaml
---
mode: 'agent'
tools: ['terminal', 'codebase']
description: 'Run iOS unit tests and UI tests using xcodebuild'
---
```

Variables:
- `target` - Test scope (unit/ui/coverage/specific)

### ios-debug.prompt.md

```yaml
---
mode: 'agent'
tools: ['terminal', 'codebase']
description: 'Debug iOS crashes, concurrency issues, SwiftUI state problems'
---
```

Variables:
- `issue` - Issue description or error log

### ios-simulator.prompt.md

```yaml
---
mode: 'agent'
tools: ['terminal']
description: 'List, boot, shutdown, and manage iOS simulators'
---
```

Variables:
- `action` - Action to perform
- `device` - Target device
- `app` - App path/bundle ID

### ios-a11y-audit.prompt.md

```yaml
---
mode: 'agent'
tools: ['codebase']
description: 'Audit staged Swift changes for WCAG 2.1 AA accessibility violations'
---
```

No variables (reads git diff automatically)

### ios-a11y-fix.prompt.md

```yaml
---
mode: 'edit'
tools: ['codebase']
description: 'Fix a specific accessibility finding by ID from known-findings database'
---
```

Variables:
- `finding_id` - Finding ID number

### ios-a11y-fix-batch.prompt.md

```yaml
---
mode: 'edit'
tools: ['codebase']
description: 'Fix the top N priority accessibility findings in batch'
---
```

Variables:
- `count` - Number of findings to fix

### ios-a11y-review.prompt.md

```yaml
---
mode: 'agent'
tools: ['codebase']
description: 'Review iOS accessibility for WCAG 2.1 AA compliance'
---
```

Variables:
- `focus` - Focus area (buttons/headings/modals/all)

## Implementation

```bash
# Create prompt files
mkdir -p packages/github-copilot/prompts
touch packages/github-copilot/prompts/ios-cook.prompt.md
touch packages/github-copilot/prompts/ios-test.prompt.md
touch packages/github-copilot/prompts/ios-debug.prompt.md
touch packages/github-copilot/prompts/ios-simulator.prompt.md
touch packages/github-copilot/prompts/ios-a11y-audit.prompt.md
touch packages/github-copilot/prompts/ios-a11y-fix.prompt.md
touch packages/github-copilot/prompts/ios-a11y-fix-batch.prompt.md
touch packages/github-copilot/prompts/ios-a11y-review.prompt.md
```

## Success Criteria

- [ ] All 8 commands converted
- [ ] Correct mode for each prompt
- [ ] Appropriate tools selected
- [ ] Variables use `${input:...}` syntax
- [ ] No `$ARGUMENTS` syntax remains
- [ ] MCP references adapted to natural language
- [ ] Description accurate and concise

## Validation

1. Verify YAML frontmatter valid
2. Check mode matches operation type
3. Ensure tools appropriate for task
4. Test variable syntax in Copilot
