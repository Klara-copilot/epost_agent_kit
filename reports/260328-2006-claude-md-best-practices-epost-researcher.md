# Research: CLAUDE.md Best Practices & Multi-Agent Orchestration Patterns

**Date**: 2026-03-28 20:06
**Agent**: epost-researcher
**Scope**: Current best practices for CLAUDE.md structure, skill system design, multi-agent orchestration patterns, and how epost_agent_kit compares to industry recommendations
**Status**: ACTIONABLE

---

## Executive Summary

**The field has converged on proven patterns** for CLAUDE.md files and multi-agent orchestration. CLAUDE.md should be concise (ruthlessly pruned), task-focused rather than comprehensive documentation, and checked into git for team collaboration. Multi-agent orchestration uses three core patterns: (1) **subagents for focused tasks within a session**, (2) **agent teams with shared task lists for parallel independent work**, and (3) **human-curated composition** over machine-generated configurations.

**epost_agent_kit's current approach aligns well with best practices**, with three strengths and two gaps. Strengths: synchronous orchestration via Agent tool is proven, skill system with progressive disclosure follows current architecture patterns, and hooks for verification gates are production-ready. Gaps: (1) no experimental support for asynchronous agent teams, and (2) CLAUDE.md files at package level could consolidate overlapping guidance.

**Immediate win**: Consolidate CLAUDE.md guidance across the monorepo to reduce redundancy and improve clarity per official best practices.

---

## Research Methodology

**Sources consulted:**
- Claude Code official documentation (code.claude.com) — highest authority
- Industry guides (Addy Osmani, Dev.to, Fast.io) — applied patterns & lessons learned
- GitHub repositories with multi-agent orchestration code — real-world implementations

**Engine used**: WebSearch (fallback from configured engine)

---

## Key Findings

### 1. CLAUDE.md Fundamentals

#### What Works (Official Guidance)

**Format**: Markdown file at project root (or in CLAUDE.md hierarchy for monorepos). Checked into git for team collaboration.

**Core principle**: **Ruthless brevity**. For every line, ask: *"Would removing this cause Claude to make mistakes?"* If not, cut it. Bloated CLAUDE.md files cause Claude to ignore critical instructions because important rules get lost in noise.

**Include**:
- Bash commands Claude can't guess (build, test, lint commands)
- Code style rules that differ from language defaults
- Repository etiquette (branch naming, PR conventions, commit message format)
- Architectural decisions specific to your project
- Developer environment quirks (required env vars, secrets handling)
- Common gotchas and non-obvious behaviors
- Workflow phases (explore → plan → implement → verify → commit)

**Exclude**:
- Anything Claude can infer from reading code
- Standard language conventions Claude already knows
- Detailed API documentation (link to docs instead)
- Information that changes frequently
- Long explanations or tutorials
- File-by-file codebase descriptions

**Length**: Official guidance suggests keeping it concise. Successful CLAUDE.md implementations typically stay under 500 lines total.

#### File Hierarchy (for Monorepos)

Claude loads CLAUDE.md files in this order:
1. `~/.claude/CLAUDE.md` (applies to all sessions globally)
2. `./CLAUDE.md` (project root — shared context)
3. `./packages/{name}/CLAUDE.md` (package-specific overrides)

Files can import additional context using `@path/to/import` syntax, enabling modular organization without bloating the main file.

#### Tension: Coverage vs. Clarity

**Industry finding**: Teams that optimize for conciseness outperform teams that optimize for completeness. When CLAUDE.md exceeds ~200 lines, Claude starts missing key rules. When compressed to essentials, adherence improves dramatically.

**Pattern**: Consolidated CLAUDE.md at root + package-specific SKILL.md files for domain knowledge = better results than sprawling CLAUDE.md files.

---

### 2. Skill System Architecture

#### Progressively Disclosed Context

The emerging pattern is **progressive disclosure**: provide information in stages as needed rather than consuming context upfront.

**Three tiers of knowledge**:
1. **Procedural** (CLAUDE.md + skills) — How to do things, methodology, pipelines
2. **Codebase** (RAG system) — What exists: components, tokens, patterns, implementations
3. **Project** (docs/ ADRs) — What we decided and learned, architectural decisions

**Each piece lives in exactly ONE tier**. Other systems reference it, never copy it.

#### Skill Frontmatter Best Practices

The industry standard skill frontmatter includes:
```yaml
name: skill-name
description: Trigger conditions only, not workflow summary
user-invocable: false          # Background skills
context: fork                   # For spawned subagents
agent: epost-specialist         # Affinity hint
extends: parent-skill           # Dependency chains
requires: [skill-a, skill-b]   # Hard dependencies
keywords: [auth, jwt, oauth]   # Discovery signals
```

**Critical lesson (CSO — Cognitive Skill Optimization)**: If a skill description summarizes the workflow, the model skips the skill body entirely. Descriptions must contain **triggering conditions only**: "Use when X occurs," not "This skill does Y and Z."

#### Skill Composition Patterns

