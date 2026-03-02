---
title: "Skill Discovery Protocol — Broad Application Investigation"
type: research
status: complete
created: 2026-02-28
---

# Skill Discovery Protocol — Broad Application Investigation

## What It Is

The Skill Discovery Protocol is a runtime mechanism where agents read `.claude/skills/skill-index.json` (47 skills, unified across all packages) to find and load platform-specific skills on demand — instead of relying solely on hardcoded `skills:` lists in agent frontmatter.

**Current state**: Only `epost-architect` and `/plan` commands have this protocol (just implemented).

## The Systemic Gap

### Agents WITHOUT platform skills (generalists)

| Agent | Skills | Platform Knowledge |
|-------|--------|--------------------|
| epost-implementer | core, code-review, debugging, error-recovery, knowledge-retrieval | **None** |
| epost-debugger | core, debugging, knowledge-base, sequential-thinking, problem-solving, docs-seeker, error-recovery | **None** |
| epost-tester | core, error-recovery, debugging | **None** |
| epost-reviewer | core, code-review, knowledge-retrieval, repomix | **None** |
| epost-orchestrator | core, planning, knowledge-retrieval, hub-context | **None** |
| epost-researcher | core, research, docs-seeker, sequential-thinking | **None** |
| epost-documenter | core, docs-seeker, repomix, knowledge-base, knowledge-retrieval, doc-coauthoring | **None** |
| epost-architect | core, planning, doc-coauthoring, knowledge-retrieval, sequential-thinking | **Now has protocol** |

### Agents WITH platform skills (specialists)

| Agent | Platform Skills |
|-------|----------------|
| epost-web-developer | web-nextjs, web-frontend, web-api-routes |
| epost-ios-developer | ios-development |
| epost-android-developer | android-development |
| epost-backend-developer | backend-javaee, backend-databases |

**Problem**: When generalist agents handle platform tasks (which happens via `/cook`, `/debug`, `/test`, `/review` before specialist routing), they operate without platform conventions, testing patterns, or tech stack constraints.

## Skill-Index Schema Analysis

The unified index at `.claude/skills/skill-index.json` already supports discovery:

- **`platforms` field**: `["ios"]`, `["web"]`, `["android"]`, `["all"]` — filterable
- **`keywords` field**: `["swift", "swiftui", "kotlin", "react"]` — searchable
- **`agent-affinity` field**: Suggests which agents should use each skill — advisable
- **`name` prefix**: `ios-*`, `web-*`, `android-*`, `backend-*` — pattern-matchable

**Platform skill counts** (what discovery would find):
- **iOS**: ios-development, ios-rag, ios-ui-lib, ios-a11y (4 skills)
- **Web**: web-nextjs, web-frontend, web-api-routes, web-modules, web-prototype, web-rag, web-ui-lib, web-ui-lib-dev, web-figma, web-figma-variables, web-a11y (11 skills)
- **Android**: android-development, android-ui-lib, android-a11y (3 skills)
- **Backend**: backend-javaee, backend-databases (2 skills)
- **Domain**: domain-b2b (web), domain-b2c (all) (2 skills)

## Three Approaches Compared

### A. Per-Agent Protocol (current approach for architect)
Add "Skill Discovery Protocol" section to each agent's system prompt.

- Pro: Explicit, each agent knows exactly what to do
- Con: Copy-paste across 7 agents, update in 7 places, bloats prompts
- **Verdict**: Doesn't scale

### B. Shared `skill-discovery` Skill
Create one new skill that any agent can reference. Contains: platform detection rules, index lookup logic, skill loading guidance.

- Pro: DRY, single source of truth, easy to add to any agent
- Pro: Leverages existing `skills:` mechanism — no new infrastructure
- Pro: Can be versioned and improved independently
- Con: One more skill file to maintain
- **Verdict**: Best approach

### C. Command-Level Injection Only (current approach for /plan)
Commands detect platform, pass context. Agents remain unaware.

- Pro: No agent modifications needed
- Con: Only works for slash commands, not when agents are dispatched directly
- Con: Every command needs its own detection block
- **Verdict**: Good complement, not sufficient alone

### Recommended: Hybrid B+C
- Create `skill-discovery` skill (shared protocol)
- Add to generalist agents' `skills:` lists
- Keep command-level detection as input boost (platform hint)
- Agents use the skill's protocol when no command-level hint exists

## Broad Application Priority

### High Value (do first)
1. **epost-implementer** — Builds all code. When `/cook` can't route to specialist (mixed changes, unclear platform), implementer handles it blind.
2. **epost-debugger** — Debugging iOS concurrency without knowing Swift 6 patterns = wasted cycles.
3. **epost-tester** — Each platform has different test frameworks (XCTest vs JUnit vs Jest). Without platform skill, generates wrong test patterns.

### Medium Value (do second)
4. **epost-reviewer** — Code review without platform conventions misses platform-specific anti-patterns.
5. **epost-orchestrator** — Routes tasks; knowing available skills improves routing decisions.

### Low Value (skip or later)
6. **epost-researcher** — Mostly external research, platform skills less critical.
7. **epost-documenter** — Documents code, could benefit but not critical path.
8. **epost-brainstormer, epost-scout, epost-guide, epost-git-manager** — Platform-agnostic by nature.

## What the `skill-discovery` Skill Would Contain

```
1. Platform Detection (if not provided by command)
   - Check git diff for file extensions
   - Check CWD path for platform directories
   - Check user request for platform keywords

2. Skill Lookup
   - Read .claude/skills/skill-index.json
   - Filter by: platforms field matching detected platform
   - Filter by: name prefix (ios-, web-, android-, backend-)
   - Rank by: agent-affinity (prefer skills listing current agent)

3. Skill Loading
   - Read top 3-5 most relevant SKILL.md files
   - Extract: tech stack, conventions, patterns, testing approach
   - Apply to current task context

4. Fallback
   - No platform detected → skip, proceed generically
   - Skill file missing → warn, continue without it
```

## Unresolved Questions

1. **Token budget**: Reading 3-5 SKILL.md files adds ~2K-5K tokens. Acceptable for most agents, but could strain tester/reviewer which run frequently. Worth profiling.
2. **Skill precedence**: If agent already has platform skills in `skills:` list (like ios-developer), should discovery add MORE skills (like ios-a11y, ios-rag)? Or is the hardcoded list sufficient?
3. **Cross-platform tasks**: When git diff shows both `.swift` and `.tsx` files, should discovery load both platform skill sets? Or pick dominant?
