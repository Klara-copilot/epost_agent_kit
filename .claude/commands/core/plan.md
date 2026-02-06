---
title: Plan Command
description: ⚡⚡⚡ Intelligent plan creation with prompt enhancement
argument-hint: [feature description]
---

# Plan Command (Splash Router)

Intelligent router that analyzes task complexity and routes to appropriate planning variant.

## Usage

```
/plan [feature description]
```

## Router Process

This is a **splash pattern router** — it performs complexity analysis and routes to specialized variants:

1. **Parse Arguments**: Extract feature description from `$ARGUMENTS`
2. **Check Active Plan**: Detect existing active plan from Plan Context
3. **Analyze Complexity**: Score task on 3 axes (Scope, Research, Parallelism)
4. **Enhance Prompt**: Transform raw input into detailed planning instructions
5. **Route to Variant**: Execute appropriate SlashCommand
   - `/plan:fast` - Simple tasks (score 0-1)
   - `/plan:hard` - Moderate/complex tasks (score 2-4, **DEFAULT**)
   - `/plan:parallel` - Parallelizable tasks (score 5-6 with parallelism ≥ 2)

## Complexity Analysis Algorithm

Score the task on **3 axes** (0-2 points each, max 6):

### Axis 1: Scope (0-2)
- **0 points**: Single file/fix, localized change
  - Keywords: "fix", "update field", "change text", "typo", "rename variable"
- **1 point**: Multi-file feature, single module
  - Keywords: "add feature", "implement component", "create page"
- **2 points**: Cross-module/platform, architectural change
  - Keywords: "migrate", "refactor architecture", "multi-platform", "system-wide"

### Axis 2: Research Required (0-2)
- **0 points**: Known patterns, existing code similar
  - Keywords: "like existing", "copy pattern from", "similar to"
- **1 point**: Some unknowns, need to explore APIs/docs
  - Keywords: "integrate", "use library", "implement standard"
- **2 points**: Major unknowns, new technology/approach
  - Keywords: "research", "evaluate", "proof of concept", "new to codebase"

### Axis 3: Parallelism Potential (0-2)
- **0 points**: Sequential dependencies only
  - Keywords: "then", "after", "depends on", "migration"
- **1 point**: Some independent work possible
  - Keywords: "and", "plus", "also", "separate"
- **2 points**: Clear parallel groups (frontend AND backend, multi-platform)
  - Keywords: "frontend AND backend", "database AND API AND UI", "iOS AND Android"

### Routing Rules

```
Total Score = Scope + Research + Parallelism

IF Score ≤ 1:
  Route to /plan:fast

ELSE IF Score >= 5 AND Parallelism >= 2:
  Route to /plan:parallel

ELSE:
  Route to /plan:hard (DEFAULT for ambiguous cases)
```

## Active Plan Detection

Check Plan Context injection for existing active plan:

```markdown
IF Plan Context shows active plan path:
  DISPLAY WARNING: "⚠️ Active plan detected: {plan-path}"
  ASK USER: "Create new plan? (Active plan can be changed later via set-active-plan.cjs)"

  IF user says NO:
    STOP, suggest using existing plan

  IF user says YES:
    PROCEED with routing

ELSE:
  PROCEED normally (no active plan)
```

## Prompt Enhancement Template

Transform raw user input into detailed planning instructions:

```markdown
## Enhanced Planning Prompt

**Original Request**: {$ARGUMENTS}

**Complexity Assessment**:
- Scope score: {0-2}
- Research score: {0-2}
- Parallelism score: {0-2}
- Total: {0-6} → Routing to /plan:{variant}

**Planning Requirements**:
1. Create plan directory: `plans/YYMMDD-HHMM-{slug}/`
2. Generate plan.md with YAML frontmatter
3. Create phase files: phase-XX-name.md
4. Include for each phase:
   - Context links to research/reports
   - File ownership (files to modify/create/delete)
   - Implementation steps (numbered, specific)
   - Success criteria (testable)
   - Risk assessment
   - Security considerations

**Codebase Context to Read**:
- docs/system-architecture.md
- docs/code-standards.md
- docs/codebase-summary.md (if exists)
- Relevant existing code via Grep/Glob

**Output Format**:
Follow the plan structure defined in .claude/rules/documentation-management.md
```