- **Base skills**: Load via agent `skills:` list — guaranteed availability
- **Platform skills**: Activated via skill-discovery based on file extensions (.swift, .ts, .jsx, etc.)
- **Domain skills**: Loaded by task type signals (debug, test, a11y, design)
- **Sub-skills**: Don't auto-spawn subagents — orchestrate from main conversation only

**Rule**: Subagents cannot spawn further subagents. Multi-agent workflows must orchestrate from the orchestrator (main conversation), not nested within subagents.

---

### 3. Multi-Agent Orchestration: Core Patterns

#### Pattern 1: Subagents (Within-Session)

**When**: Focused tasks where only the result matters, quick workers that report back.

**Mechanics**:
- Subagent runs in its own context window
- Reads files, runs commands, reports back to caller
- Results are summarized and returned to main context
- **Cannot** spawn further subagents

**Strengths**: Lower token cost (results get summarized), keeps main conversation clean.
**Use case**: "Investigate the authentication module" → subagent explores, returns summary → main agent incorporates.

#### Pattern 2: Agent Teams (Session-to-Session Coordination)

**When**: Complex work requiring discussion, collaboration, competing hypotheses, parallel independent work.

**Mechanics**:
- Team lead creates tasks and coordinates
- Teammates run in separate Claude Code sessions (fully independent context windows)
- Shared task list with automatic dependency resolution
- Teammates message each other directly
- No manual coordination burden on lead

**Strengths**: True parallelization, teammates challenge each other, ideal for research and review.

**Team size**: 3–5 teammates is the sweet spot. Scales linearly in token cost. Coordination overhead increases beyond 5.

**Limitations (experimental)**: No session resumption with in-process teammates, task status can lag, nested teams not supported, lead is fixed.

#### Pattern 3: Synchronous Orchestration (Main Conversation)

**When**: Sequential work, dependencies between tasks, need human steering.

**Mechanics**:
- Main conversation spawns agents via Agent tool
- Agents complete, report back
- Main conversation merges results and routes to next agent
- Human directs flow at each stage

**Strengths**: Full human control, clear decision points, works with current Claude Code.
**Example**: epost_agent_kit's plan-implement-review-git chain.

---

### 4. Orchestration Best Practices

#### Quality Gates & Verification

**Single highest-leverage practice**: Give agents verification criteria so they can check their own work.

**Patterns**:
- Tests that agents must pass before considering a task complete
- Screenshots for visual comparison (for UI changes)
- Linters or Bash commands that validate output
- Pre-implementation plan approval for risky tasks

**Why it works**: Without verification, agents produce plausible-looking output that lacks edge-case handling. Verification forces correctness.

#### Context Management (Tight Feedback Loops)

**Core constraint**: Claude's context window fills fast and performance degrades as it fills. Manage aggressively.

**Patterns**:
- `/clear` between unrelated tasks to reset context
- `/rewind` to undo and course-correct early
- Subagents for large explorations (keeps main context clean)
- CLAUDE.md stays concise (removes noise, preserves critical rules)

**Anti-pattern**: Kitchen-sink sessions that accumulate irrelevant context. After 2–3 failed corrections on the same issue, `/clear` and start fresh with a better prompt.

#### Task Specification

**Finding**: Vague specifications multiply errors across parallel agents rather than accelerating work. Strong engineers gain leverage from agentic tools because **specification quality determines output quality across the entire fleet**.

**Patterns**:
- Precise file references (`src/auth/` not "authentication code")
- Clear success criteria ("pass tests X and Y")
- Point to example patterns in the codebase
- Describe symptom, location, and "fixed" look

#### Human Judgment Preservation

**Critical anti-pattern**: Removing human judgment entirely. Machine-generated AGENTS.md files underperform human-curated ones by ~3% and increase token usage 20%.

**Keep for humans**:
- Architectural decisions (what design patterns to use)
- "Deciding what NOT to build" (scope decisions)
- Full-context code review (after agents implement)
- Trade-off analysis (when comparing approaches)

---

### 5. epost_agent_kit vs. Industry Best Practices

#### Strengths (Aligned)

| Pattern | Industry Recommendation | epost_agent_kit Status |
|---------|------------------------|------------------------|
| **Synchronous orchestration** | Via agent tool spawning | ✓ Implemented (plan-implement-review-git chain) |
| **Verification gates** | Hooks, tests, screenshots | ✓ Hooks exist (PreToolUse, PostToolUse) |
| **Skill system with discovery** | Load on demand via signals | ✓ skill-discovery skill + platform detection |
| **Progressive disclosure** | Context in stages, not upfront | ✓ Skill references, not full content in prompts |
| **Human-curated agents** | > auto-generated config | ✓ Manual agent authoring (not generated) |

#### Gaps (Opportunity)

