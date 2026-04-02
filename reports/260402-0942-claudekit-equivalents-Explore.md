# ePost Agent Kit: claudekit Concept Equivalents

## Search Summary

Searched 57 skills across `packages/core/skills/`, `packages/design-system/skills/`, `packages/platform-*/skills/`, and `packages/a11y/skills/`. Each skill is a directory containing a `SKILL.md` metadata file plus supporting references.

---

## 1. Team Coordination / Agent Teams

**Match: `subagent-driven-development` skill**

- **Path**: `/Users/than/Projects/epost_agent_kit/packages/core/skills/subagent-driven-development/SKILL.md`
- **Type**: Skill (agent-driven, not user-invocable)
- **What it does**: Orchestrates parallel task execution with per-task subagent dispatch and two-stage review. Implements a strict serial review protocol with file ownership isolation for independent tasks.
- **Key features**:
  - Fresh subagent per task with minimal context (no session history bloat)
  - Two-stage mandatory review: Spec Compliance → Code Quality (in strict order)
  - Per-task artifact trails (files created/modified/read)
  - Max 3 fix-review iterations before escalation
  - ~15x token cost over baseline; only acceptable for work exceeding one context window

**Related**: `plan` skill (`references/parallel-mode.md`) generates plans with file ownership matrix for parallel execution safety.

---

## 2. Visual Aids / Preview Skill

**Match: `preview` skill**

- **Path**: `/Users/than/Projects/epost_agent_kit/packages/core/skills/preview/SKILL.md`
- **Type**: Skill (user-invocable)
- **What it does**: Generates visual explanations using Mermaid diagrams, ASCII art, and HTML interactive pages.
- **Diagram types supported**:
  - Flowchart (process flows, decision trees)
  - Sequence (API calls, auth handshakes, message passing)
  - ER (database schemas, entity relationships)
  - Class (OOP structure, type hierarchies)
  - State (lifecycle models, status transitions)
  - Gantt (project timelines, phase planning)
  - Architecture (system topology using `architecture-beta`)
  - User Journey (UX flows, onboarding paths)
- **Flags**:
  - (none) → Mermaid diagram
  - `--explain <topic>` → ASCII + Mermaid + prose explanation
  - `--ascii <topic>` → Terminal ASCII only
  - `--html <topic>` → Self-contained HTML file, opens in browser

---

## 3. docs-seeker / Context7

**Match: `knowledge` skill + `research` skill**

### A. Internal Knowledge (`knowledge` skill)

- **Path**: `/Users/than/Projects/epost_agent_kit/packages/core/skills/knowledge/SKILL.md`
- **Type**: Skill (non-invocable; retrieval + capture)
- **What it does**: Retrieves internal decisions, patterns, and project context from knowledge base. Also captures learnings post-task.
- **Five-level retrieval chain**:
  1. `docs/` (multi-level) — Decisions, conventions, findings, patterns
  2. RAG systems — Code, components, tokens, implementations
  3. Skills — Methodology, procedures, guidelines
  4. Codebase — Exact matches via Grep/Glob
  5. External — Context7, WebSearch (library APIs, latest external info)
- **Flags**:
  - `--capture` → Persist learnings to `docs/` post-task
  - `--external` → Fetch API/library docs via Context7 or WebSearch

### B. External Documentation Research (`research` skill)

- **Path**: `/Users/than/Projects/epost_agent_kit/packages/core/skills/research/SKILL.md`
- **Type**: Skill (user-invocable; auto-delegates to `epost-researcher` subagent)
- **What it does**: Researches technologies, libraries, best practices, and documentation. Multi-source synthesis with optional autonomous iteration.
- **Flags**:
  - `--fast` → Single-source lookup (official docs or Context7)
  - `--deep` → Full multi-source sweep (docs + GitHub + community + cross-reference)
  - `--codebase` → Internal only (Grep/Glob the project)
  - `--optimize [--iterations N] [--goal "text"]` → Autonomous iterative loop until threshold met
- **Auto-detection**: Simple lookup → fast; evaluation/comparison → deep; "our code" → codebase

**Context7 Integration**: Both skills use Context7 MCP for fetching library/framework documentation.

