# AI Agents Configuration Summary

## Agent IDs (Cursor)

All agents use the `accessibilities-` prefix:

- **@accessibilities-architect** - Real-time accessibility guidance
- **@accessibilities-auditor** - Batch accessibility auditing
- **@accessibilities-fixer** - Surgical accessibility fixes

## Knowledge Base Structure

### Primary Location: `.ai-agents/`
- **Rules**: `.ai-agents/rules/accessibility/a11y-*.md` (8 files)
- **Prompts**: `.ai-agents/prompts/accessibility/*.txt` (7 files)
- **Analysis**: `.ai-agents/analysis/accessibility/*.md`


### Additional Knowledge
- **Known Findings**: `.agent-knowledge/epost-known-findings.json`
- **General Rules**: `.cursor/rules/*.mdc` (core-user-rules, decision-boundaries, environment-safety, documentation-behavior, context7-usage)

## Agent Configuration

### Cursor (`.cursor/agents.json`)
- All agents configured with `accessibilities-` prefix
- Knowledge files reference `.ai-agents/` only
- System prompts located in `.cursor/agents/accessibilities/`


## Usage Examples

### Cursor
```
@accessibilities-architect Review this button for accessibility
@accessibilities-auditor Audit all changed Swift files
@accessibilities-fixer Fix finding ID 3
```

### GitHub Copilot
```
@accessibilities-architect Please review this button implementation
@accessibilities-auditor Please audit all changed Swift files
@accessibilities-fixer Please fix finding ID 3
```

## File Counts

- **Rules**: 8 accessibility rule files
- **Prompts**: 7 prompt template files
- **Analysis**: 1 analysis document
- **Documentation**: README.md, QUICKSTART.md, MIGRATION.md, SUMMARY.md

## Status

✅ All agent configs updated with `accessibilities-` prefix  
✅ Knowledge base unified in `.ai-agents/`  
✅ System prompts reference all locations  
✅ Documentation updated  
✅ Backward compatibility maintained

