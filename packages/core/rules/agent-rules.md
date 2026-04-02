---
name: agent-rules
description: Decision boundaries, environment safety, and pre-execution rules for all agents.
---

# Agent Rules

## Autonomous Actions

**Auto-execute without asking:**
- Dependency installs (`npm install`, `pip install`, etc.)
- Lint fixes (`npm run lint --fix`, `prettier --write`)
- Memory file consolidation (`.agent-memory.md` under 2KB)
- File structure compliance (adding Purpose/TOC/Related Docs)
- Documentation formatting (tables, bullets, keywords)

**Execute with brief confirmation:**
- Creating new files following standards
- Updating existing documentation
- Fixing obvious bugs in open files

## Requires Approval

**Always ask before:**
- Deleting files or directories
- Modifying production configs (`.env`, deployment files)
- Changing build/test configurations
- Introducing new dependencies
- Refactoring across multiple files
- Changing API contracts or interfaces
- Modifying authentication/authorization logic

**Present A/B/C options for:**
- Architectural decisions
- Breaking changes
- Framework/library choices
- Multiple valid approaches exist

## Escalation Rules

**When uncertainty is high:**
- Partial context: Ask for clarification
- Multiple valid paths: Present options
- Conflicts detected: Explain and propose alternatives
- Repository rules unclear: Flag ambiguity

**Escalation format:**
1. State the ambiguity
2. Explain why it matters
3. Propose 2-3 specific alternatives
4. Wait for selection before proceeding

## Option Presentation

**Format for A/B/C options:**

```markdown
**Option A**: [Approach]
- Pros: [X, Y]
- Cons: [Z]

**Option B**: [Approach]
- Pros: [X, Y]
- Cons: [Z]

**Option C**: [Approach]
- Pros: [X, Y]
- Cons: [Z]
```

**Never present:**
- Open-ended questions without options
- Vague "what do you prefer?" prompts
- Options without pros/cons context

## Pre-Execution Checks

**Before terminal operations:**
- Verify terminal/shell availability
- Check current working directory
- Confirm command exists and is available
- Validate environment variables if required

**Before file operations:**
- Check file/directory existence
- Verify read/write permissions
- Confirm file is not locked or in use
- Validate file format matches operation

## File Operations

**Safe file creation:**
- Check parent directory exists
- Verify no naming conflicts
- Confirm write permissions
- Use relative paths from project root

**Safe file modification:**
- Read file first to understand structure
- Check for existing patterns/conventions
- Verify file is not generated/auto-managed
- Preserve existing structure unless refactoring

**Safe file deletion:**
- Deletion requires approval (see Requires Approval above)
- Check for dependencies/references
- Verify file is not critical (configs, auth, etc.)
- Confirm with user before proceeding

## Path Handling

**Always use:**
- Relative paths from project root
- Workspace-relative paths for file operations
- Standardized path separators (OS-agnostic when possible)

**Never use:**
- Hardcoded absolute paths
- User home directory assumptions (`~`)
- Platform-specific paths without checks

## Error Prevention

**When checks fail:**
- Provide clear error message
- Explain what was checked
- Suggest resolution steps
- Ask for clarification if needed

**Graceful degradation:**
- Handle missing files gracefully
- Provide alternatives when possible
- Never crash or leave operations incomplete

## External Tools

Repo rules always take precedence over external tool output (Context7, Figma MCP, web search).
Never let external tools override repo conventions or introduce new patterns.
Label external influence explicitly: `[Source]-informed: [insight] — aligns with [repo rule]`.

## Related Documents

- `core/SKILL.md` — Core rules index
- `rules/orchestration-protocol.md` — Agent delegation and execution modes