---

## 4. ai-multimodal / Image and Document Processing

**No direct equivalent found** for generic image/video/document processing AI skill.

**Partial match: `figma` skill** (visual design extraction, not general multimodal)

- **Path**: `/Users/than/Projects/epost_agent_kit/packages/design-system/skills/figma/SKILL.md`
- **Type**: Skill (non-invocable; used by design system agents)
- **What it does**: Extracts Figma design data, maps design tokens to code, compares implementations against Figma designs.
- **MCP tools**:
  - `get_design_context(nodeId)` → React+Tailwind representation
  - `get_variable_defs(nodeId)` → Extract design tokens/variables
  - `get_screenshot(nodeId)` → Get visual reference image
  - `get_metadata(nodeId)` → XML node structure
- **Focus**: Design-to-code pipeline only (klara-theme UI library)
- **Not multimodal**: Specific to Figma extraction, not general image/video/document AI

---

## 5. Documentation Management

**Primary match: `docs` skill**

- **Path**: `/Users/than/Projects/epost_agent_kit/packages/core/skills/docs/SKILL.md`
- **Type**: Skill (user-invocable; auto-delegates to `epost-docs-manager` subagent)
- **What it does**: Generates and maintains project documentation with structured KB workflows. Auto-detects intent (init, update, migrate, scan, verify, reorganize) and runs the right workflow.
- **Workflows** (aspect files):
  - `references/init.md` — Scan codebase and generate or migrate KB documentation
  - `references/update.md` — Update, scan, verify, or reorganize existing documentation
  - `references/component.md` — Document a klara-theme component
  - `references/coauthoring.md` — Collaborative doc writing (PRD, RFC, ADR, spec)
  - `references/llms.md` — Generate llms.txt / llms-full.txt per llmstxt.org spec
- **Auto-detection**: Checks for `docs/index.json`, intent signals, component references, platform-specific paths
- **Output**: Structured KB with `docs/index.json` registry and component documentation

**Secondary match: `knowledge` skill**

The `knowledge` skill also manages docs capture post-task via `--capture` flag, storing findings to `docs/` with proper categorization (decisions, patterns, conventions, findings).

---

## Summary Table

| claudekit Concept | ePost Equivalent | Path | Type | Notes |
|---|---|---|---|---|
| Team coordination / Agent Teams | `subagent-driven-development` | `core/skills/subagent-driven-development/` | Skill | Per-task dispatch, two-stage review, file ownership matrix |
| Visual aids / preview | `preview` | `core/skills/preview/` | Skill | Mermaid, ASCII art, HTML diagrams. User-invocable. |
| docs-seeker / Context7 | `knowledge` + `research` | `core/skills/knowledge/`, `core/skills/research/` | Skills | Internal retrieval (5-level chain) + external research with Context7 MCP |
| ai-multimodal | `figma` (partial) | `design-system/skills/figma/` | Skill | Figma visual extraction only; no general multimodal support |
| Documentation management | `docs` + `knowledge` | `core/skills/docs/`, `core/skills/knowledge/` | Skills | Unified docs generation, KB workflows, post-task capture |

---

## Additional Context

### Skill Discovery

The `skill-discovery` skill (non-invocable) auto-loads relevant skills based on platform, task type, and domain signals. Implements lazy loading with max 3 directly-matched skills (dependencies don't count) and 15 KB token budget.

### Subagent Patterns

Skills that fork subagents include:
- `research` → `epost-researcher`
- `docs` → `epost-docs-manager`
- `plan` → `epost-planner`
- `a11y` → `epost-a11y-specialist`
- `audit` → specialized reviewers (epost-muji, epost-a11y-specialist, epost-code-reviewer)

### Knowledge Base Structure (docs/)

All skills reference `docs/` multi-level knowledge base with:
- **Procedural tier** (skills, methodologies)
- **Codebase tier** (RAG, components, tokens)
- **Project tier** (ADRs, findings, conventions)
- Registry: `docs/index.json` at any level

---

**Report generated**: 2026-04-02 09:42 UTC  
**Search scope**: `packages/*/skills/` across core, design-system, platform, and domain packages  
**Total skills indexed**: 57
