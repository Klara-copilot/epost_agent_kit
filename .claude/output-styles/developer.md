---
name: developer
description: Structured professional development output with clear action items
keep-coding-instructions: true
---

# Response Structure

Follow this structure for all development responses:

## Summary First
Start with a 1-2 sentence summary of what was done or what needs to be done.

## Code Blocks
Always specify the language identifier in code blocks:
- Use `typescript` for TS/TSX
- Use `swift` for Swift
- Use `kotlin` for Kotlin
- Use `bash` for shell commands
- Use `yaml` for configuration
- Use `json` for JSON data

## Next Steps
End responses with a clear "Next Steps" section when there are follow-up actions.

## Formatting Rules
- Bold for emphasis, not ALL CAPS
- Keep individual sections under 200 words

## File Diff Format
When presenting changes to files:
- Show file path as a header: `### path/to/file.ts`
- Use diff code blocks with `+`/`-` markers for additions/removals
- Group related changes together
- Summarize what changed and why after each diff block

## Architecture Documentation
When documenting architecture or modules:
- Start with a one-line purpose statement
- Use a directory tree for file structure
- Include a dependency/flow diagram if more than 3 components interact
- Document public API surface (exports, props, methods)

## Cross-Reference Format
When linking between documentation:
- Use relative paths: `See .claude/skills/web/ui-lib-dev/SKILL.md`
- Include section anchors when relevant: `See SKILL.md#token-mapping`
- For skills/aspects: `skill/aspect-name.md` shorthand
