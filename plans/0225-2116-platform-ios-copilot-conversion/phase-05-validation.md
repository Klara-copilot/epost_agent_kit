# Phase 5: Validation & Testing

## Priority
P1

## Status
pending

## Overview
Validate all converted files and test in GitHub Copilot environment.

## Validation Checklist

### Structure Validation

- [ ] All directories created correctly
- [ ] All files have correct extensions
- [ ] No duplicate files
- [ ] No missing files

### Frontmatter Validation

| File Type | Required Fields | Forbidden Fields |
|-----------|-----------------|------------------|
| `.instructions.md` | `applyTo`, `description` | `tools`, `model`, `color` |
| `.prompt.md` | `mode`, `tools`, `description` | `agent`, `allowed-tools` |
| `copilot-instructions.md` | (none - plain MD) | YAML frontmatter |

### Content Validation

- [ ] No `$ARGUMENTS` syntax in prompts
- [ ] No `mcp__` tool references (adapted to natural language)
- [ ] No `.claude/` paths
- [ ] No `/command` syntax in snippet
- [ ] All code examples intact
- [ ] All sections preserved

## File Inventory

### Instructions (5 files)

| File | applyTo | Source |
|------|---------|--------|
| `epost-ios-developer.instructions.md` | `"**/*.swift"` | Agent |
| `ios-development.instructions.md` | `"**/*.swift"` | Skill + refs |
| `ios-accessibility.instructions.md` | `"**/*.swift"` | Skill + refs |
| `ios-ui-lib.instructions.md` | `"**/*.swift"` | Skill + refs |
| `ios-rag.instructions.md` | `"**/*"` | Skill |

### Prompts (8 files)

| File | Mode | Tools |
|------|------|-------|
| `ios-cook.prompt.md` | agent | codebase, terminal |
| `ios-test.prompt.md` | agent | terminal, codebase |
| `ios-debug.prompt.md` | agent | terminal, codebase |
| `ios-simulator.prompt.md` | agent | terminal |
| `ios-a11y-audit.prompt.md` | agent | codebase |
| `ios-a11y-fix.prompt.md` | edit | codebase |
| `ios-a11y-fix-batch.prompt.md` | edit | codebase |
| `ios-a11y-review.prompt.md` | agent | codebase |

### Global (1 file)

| File | Format |
|------|--------|
| `copilot-instructions.md` | Plain Markdown |

## Testing Plan

### 1. YAML Syntax Check

```bash
# Check all frontmatter is valid YAML
for f in packages/github-copilot/instructions/*.instructions.md; do
  echo "Checking $f"
  head -10 "$f" | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin.read().split('---')[1])"
done

for f in packages/github-copilot/prompts/*.prompt.md; do
  echo "Checking $f"
  head -10 "$f" | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin.read().split('---')[1])"
done
```

### 2. No Frontmatter Check (copilot-instructions.md)

```bash
# Verify copilot-instructions.md has NO frontmatter
head -1 packages/github-copilot/copilot-instructions.md | grep -v "^---"
```

### 3. Content Preservation Check

```bash
# Verify no Claude-specific syntax remains
grep -r "\$ARGUMENTS" packages/github-copilot/ && echo "FAIL: \$ARGUMENTS found" || echo "PASS"
grep -r "mcp__" packages/github-copilot/ && echo "FAIL: mcp__ found" || echo "PASS"
grep -r "\.claude/" packages/github-copilot/ && echo "FAIL: .claude/ found" || echo "PASS"
grep -r "^/ios:" packages/github-copilot/ && echo "FAIL: /ios: commands found" || echo "PASS"
```

### 4. Variable Syntax Check

```bash
# Verify prompts use correct variable syntax
grep -r "\${input:" packages/github-copilot/prompts/ && echo "PASS: Variables found" || echo "WARN: No variables"
```

### 5. applyTo Pattern Check

```bash
# Verify all instructions have applyTo
for f in packages/github-copilot/instructions/*.instructions.md; do
  grep -q "applyTo:" "$f" && echo "PASS: $f" || echo "FAIL: $f missing applyTo"
done
```

## Manual Testing

### VS Code Testing

1. Open VS Code with GitHub Copilot Chat
2. Open a `.swift` file
3. Verify instructions apply automatically
4. Test trigger phrases:
   - "implement iOS feature"
   - "run iOS tests"
   - "audit accessibility"

### Prompt Testing

1. Open GitHub Copilot Chat
2. Use `@workspace` with prompts:
   - Test `ios-cook` prompt
   - Test `ios-test` prompt
   - Test `ios-a11y-audit` prompt

## Success Criteria

### Structure
- [ ] 5 instruction files created
- [ ] 8 prompt files created
- [ ] 1 copilot-instructions.md created
- [ ] Total: 14 files

### Format
- [ ] All instructions have valid YAML frontmatter
- [ ] copilot-instructions.md has NO frontmatter
- [ ] All prompts have mode and tools

### Content
- [ ] No Claude-specific syntax
- [ ] No MCP tool references
- [ ] Variables use `${input:...}` syntax
- [ ] applyTo patterns correct

### Functionality
- [ ] Instructions apply to Swift files
- [ ] Prompts accessible in Copilot Chat
- [ ] Trigger phrases work

## Rollback Plan

If issues found:
1. Keep original `packages/platform-ios/` intact
2. Fix issues in `packages/github-copilot/`
3. Re-run validation

## Final Deliverable

After validation passes:
1. Update `COPILOT.snippet.md` with new content
2. Update `package.yaml` with file inventory
3. Create summary report

## Report Template

```markdown
# iOS Platform Copilot Conversion - Complete

## Summary
- Files converted: 31
- Instructions created: 5
- Prompts created: 8
- Global instructions: 1

## Validation Results
- YAML syntax: PASS
- Content preservation: PASS
- No Claude syntax: PASS
- Variable syntax: PASS
- applyTo patterns: PASS

## Manual Testing
- VS Code instruction application: PASS
- Prompt accessibility: PASS
- Trigger phrases: PASS

## Issues Found
[None or list]

## Next Steps
- [ ] Merge to main branch
- [ ] Update documentation
- [ ] Announce availability
```
