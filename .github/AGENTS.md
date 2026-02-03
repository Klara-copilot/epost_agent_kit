# GitHub Copilot Agents - ePost iOS Workspace

**Last Updated**: 2026-02-03
**Location**: All agents consolidated in `.github/agents/`

---

## Available Agents

### iOS Development

#### @ios-developer
**Purpose**: General iOS development guidance for the ePost workspace

**Use When**:
- Building features for luz_epost_ios
- Working with Swift/UIKit code
- Integrating SDKs
- Following workspace architectural patterns

**Knowledge**: Workspace structure, theme system, SDK integration patterns

**Example**:
```
@ios-developer How should I structure a new feature screen in luz_epost_ios?
```

---

### Accessibility

#### @accessibility-architect
**Purpose**: Real-time accessibility guidance during Swift development

**Use When**:
- Writing new UI code
- Need proactive WCAG 2.1 AA compliance guidance
- Want to prevent accessibility issues before they enter codebase

**Knowledge**:
- `.ai-agents/rules/accessibility/` (8 WCAG rules)
- `.ai-agents/prompts/accessibility/` (Reusable prompts)
- `.ai-agents/analysis/accessibility/` (Common issues)

**Example**:
```
@accessibility-architect I'm creating a custom button. What accessibility properties should I add?
```

---

#### @accessibility-auditor
**Purpose**: Batch accessibility auditing for CI/CD pipelines

**Use When**:
- Running pre-commit accessibility checks
- Auditing code diffs or full files
- Generating JSON violation reports

**Knowledge**:
- `.ai-agents/rules/accessibility/` (Detection criteria)
- `.agent-knowledge/epost-known-findings.json` (Known issues)

**Output**: Structured JSON reports with violation details

**Example**:
```
@accessibility-auditor Audit the changes in LetterBoxVC.swift and produce a JSON report
```

---

#### @accessibility-fixer
**Purpose**: Surgical fixes for specific accessibility findings

**Use When**:
- Fixing known issues from findings database
- Applying targeted fixes without refactoring

**Knowledge**:
- `.agent-knowledge/epost-known-findings.json` (All documented findings)
- `.ai-agents/prompts/accessibility/` (Fix templates)

**Example**:
```
@accessibility-fixer Fix finding #42 (missing accessibilityLabel in DocumentCell)
```

---

### Design System

#### @figma-component-inspector
**Purpose**: Inspect Figma designs and extract component specifications

**Use When**:
- Implementing designs from Figma
- Need component specs (colors, spacing, typography)

**Knowledge**: epost-ios-theme-ui design system patterns

**Example**:
```
@figma-component-inspector Extract button styles from [Figma URL]
```

---

#### @component-doc-writer
**Purpose**: Generate documentation for theme components

**Use When**:
- Documenting new theme components
- Creating usage examples
- Updating component READMEs

**Knowledge**: Theme system structure, documentation standards

**Example**:
```
@component-doc-writer Document the new LetterCard component in epost-ios-theme-ui
```

---

## Knowledge Bases

Agents have access to centralized knowledge:

### .ai-agents/
Contains accessibility rules, prompts, and analysis:
- `rules/accessibility/` - 8 WCAG 2.1 AA rules for iOS (a11y-core, a11y-buttons, a11y-forms, a11y-headings, a11y-focus, a11y-images, a11y-colors-contrast, a11y-testing)
- `prompts/accessibility/` - Reusable prompt templates
- `analysis/accessibility/` - Common issues and solutions
- `rules/` - General workspace rules
- `QUICKSTART.md`, `README.md`, `SUMMARY.md`

### .agent-knowledge/
Contains structured data:
- `epost-known-findings.json` - Documented accessibility issues (6KB)

---

## Usage Guidelines

### Invoking Agents

Use `@agent-name` syntax in GitHub Copilot Chat:
```
@accessibility-architect [your question or task]
```

### Agent Selection

| Task | Recommended Agent |
|------|-------------------|
| Prevent accessibility issues | `@accessibility-architect` |
| Audit code for violations | `@accessibility-auditor` |
| Fix known accessibility issues | `@accessibility-fixer` |
| Implement Figma designs | `@figma-component-inspector` |
| Document components | `@component-doc-writer` |
| General iOS development | `@ios-developer` |

### Best Practices

1. **Be Specific**: Provide context and file paths when asking questions
2. **Use Knowledge Bases**: Agents leverage workspace knowledge automatically
3. **Combine Agents**: Use architect for prevention, auditor for detection, fixer for remediation
4. **Check Agent Knowledge**: Refer to knowledge base directories for detailed rules

---

## Accessibility Workflow

### During Development
1. **Design Phase**: Consult `@accessibility-architect` for guidance
2. **Implementation**: Include accessibility from the start
3. **Testing**: Test with VoiceOver before committing

### During Code Review
1. **Audit Changes**: Run `@accessibility-auditor` on Swift file diffs
2. **Review JSON Report**: Check for critical violations (block PR if found)
3. **Fix Issues**: Use `@accessibility-fixer` for known patterns

### CI/CD Integration
1. **Pre-commit Hook**: Auto-audit staged Swift files
2. **GitHub Actions**: Audit all PR changes
3. **Block Merges**: If critical violations detected

---

## Migration History

**Date**: 2026-02-03
**Migration**: Consolidated agents from module directories to workspace root

**Before**:
- luz_epost_ios/.github/agents/ (3 agents)
- epost-ios-theme-ui/.github/agents/ (2 agents)
- .github/agents/ (1 agent)

**After**:
- All 6 agents in `.github/agents/`
- Workspace-wide accessibility via `@agent-name`

**Breaking Changes**:
- Renamed `@accessibilities-*` to `@accessibility-*` (singular form)
- Old agent references will not work

---

## Troubleshooting

### Agent Not Found
- Verify agent exists: `ls .github/agents/*.agent.md`
- Check agent name in frontmatter matches invocation
- Restart VSCode/IDE if recently added

### Knowledge Base Access Issues
- Verify paths: `ls .ai-agents/` and `ls .agent-knowledge/`
- Check agent file references use correct relative paths
- See test-path-resolution.agent.md for debugging (if exists)

### Agent Not Responding
- Check GitHub Copilot is enabled
- Verify you're in the workspace root directory
- Check copilot-instructions.md is not conflicting

---

## Contributing

### Adding New Agents

1. Create file: `.github/agents/agent-name.agent.md`
2. Add YAML frontmatter:
   ```yaml
   ---
   name: agent-name
   description: Brief description
   ---
   ```
3. Document in this file (AGENTS.md)
4. Test with `@agent-name` invocation

### Updating Knowledge Bases

- Add rules to `.ai-agents/rules/`
- Add prompts to `.ai-agents/prompts/`
- Add findings to `.agent-knowledge/epost-known-findings.json`
- Update agent documentation if needed

---

## Standards & Compliance

This workspace follows:
- **WCAG 2.1 Level AA** - Web Content Accessibility Guidelines
- **iOS Accessibility Guidelines** - Apple's accessibility standards
- **VPAT Compliance** - Voluntary Product Accessibility Template

All code must meet these standards before merging.

---

**Created by**: Phuong Doan
**Workspace Documentation**: See `CLAUDE.md` for comprehensive project details
**Copilot Instructions**: See `.github/copilot-instructions.md`
