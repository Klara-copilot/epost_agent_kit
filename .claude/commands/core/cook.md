---
title: Cook Command
description: (ePost) ⭑.ᐟ Implement features from plans or descriptions
agent: epost-implementer
argument-hint: ✨ [feature description or path/to/plan.md]
---

# Cook Command

Implement features - the main development command.

## Usage

```
/cook [feature description]
/cook plans/[plan-file].md
/cook --style [concise|standard|verbose] [description]
```

### Output Style Flag

Control verbosity of agent reports:

- `--style concise` - Minimal output (bullet points only, no explanations)
- `--style standard` - Default balanced output (current behavior)
- `--style verbose` - Detailed output (full context, reasoning, alternatives)

**Example**:
```
/cook --style concise implement login feature
/cook --style verbose plans/phase-03-api.md
```

If no flag provided, defaults to `standard`.

## Your Process

### Parse Arguments

1. Check for `--style` flag in $ARGUMENTS
2. Extract style value: concise | standard | verbose
3. Default to `standard` if not specified
4. Pass style directive to all subagents

### If plan file provided:

1. Read the plan
2. Apply output style to reports
3. Implement precisely
4. Write tests
5. Update docs

### If only description:

1. Ask: should I create a plan first?
2. If yes: create plan, then implement
3. If no: implement directly

## Implementation Steps

1. Parse output style from arguments
2. Load style profile from `.claude/output-styles/{style}.md`
3. Inject style directive into subagent context
4. Validate file ownership (if plan provided)
5. Check phase dependencies are complete
6. Install dependencies (if needed)
7. Create files in order (follow plan sequencing)
8. Modify existing files (only owned files)
9. Write comprehensive tests
10. Update documentation
11. Verify compilation and functionality

### Output Style Integration

When delegating to subagents, include:

```
Apply output style: {concise|standard|verbose}
Guidelines: [content from .claude/output-styles/{style}.md]
```

This ensures all reports follow consistent verbosity.

## Quality Gates

After implementation, run through quality enforcement:

1. **Type Check**: Verify no compilation errors
2. **Test Execution**: Run all relevant tests
3. **Coverage Gate**: Enforce 80%+ coverage threshold
   ```bash
   node .claude/scripts/check-coverage.cjs
   ```
4. **Security Scan**: Detect secrets before commit
   ```bash
   node .claude/scripts/scan-secrets.cjs
   ```
5. **Code Review**: Structured approval workflow (max 3 cycles)
   - Use `/review` command
   - User approval required before commit

## Rules

- Follow plans exactly when provided
- Always write tests for new code
- Update relevant docs
- Report progress per file

## Completion

Report format based on output style:

**Concise**:
```
Implemented [feature].
- Created: [files]
- Tests: [count] passed
- Issue: [if any]
```

**Standard** (default):
```
Implemented [feature] with [key details].

Files Created: [list with brief descriptions]
Tests: [count] passed ([coverage]%)
Issue: [description with recommendation]
```

**Verbose**:
```
Implemented [feature] with full context.

Context: [background and objectives]
Files Created: [detailed list with explanations]
Tests: [count] passed ([coverage]%)
Alternatives Considered: [options]
Performance: [metrics]
Issues: [detailed analysis]
Next Steps: [recommendations]
```

Include:
- Files created/modified counts
- Test results
- How to verify
- Any issues or blockers