## Your Execution Steps

### Step 1: Parse & Validate Input
```
IF $ARGUMENTS is empty:
  PROMPT user: "Please describe the feature/task to plan"
  WAIT for input

EXTRACT description = $ARGUMENTS
SANITIZE description:
  - Strip leading/trailing whitespace
  - Remove control characters
  - Limit to 1000 characters
  - Escape special markdown characters in user input
```

### Step 2: Check Active Plan
```
READ "Plan Context" section from system-reminder hooks

IF active plan detected:
  WARN user with plan path
  ASK: "Continue with new plan?"
  IF NO: EXIT
```

### Step 3: Analyze Complexity
```
ANALYZE description for keywords:
  - Scope indicators
  - Research indicators
  - Parallelism indicators

CALCULATE scores:
  scope_score = 0-2
  research_score = 0-2
  parallelism_score = 0-2
  total_score = sum of above

DETERMINE variant:
  IF total_score <= 1: variant = "fast"
  ELSE IF total_score >= 5 AND parallelism_score >= 2: variant = "parallel"
  ELSE: variant = "hard"
```

### Step 4: Enhance Prompt
```
GENERATE enhanced_prompt using template above:
  - Include original request
  - Include complexity scores
  - Include planning requirements
  - Include codebase context paths
```

### Step 5: Route to Variant
```
TRY:
  EXECUTE SlashCommand: /plan:{variant} {enhanced_prompt}

CATCH variant_not_found:
  WARN: "Variant /plan:{variant} not found. Using epost-architect agent as fallback."
  DELEGATE to agent: epost-architect with {enhanced_prompt}

CATCH slashcommand_failure:
  WARN: "SlashCommand system unavailable. Using epost-architect agent as fallback."
  DELEGATE to agent: epost-architect with {enhanced_prompt}

CATCH any_error:
  ERROR: "Router failed: {error_details}"
  SUGGEST: "Try /plan:hard {description} or use epost-architect agent directly"
  EXIT with error message
```

## Examples

### Example 1: Simple Task
```
User: /plan fix typo in header component

Analysis:
- Scope: 0 (single file)
- Research: 0 (known pattern)
- Parallelism: 0 (sequential)
- Total: 0

Route: /plan:fast
```

### Example 2: Complex Feature
```
User: /plan implement user authentication with JWT and session management

Analysis:
- Scope: 1 (multi-file feature)
- Research: 1 (standard patterns, need JWT library)
- Parallelism: 0 (auth is sequential)
- Total: 2

Route: /plan:hard
```

### Example 3: Parallel Implementation
```
User: /plan build analytics dashboard with backend API, database schema, and React frontend

Analysis:
- Scope: 2 (cross-module: DB + API + Frontend)
- Research: 1 (standard patterns)
- Parallelism: 2 (clear parallel groups)
- Total: 5

Route: /plan:parallel
```

## Completion Report

After routing, report:
```
✓ Routed to /plan:{variant}
  - Complexity: {total_score}/6 (Scope:{X}, Research:{Y}, Parallelism:{Z})
  - Variant command executing...
```

## Constraints

- Router execution time: <5 seconds (no external calls)
- No file writes in router (variants handle plan creation)
- No research in router (variants handle research delegation)
- Backward compatible: bare `/plan` still works
- File size: <200 LOC (current: ~180 LOC)

## Fallback Strategy

**Primary**: Route to appropriate variant command
**Secondary**: Fallback to epost-architect agent (until variants exist)
**Tertiary**: Display error with manual instructions

```
FALLBACK CHAIN:
1. TRY /plan:{variant} command (if exists)
2. FALLBACK to epost-architect agent with enhanced prompt
3. IF agent unavailable: Display error + suggest manual /plan:hard or contact support

TEMPORARY FALLBACK (Phase 01-03):
  Until variants created, all routes use epost-architect agent as fallback.
  This maintains backward compatibility while variants are being developed.
```

## Security

**Input Sanitization**:
- User input ($ARGUMENTS) is sanitized before processing
- Maximum length: 1000 characters
- Control characters stripped
- Special markdown characters escaped
- No code injection possible through description field