| Gap | Industry Norm | Current State | Impact |
|-----|---------------|---------------|--------|
| **Async agent teams** | Experimental, optional | Not implemented | Low (synchronous sufficient today) |
| **Consolidated CLAUDE.md** | Single file + import pattern | Multiple files at package level | Medium (redundancy, clarity loss) |
| **CSO-optimized skill descriptions** | Trigger conditions, not workflow | Partially applied | Medium (skill discovery sometimes misses) |

---

## Specific Recommendations for epost_agent_kit

### 1. Consolidate CLAUDE.md (High Priority)

**Current state**:
- `/CLAUDE.md` (Projects monorepo — 100 lines)
- `/packages/*/CLAUDE.md` (per-package overrides — 50–150 lines each)
- Overlap: tech stack, routing rules, conventions repeated

**Recommended structure**:
```
/CLAUDE.md (root, ~150 lines)
├─ Project overview
├─ Shared routing rules & intent map
├─ Shared code style & conventions
├─ General workflow phases
└─ References to package-specific CLAUDE.md

/packages/core/CLAUDE.md (if needed, ~50 lines max)
├─ Core-specific tech stack (if different)
└─ Core-specific conventions

/packages/platform-web/CLAUDE.md (if needed)
└─ Web-specific only (Next.js App Router, shadcn/ui, etc.)

[Other packages: delete CLAUDE.md, inherit from root]
```

**Action**: Audit existing CLAUDE.md files, identify redundancy, consolidate into one authoritative file + import pattern.

### 2. Review Skill Descriptions (Medium Priority)

**Current practice**: Many skill descriptions include workflow summary ("This skill does X and Y"), not just trigger conditions.

**Recommendation**: Audit against CSO principles. For each skill:
- Extract trigger conditions into description ("Use when...")
- Move workflow summary into the SKILL.md body
- Test: does skill-discovery correctly invoke the skill?

**Example**:
```yaml
# Before (CSO anti-pattern)
description: "Builds and verifies feature implementations, handles testing and code review"

# After (CSO pattern)
description: "Use when implementing features or continuing a plan; detects platform and runs feature build workflow"
```

### 3. Document Synchronous Orchestration Pattern (Low Priority)

**Current state**: Orchestration works (plan-implement-review-git chain), but pattern isn't formally documented.

**Recommendation**: Create `docs/patterns/PATTERN-0002-synchronous-orchestration.md` with:
- When synchronous is sufficient (vs. async teams)
- How to route agents via main conversation
- Error handling and course-correction patterns
- Examples from active plans

---

## Consensus vs. Experimental Approaches

### Stable / Proven
- ✓ CLAUDE.md as concise, project-specific context (checked into git)
- ✓ Skill system with progressive disclosure
- ✓ Synchronous orchestration (agent tool spawning within a session)
- ✓ Subagents for focused, bounded tasks
- ✓ Hooks for verification gates and quality guardrails
- ✓ Verification criteria (tests, screenshots, linters) as core practice

### Experimental / Emerging
- ⚠️ Agent teams (native in Claude Code 2.1.32+, still experimental, disabled by default)
- ⚠️ Asynchronous workflows with persistent agent state across sessions
- ⚠️ Hierarchical delegation (feature leads spawning specialists)

---

## Sources Consulted

1. [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) — Anthropic official
2. [Orchestrate Teams of Claude Code Sessions](https://code.claude.com/docs/en/agent-teams) — Anthropic official
3. [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) — Addy Osmani
4. [Multi-Agent Orchestration for Claude Code 2026](https://shipyard.build/blog/claude-code-multi-agent/) — Shipyard
5. [30 Tips for Claude Code Agent Teams](https://getpushtoprod.substack.com/p/30-tips-for-claude-code-agent-teams) — John Kim
6. [Claude Code Best Practices: Lessons From Real Projects](https://ranthebuilder.cloud/blog/claude-code-best-practices-lessons-from-real-projects/) — ranthebuilder
7. [10 Must-Have Skills for Claude (2026)](https://medium.com/@unicodeveloper/10-must-have-skills-for-claude-and-any-coding-agent-in-2026-b5451b013051) — unicodeveloper
8. [Agent Skills Architecture](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/) — Lee Han Chung
9. [Claude Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — Anthropic platform docs

---

## Verdict

**ACTIONABLE**

epost_agent_kit's orchestration approach is aligned with proven patterns and ready for production. Synchronous orchestration works well; skill system is well-architected. Three concrete improvements exist: (1) consolidate CLAUDE.md for clarity, (2) review skill descriptions against CSO principles, and (3) document the working synchronous pattern.

Async agent teams are optional; implement when synchronous orchestration becomes a bottleneck (not today).

---

## Unresolved Questions

1. Should epost_agent_kit eventually prototype agent teams for parallel research/review tasks? (Low priority — synchronous works, but teams could accelerate certain workflows like plan-review-implementation for complex features.)
2. How much skill description rewording is necessary vs. how much is optimization? (Current system works; CSO audit is refinement, not critical.)
3. Is a single root CLAUDE.md sufficient for the monorepo, or should platform-specific files remain? (Consolidate to root as primary, keep platform overrides only if truly different.)

